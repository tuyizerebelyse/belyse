const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smartpark_crpms'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// User registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username already exists' });
          }
          throw err;
        }
        res.json({ message: 'User registered successfully!' });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) throw err;
      
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (passwordMatch) {
        req.session.user = {
          id: user.id,
          username: user.username
        };
        res.json({ message: 'Login successful', user: req.session.user });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    }
  );
});

// User logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Check auth status
app.get('/api/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Protected API Routes (all existing routes should be wrapped with isAuthenticated)

// Services
app.get('/api/services', isAuthenticated, (req, res) => {
  db.query('SELECT * FROM Service', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Cars
app.get('/api/cars', isAuthenticated, (req, res) => {
  db.query('SELECT * FROM Car', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/cars', isAuthenticated, (req, res) => {
  const { PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;
  db.query(
    'INSERT INTO Car (PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName) VALUES (?, ?, ?, ?, ?, ?)',
    [PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Car added successfully!', id: result.insertId });
    }
  );
});

// Service Records
app.get('/api/service-records', isAuthenticated, (req, res) => {
  db.query(`
    SELECT sr.RecordNumber, c.PlateNumber, c.Type, c.Model, s.ServiceName, s.ServicePrice, sr.ServiceDate 
    FROM ServiceRecord sr
    JOIN Car c ON sr.PlateNumber = c.PlateNumber
    JOIN Service s ON sr.ServiceCode = s.ServiceCode
  `, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/service-records', isAuthenticated, (req, res) => {
  const { PlateNumber, ServiceCode } = req.body;
  db.query(
    'INSERT INTO ServiceRecord (PlateNumber, ServiceCode) VALUES (?, ?)',
    [PlateNumber, ServiceCode],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Service record added successfully!', id: result.insertId });
    }
  );
});

// Payments
app.get('/api/payments', isAuthenticated, (req, res) => {
  db.query(`
    SELECT p.PaymentNumber, p.AmountPaid, p.PaymentDate, 
          sr.RecordNumber, c.PlateNumber, c.Type, c.Model, s.ServiceName, s.ServicePrice
    FROM Payment p
    JOIN ServiceRecord sr ON p.RecordNumber = sr.RecordNumber
    JOIN Car c ON sr.PlateNumber = c.PlateNumber
    JOIN Service s ON sr.ServiceCode = s.ServiceCode
  `, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/payments', isAuthenticated, (req, res) => {
  const { RecordNumber, AmountPaid } = req.body;
  db.query(
    'INSERT INTO Payment (RecordNumber, AmountPaid) VALUES (?, ?)',
    [RecordNumber, AmountPaid],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Payment added successfully!', id: result.insertId });
    }
  );
});

// Reports
app.get('/api/reports/daily', isAuthenticated, (req, res) => {
  const { date } = req.query;
  db.query(`
    SELECT p.PaymentDate, c.PlateNumber, c.Type, c.Model, s.ServiceName, s.ServicePrice, p.AmountPaid
    FROM Payment p
    JOIN ServiceRecord sr ON p.RecordNumber = sr.RecordNumber
    JOIN Car c ON sr.PlateNumber = c.PlateNumber
    JOIN Service s ON sr.ServiceCode = s.ServiceCode
    WHERE DATE(p.PaymentDate) = ?
  `, [date], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Cars endpoints
app.put('/api/cars/:plateNumber', isAuthenticated, (req, res) => {
  const { plateNumber } = req.params;
  const { Type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;
  db.query(
    'UPDATE Car SET Type = ?, Model = ?, ManufacturingYear = ?, DriverPhone = ?, MechanicName = ? WHERE PlateNumber = ?',
    [Type, Model, ManufacturingYear, DriverPhone, MechanicName, plateNumber],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Car updated successfully!' });
    }
  );
});

app.delete('/api/cars/:plateNumber', isAuthenticated, (req, res) => {
  const { plateNumber } = req.params;
  db.query(
    'DELETE FROM Car WHERE PlateNumber = ?',
    [plateNumber],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Car deleted successfully!' });
    }
  );
});

// Services endpoints
app.put('/api/services/:serviceCode', isAuthenticated, (req, res) => {
  const { serviceCode } = req.params;
  const { ServiceName, ServicePrice } = req.body;
  db.query(
    'UPDATE Service SET ServiceName = ?, ServicePrice = ? WHERE ServiceCode = ?',
    [ServiceName, ServicePrice, serviceCode],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Service updated successfully!' });
    }
  );
});

app.delete('/api/services/:serviceCode', isAuthenticated, (req, res) => {
  const { serviceCode } = req.params;
  db.query(
    'DELETE FROM Service WHERE ServiceCode = ?',
    [serviceCode],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Service deleted successfully!' });
    }
  );
});

// Service Records endpoints
app.put('/api/service-records/:recordNumber', isAuthenticated, (req, res) => {
  const { recordNumber } = req.params;
  const { PlateNumber, ServiceCode } = req.body;
  db.query(
    'UPDATE ServiceRecord SET PlateNumber = ?, ServiceCode = ? WHERE RecordNumber = ?',
    [PlateNumber, ServiceCode, recordNumber],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Service record updated successfully!' });
    }
  );
});

app.delete('/api/service-records/:recordNumber', isAuthenticated, (req, res) => {
  const { recordNumber } = req.params;
  db.query(
    'DELETE FROM ServiceRecord WHERE RecordNumber = ?',
    [recordNumber],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Service record deleted successfully!' });
    }
  );
});

// Payments endpoints
app.put('/api/payments/:paymentNumber', isAuthenticated, (req, res) => {
  const { paymentNumber } = req.params;
  const { RecordNumber, AmountPaid } = req.body;
  db.query(
    'UPDATE Payment SET RecordNumber = ?, AmountPaid = ? WHERE PaymentNumber = ?',
    [RecordNumber, AmountPaid, paymentNumber],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Payment updated successfully!' });
    }
  );
});

app.delete('/api/payments/:paymentNumber', isAuthenticated, (req, res) => {
  const { paymentNumber } = req.params;
  db.query(
    'DELETE FROM Payment WHERE PaymentNumber = ?',
    [paymentNumber],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Payment deleted successfully!' });
    }
  );
});

// ================== REPORT GENERATION ================== //

// Daily sales report
app.get('/reports/daily-sales', isAuthenticated, async (req, res) => {
    try {
        const [results] = await pool.query(`
           SELECT 
            p.PaymentDate, 
            c.PlateNumber, 
            c.Type, 
            c.Model, 
            s.ServiceName, 
            s.ServicePrice, 
            p.AmountPaid
          FROM Payment p
          JOIN ServiceRecord sr ON p.RecordNumber = sr.RecordNumber
          JOIN Car c ON sr.PlateNumber = c.PlateNumber
          JOIN Service s ON sr.ServiceCode = s.ServiceCode
          WHERE DATE(p.PaymentDate) = CURDATE()

        `);
        
        res.json({ success: true, data: results });
    } catch (error) {
        console.error('Daily report error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate report' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});