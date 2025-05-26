require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// DB Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smartpark_cwsms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_ultra_secure_secret';

// Auth Middleware
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (!users.length) throw new Error();
    req.user = users[0];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ======================= AUTH =========================

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'receptionist']
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!users.length) throw new Error('Invalid credentials');

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ======================= CARS =========================

app.get('/api/cars', authenticate, async (req, res) => {
  try {
    const [cars] = await pool.query('SELECT * FROM cars');
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/cars', authenticate, async (req, res) => {
  try {
    const { plate_number, car_type, car_size, driver_name, phone_number } = req.body;
    await pool.query(
      'INSERT INTO cars (plate_number, car_type, car_size, driver_name, phone_number) VALUES (?, ?, ?, ?, ?)',
      [plate_number, car_type, car_size, driver_name, phone_number]
    );
    res.status(201).json({ message: 'Car added successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/cars/count', authenticate, async (req, res) => {
  try {
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM cars');
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================= PACKAGES =========================

app.get('/api/packages', authenticate, async (req, res) => {
  try {
    const [packages] = await pool.query('SELECT * FROM packages');
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================= SERVICES =========================

app.get('/api/services', authenticate, async (req, res) => {
  try {
    const { date } = req.query;
    let sql = `
      SELECT sp.*, c.driver_name, c.phone_number, p.package_name, p.package_price 
      FROM service_packages sp
      JOIN cars c ON sp.plate_number = c.plate_number
      JOIN packages p ON sp.package_number = p.package_number
    `;
    const params = [];

    if (date) {
      sql += ' WHERE DATE(sp.service_date) = ?';
      params.push(date);
    }

    const [services] = await pool.query(sql, params);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/services/today/count', authenticate, async (req, res) => {
  try {
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) as count FROM service_packages WHERE DATE(service_date) = CURDATE()'
    );
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/services', authenticate, async (req, res) => {
  try {
    const { plate_number, package_number, service_date } = req.body;

    const [cars] = await pool.query('SELECT * FROM cars WHERE plate_number = ?', [plate_number]);
    if (!cars.length) return res.status(400).json({ message: 'Car not found' });

    const [packages] = await pool.query('SELECT * FROM packages WHERE package_number = ?', [package_number]);
    if (!packages.length) return res.status(400).json({ message: 'Package not found' });

    const [result] = await pool.query(
      'INSERT INTO service_packages (plate_number, package_number, service_date) VALUES (?, ?, ?)',
      [plate_number, package_number, service_date || new Date()]
    );

    res.status(201).json({ 
      message: 'Service recorded successfully',
      record_number: result.insertId,
      package_price: packages[0].package_price
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ======================= PAYMENTS =========================

app.get('/api/payments', authenticate, async (req, res) => {
  try {
    const { date } = req.query;
    const query = date 
      ? 'SELECT * FROM payments WHERE DATE(payment_date) = ?'
      : 'SELECT * FROM payments';
    
    const [payments] = await pool.query(query, date ? [date] : []);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/payments', authenticate, async (req, res) => {
  try {
    const { record_number, amount_paid, payment_date } = req.body;
    await pool.query(
      'INSERT INTO payments (record_number, amount_paid, payment_date) VALUES (?, ?, ?)',
      [record_number, amount_paid, payment_date || new Date()]
    );
    res.status(201).json({ message: 'Payment recorded successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/payments/today/revenue', authenticate, async (req, res) => {
  try {
    const [[{ revenue }]] = await pool.query(
      'SELECT SUM(amount_paid) as revenue FROM payments WHERE DATE(payment_date) = CURDATE()'
    );
    res.json({ revenue: revenue || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================= REPORTS =========================

app.get('/api/reports/daily', authenticate, async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();

    const [report] = await pool.query(`
      SELECT 
        sp.service_date,
        c.plate_number,
        c.car_type,
        c.driver_name,
        p.package_name,
        p.package_description,
        p.package_price
      FROM service_packages sp
      JOIN cars c ON sp.plate_number = c.plate_number
      JOIN packages p ON sp.package_number = p.package_number
      WHERE DATE(sp.service_date) = ?
      ORDER BY sp.service_date DESC
    `, [queryDate.toISOString().split('T')[0]]);

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================= ACTIVITIES =========================

app.get('/api/activities/recent', authenticate, async (req, res) => {
  try {
    const [activities] = await pool.query(`
      (SELECT 'car_registered' as type, plate_number as identifier, 
              CONCAT('New car registered: ', plate_number) as description,
              created_at as timestamp
       FROM cars
       ORDER BY created_at DESC
       LIMIT 5)
      UNION ALL
      (SELECT 'service_recorded' as type, record_number as identifier,
              CONCAT('Service recorded for car: ', plate_number) as description,
              service_date as timestamp
       FROM service_packages
       ORDER BY service_date DESC
       LIMIT 5)
      ORDER BY timestamp DESC
      LIMIT 5
    `);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update car
app.put('/api/cars/:plate_number', authenticate, async (req, res) => {
  try {
    const { plate_number } = req.params;
    const { car_type, car_size, driver_name, phone_number } = req.body;

    await pool.query(
      'UPDATE cars SET car_type = ?, car_size = ?, driver_name = ?, phone_number = ? WHERE plate_number = ?',
      [car_type, car_size, driver_name, phone_number, plate_number]
    );
    res.json({ message: 'Car updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete car
app.delete('/api/cars/:plate_number', authenticate, async (req, res) => {
  try {
    const { plate_number } = req.params;
    await pool.query('DELETE FROM cars WHERE plate_number = ?', [plate_number]);
    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.put('/api/services/:record_number', authenticate, async (req, res) => {
  try {
    const { record_number } = req.params;
    const { plate_number, package_number, service_date } = req.body;

    await pool.query(
      'UPDATE service_packages SET plate_number = ?, package_number = ?, service_date = ? WHERE record_number = ?',
      [plate_number, package_number, service_date, record_number]
    );

    res.json({ message: 'Service updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/services/:record_number', authenticate, async (req, res) => {
  try {
    const { record_number } = req.params;
    await pool.query('DELETE FROM service_packages WHERE record_number = ?', [record_number]);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// ======================= SERVER START =========================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
