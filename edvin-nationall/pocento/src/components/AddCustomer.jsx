import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/beauty-warehouse.css';

function AddCustomer() {
  const [form, setForm] = useState({
    cust_fname: '',
    cust_lname: '',
    location: '',
    telephone: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/customerin', form);
      setMessage({ text: 'Customer added successfully!', type: 'success' });
      setForm({ cust_fname: '', cust_lname: '', location: '', telephone: '' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage({ text: 'Error adding customer', type: 'error' });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <h1 className="text-center">Add New Customer</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="cust_fname"
              value={form.cust_fname}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter first name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="cust_lname"
              value={form.cust_lname}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter last name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter location"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telephone</label>
            <input
              type="text"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter telephone"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;