import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/beauty-warehouse.css';

function AddOrder() {
  const [form, setForm] = useState({
    orderdate: '',
    productcode: '',
    customerid: ''
  });
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get('http://localhost:3001/getproducts');
        const customersRes = await axios.get('http://localhost:3001/getcustomers');
        setProducts(productsRes.data);
        setCustomers(customersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/orderin', form);
      setMessage({ text: 'Order added successfully!', type: 'success' });
      setForm({ orderdate: '', productcode: '', customerid: '' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage({ text: 'Error adding order', type: 'error' });
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

        <h1 className="text-center">Add New Order</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Order Date</label>
            <input
              type="date"
              name="orderdate"
              value={form.orderdate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product</label>
            <select
              name="productcode"
              value={form.productcode}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product.productcode} value={product.productcode}>
                  {product.productname}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Customer</label>
            <select
              name="customerid"
              value={form.customerid}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.customerid} value={customer.customerid}>
                  {customer.cust_fname} {customer.cust_lname}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Add Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddOrder;