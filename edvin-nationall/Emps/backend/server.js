require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'EPMS',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_strong_secret_key_here';

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // In production, you would check against a users table in the database
        if (username === 'admin' && password === 'admin123') {
            const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ success: true, token });
        }
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Authentication middleware
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Malformed token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Employee routes
app.get('/employees', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Employee');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/employees', authenticate, async (req, res) => {
    try {
        const { FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartmentCode } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO Employee (FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartmentCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartmentCode]
        );
        
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Department routes
app.get('/departments', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Department');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Salary routes
app.get('/salaries', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.*, e.FirstName, e.LastName 
            FROM Salary s
            JOIN Employee e ON s.employeeNumber = e.employeeNumber
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching salaries:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/salaries', authenticate, async (req, res) => {
    try {
        const { employeeNumber, GrossSalary, TotalDeduction, NetSalary, month } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO Salary (employeeNumber, GrossSalary, TotalDeduction, NetSalary, month) VALUES (?, ?, ?, ?, ?)',
            [employeeNumber, GrossSalary, TotalDeduction, NetSalary, month]
        );
        
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creating salary:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/salaries/:id', authenticate, async (req, res) => {
    try {
        const { GrossSalary, TotalDeduction, NetSalary, month } = req.body;
        const salaryID = req.params.id;
        
        await pool.query(
            'UPDATE Salary SET GrossSalary = ?, TotalDeduction = ?, NetSalary = ?, month = ? WHERE salaryID = ?',
            [GrossSalary, TotalDeduction, NetSalary, month, salaryID]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating salary:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.delete('/salaries/:id', authenticate, async (req, res) => {
    try {
        await pool.query('DELETE FROM Salary WHERE salaryID = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting salary:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Monthly report
app.get('/report/monthly', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT e.FirstName, e.LastName, e.Position, d.DepartmentName, 
                   s.NetSalary, s.month, s.GrossSalary, s.TotalDeduction
            FROM Salary s
            JOIN Employee e ON s.employeeNumber = e.employeeNumber
            JOIN Department d ON e.DepartmentCode = d.DepartmentCode
            ORDER BY s.month DESC, e.LastName ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Dashboard stats endpoint (no projects)
app.get('/dashboard/stats', authenticate, async (req, res) => {
    try {
        const [[{ totalEmployees }]] = await pool.query('SELECT COUNT(*) AS totalEmployees FROM employee');
        const [[{ totalDepartments }]] = await pool.query('SELECT COUNT(*) AS totalDepartments FROM department');
        const [[{ payrollThisMonth }]] = await pool.query(`
            SELECT IFNULL(SUM(NetSalary), 0) AS payrollThisMonth
            FROM salary
            WHERE MONTH(month) = MONTH(CURRENT_DATE()) AND YEAR(month) = YEAR(CURRENT_DATE())
        `);

        res.json({
            totalEmployees,
            totalDepartments,
            payrollThisMonth
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));