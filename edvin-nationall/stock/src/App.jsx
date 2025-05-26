import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SparePartList from './components/SparePart/SparePartList';
import AddSparePart from './components/SparePart/AddSparePart';
import StockInList from './components/StockIn/StockInList';
import AddStockIn from './components/StockIn/AddStockIn';
import StockOutList from './components/StockOut/StockOutList';
import AddStockOut from './components/StockOut/AddStockOut';
import EditStockOut from './components/StockOut/EditStockOut';
import DeleteStockOut from './components/StockOut/DeleteStockOut';
import StockStatusReport from './components/Reports/StockStatusReport';
import DailyStockOutReport from './components/Reports/DailyStockOutReport';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem('user')));
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData.user);
    localStorage.setItem('token', userData.user.id);
    localStorage.setItem('user', JSON.stringify(userData.user));
    axios.defaults.headers.common['Authorization'] = userData.user.id;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="/" element={isAuthenticated ? <SparePartList /> : <Navigate to="/login" />} />
            <Route path="/spare-parts/add" element={isAuthenticated ? <AddSparePart /> : <Navigate to="/login" />} />
            <Route path="/stock-in" element={isAuthenticated ? <StockInList /> : <Navigate to="/login" />} />
            <Route path="/stock-in/add" element={isAuthenticated ? <AddStockIn /> : <Navigate to="/login" />} />
            <Route path="/stock-out" element={isAuthenticated ? <StockOutList /> : <Navigate to="/login" />} />
            <Route path="/stock-out/add" element={isAuthenticated ? <AddStockOut /> : <Navigate to="/login" />} />
            <Route path="/stock-out/edit/:id" element={isAuthenticated ? <EditStockOut /> : <Navigate to="/login" />} />
            <Route path="/stock-out/delete/:id" element={isAuthenticated ? <DeleteStockOut /> : <Navigate to="/login" />} />
            <Route path="/reports/stock-status" element={isAuthenticated ? <StockStatusReport /> : <Navigate to="/login" />} />
            <Route path="/reports/daily-stock-out" element={isAuthenticated ? <DailyStockOutReport /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;