import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditStockOut = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    stockOutQuantity: '',
    stockOutUnitPrice: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockOut = async () => {
      try {
        const response = await axios.get('/stock-out');
        const stockOutRecord = response.data.find(item => item.StockOutID === parseInt(id, 10));
        if (stockOutRecord) {
          setFormData({
            stockOutQuantity: stockOutRecord.StockOutQuantity,
            stockOutUnitPrice: stockOutRecord.StockOutUnitPrice
          });
        } else {
          setError('Stock out record not found');
        }
      } catch (err) {
        setError('Failed to fetch stock out record');
      }
    };
    fetchStockOut();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.stockOutQuantity || !formData.stockOutUnitPrice) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.put(`/stock-out/${id}`, {
        stockOutQuantity: parseInt(formData.stockOutQuantity, 10),
        stockOutUnitPrice: parseFloat(formData.stockOutUnitPrice)
      });
      navigate('/stock-out');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update stock out');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Stock Out</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="stockOutQuantity">Quantity</label>
          <input
            type="number"
            id="stockOutQuantity"
            name="stockOutQuantity"
            value={formData.stockOutQuantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="1"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="stockOutUnitPrice">Unit Price</label>
          <input
            type="number"
            step="0.01"
            id="stockOutUnitPrice"
            name="stockOutUnitPrice"
            value={formData.stockOutUnitPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Stock Out
        </button>
      </form>
    </div>
  );
};

export default EditStockOut;
