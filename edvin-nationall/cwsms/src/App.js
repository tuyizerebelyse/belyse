import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import CarManagement from './CarManagement';
import ServiceManagement from './ServiceManagement';
import Reports from './Reports';

axios.defaults.baseURL = 'http://localhost:5000/api'; // Your backend base URL

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const { data } = await axios.post('/login', credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const handleRegister = async (userData) => {
    try {
      await axios.post('/register', userData);
      return { success: true };
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && (
          <nav className="bg-blue-800 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
              <h1 className="text-2xl font-bold">SmartPark CWSMS</h1>
              <div className="flex items-center space-x-6">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-white font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/cars"
                  className="px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-white font-medium"
                >
                  Car Management
                </Link>
                <Link
                  to="/services"
                  className="px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-white font-medium"
                >
                  Service Management
                </Link>
                <Link
                  to="/reports"
                  className="px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-white font-medium"
                >
                  Reports
                </Link>
                <span className="font-medium">Welcome, {user.username}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register onRegister={handleRegister} />}
          />
          <Route
            path="/cars"
            element={user ? <CarManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/services"
            element={user ? <ServiceManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/reports"
            element={user ? <Reports /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
