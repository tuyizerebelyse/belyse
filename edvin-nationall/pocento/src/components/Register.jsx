import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/beauty-warehouse.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/register', form);
      setMessage({ text: 'Registration successful!', type: 'success' });
      setForm({ username: '', password: '' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setMessage({ text: 'Registration failed. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="text-center">Create Account</h1>
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
              placeholder="Choose a username"
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
              placeholder="Choose a password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block mb-3">
            Register
          </button>

          <p className="text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;