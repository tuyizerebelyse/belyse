const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const initializeDatabase = require('./db-table-prepared');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'SIMS',
  port: 3306
};

// Helper function to create database connection
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// Initialize database on startup
initializeDatabase().then(() => {
  console.log('Database initialization completed');
});

// Authentication Middleware
async function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM Admin WHERE AdminID = ?',
      [token]
    );
    connection.end();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// Admin Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO Admin (Username, Password, Role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );
    connection.end();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM Admin WHERE Username = ?',
      [username]
    );
    connection.end();
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.Password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    const updateConn = await getConnection();
    await updateConn.execute(
      'UPDATE Admin SET LastLogin = NOW() WHERE AdminID = ?',
      [user.AdminID]
    );
    updateConn.end();
    
    res.json({ 
      message: 'Login successful', 
      user: { id: user.AdminID, username: user.Username, role: user.Role } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Spare Part Routes
app.get('/api/spare-parts', authenticate, async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Spare_Part');
    connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spare parts' });
  }
});

app.post('/api/spare-parts', authenticate, async (req, res) => {
  try {
    const { name, category, quantity, unitPrice } = req.body;
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO Spare_Part (Name, Category, Quantity, UnitPrice) VALUES (?, ?, ?, ?)',
      [name, category, quantity, unitPrice]
    );
    connection.end();
    res.status(201).json({ message: 'Spare part added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add spare part' });
  }
});

// Stock In Routes
app.get('/api/stock-in', authenticate, async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT si.StockInID, si.StockInQuantity, si.StockInDate, 
             sp.Name as PartName, sp.PartID, a.Username as AdminName
      FROM Stock_In si
      JOIN Spare_Part sp ON si.PartID = sp.PartID
      JOIN Admin a ON si.AdminID = a.AdminID
    `);
    connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock in records' });
  }
});

app.post('/api/stock-in', authenticate, async (req, res) => {
  try {
    const { partId, stockInQuantity, adminId } = req.body;
    const connection = await getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    // Add stock in record
    await connection.execute(
      'INSERT INTO Stock_In (PartID, StockInQuantity, AdminID) VALUES (?, ?, ?)',
      [partId, stockInQuantity, adminId]
    );
    
    // Update spare part quantity
    await connection.execute(
      'UPDATE Spare_Part SET Quantity = Quantity + ? WHERE PartID = ?',
      [stockInQuantity, partId]
    );
    
    // Commit transaction
    await connection.commit();
    connection.end();
    
    res.status(201).json({ message: 'Stock in recorded successfully' });
  } catch (error) {
    // Rollback transaction if error occurs
    if (connection) {
      await connection.rollback();
      connection.end();
    }
    res.status(500).json({ error: 'Failed to record stock in' });
  }
});

// Stock Out Routes
app.get('/api/stock-out', authenticate, async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT so.StockOutID, so.StockOutQuantity, so.StockOutUnitPrice, so.StockOutDate,
             so.StockOutTotalPrice, sp.Name as PartName, sp.PartID, a.Username as AdminName
      FROM Stock_Out so
      JOIN Spare_Part sp ON so.PartID = sp.PartID
      JOIN Admin a ON so.AdminID = a.AdminID
    `);
    connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock out records' });
  }
});

app.post('/api/stock-out', authenticate, async (req, res) => {
  try {
    const { partId, stockOutQuantity, stockOutUnitPrice, adminId } = req.body;
    const connection = await getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    // Check available quantity
    const [rows] = await connection.execute(
      'SELECT Quantity FROM Spare_Part WHERE PartID = ?',
      [partId]
    );
    
    if (rows.length === 0 || rows[0].Quantity < stockOutQuantity) {
      throw new Error('Insufficient stock');
    }
    
    // Add stock out record
    await connection.execute(
      'INSERT INTO Stock_Out (PartID, StockOutQuantity, StockOutUnitPrice, AdminID) VALUES (?, ?, ?, ?)',
      [partId, stockOutQuantity, stockOutUnitPrice, adminId]
    );
    
    // Update spare part quantity
    await connection.execute(
      'UPDATE Spare_Part SET Quantity = Quantity - ? WHERE PartID = ?',
      [stockOutQuantity, partId]
    );
    
    // Commit transaction
    await connection.commit();
    connection.end();
    
    res.status(201).json({ message: 'Stock out recorded successfully' });
  } catch (error) {
    // Rollback transaction if error occurs
    if (connection) {
      await connection.rollback();
      connection.end();
    }
    res.status(500).json({ error: error.message || 'Failed to record stock out' });
  }
});

app.put('/api/stock-out/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { stockOutQuantity, stockOutUnitPrice } = req.body;
    
    const connection = await getConnection();
    await connection.execute(
      'UPDATE Stock_Out SET StockOutQuantity = ?, StockOutUnitPrice = ? WHERE StockOutID = ?',
      [stockOutQuantity, stockOutUnitPrice, id]
    );
    connection.end();
    
    res.json({ message: 'Stock out updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock out' });
  }
});

app.delete('/api/stock-out/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    await connection.execute('DELETE FROM Stock_Out WHERE StockOutID = ?', [id]);
    connection.end();
    res.json({ message: 'Stock out deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stock out' });
  }
});

// Report Routes
app.get('/api/reports/stock-status', authenticate, async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT 
        sp.PartID, 
        sp.Name, 
        sp.Category, 
        sp.Quantity as StoredQuantity,
        COALESCE(SUM(si.StockInQuantity), 0) as TotalStockIn,
        COALESCE(SUM(so.StockOutQuantity), 0) as TotalStockOut,
        (sp.Quantity + COALESCE(SUM(si.StockInQuantity), 0) - COALESCE(SUM(so.StockOutQuantity), 0)) as RemainingQuantity
      FROM Spare_Part sp
      LEFT JOIN Stock_In si ON sp.PartID = si.PartID
      LEFT JOIN Stock_Out so ON sp.PartID = so.PartID
      GROUP BY sp.PartID, sp.Name, sp.Category, sp.Quantity
    `);
    connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate stock status report' });
  }
});

app.get('/api/reports/daily-stock-out', authenticate, async (req, res) => {
  try {
    const { date } = req.query;
    const connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT 
        so.StockOutID,
        sp.Name as PartName,
        so.StockOutQuantity,
        so.StockOutUnitPrice,
        so.StockOutTotalPrice,
        so.StockOutDate,
        a.Username as AdminName
      FROM Stock_Out so
      JOIN Spare_Part sp ON so.PartID = sp.PartID
      JOIN Admin a ON so.AdminID = a.AdminID
      WHERE DATE(so.StockOutDate) = ?
    `, [date || new Date().toISOString().split('T')[0]]);
    connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate daily stock out report' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});