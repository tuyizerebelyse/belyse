const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

// Database and tables creation SQL
const initializationSQL = `
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS SIMS;

-- Use the database
USE SIMS;

-- Admin (User) Table
CREATE TABLE IF NOT EXISTS Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL, -- Hashed
    Role VARCHAR(20) NOT NULL,
    LastLogin DATETIME
);

-- Spare_Part Table
CREATE TABLE IF NOT EXISTS Spare_Part (
    PartID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Category VARCHAR(50),
    Quantity INT DEFAULT 0,
    UnitPrice DECIMAL(10, 2),
    TotalPrice DECIMAL(10, 2) AS (Quantity * UnitPrice) STORED
);

-- Stock_In Table
CREATE TABLE IF NOT EXISTS Stock_In (
    StockInID INT AUTO_INCREMENT PRIMARY KEY,
    StockInQuantity INT NOT NULL,
    StockInDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PartID INT,
    AdminID INT,
    FOREIGN KEY (PartID) REFERENCES Spare_Part(PartID),
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

-- Stock_Out Table
CREATE TABLE IF NOT EXISTS Stock_Out (
    StockOutID INT AUTO_INCREMENT PRIMARY KEY,
    StockOutQuantity INT NOT NULL,
    StockOutUnitPrice DECIMAL(10, 2),
    StockOutTotalPrice DECIMAL(10, 2) AS (StockOutQuantity * StockOutUnitPrice) STORED,
    StockOutDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PartID INT,
    AdminID INT,
    FOREIGN KEY (PartID) REFERENCES Spare_Part(PartID),
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

-- Report Table
CREATE TABLE IF NOT EXISTS Report (
    ReportID INT AUTO_INCREMENT PRIMARY KEY,
    ReportDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Summary VARCHAR(255),
    Details TEXT,
    AdminID INT,
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);
`;

async function initializeDatabase() {
  let connection;
  try {
    // Connect to MySQL server
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server');

    // Execute initialization SQL
    await connection.query(initializationSQL);
    console.log('Database and tables created successfully');

    // Optionally, you can add some initial data here
    // await seedInitialData(connection);

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed');
      return connection;
    }
  }
}

// Run the initialization
module.exports =  initializeDatabase;