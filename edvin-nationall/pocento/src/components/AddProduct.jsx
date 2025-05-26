import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/beauty-warehouse.css';

function AddProduct() {
  const [form, setForm] = useState({
    productname: '',
    productquantity: '',
    unitprice: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/productin', {
        productname: form.productname,
        productquantity: Number(form.productquantity),
        unitprice: Number(form.unitprice)
      });
      setMessage({ text: 'Product added successfully!', type: 'success' });
      setForm({ productname: '', productquantity: '', unitprice: '' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage({ text: 'Error adding product', type: 'error' });
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

        <h1 className="text-center">Add New Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              name="productname"
              value={form.productname}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              name="productquantity"
              value={form.productquantity}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit Price</label>
            <input
              type="number"
              name="unitprice"
              value={form.unitprice}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter unit price"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;