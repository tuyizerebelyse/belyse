import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/beauty-warehouse.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', form);
      if (response.data === "Logged in successfully") {
        setMessage({ text: 'Login successful!', type: 'success' });
        localStorage.setItem('users', JSON.stringify({ username: form.username, isLoggedIn: true }));
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMessage({ text: 'Invalid username or password', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Login failed. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="text-center">Welcome Back</h1>
        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block mb-3">
            Login
          </button>

          <p className="text-center">
            Don't have an account?{' '}
            <Link to="/" className="text-primary">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;