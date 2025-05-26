import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddStockIn = () => {
  const [parts, setParts] = useState([]);
  const [formData, setFormData] = useState({
    partId: '',
    stockInQuantity: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get('/spare-parts');
        setParts(response.data);
      } catch (err) {
        setError('Failed to fetch spare parts');
      }
    };
    fetchParts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.partId || !formData.stockInQuantity) {
      setError('Please select a part and enter quantity');
      return;
    }

    try {
      await axios.post('/stock-in', {
        partId: formData.partId,
        stockInQuantity: parseInt(formData.stockInQuantity, 10),
        adminId: localStorage.getItem('token')
      });
      navigate('/stock-in');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add stock in');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Stock In</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="partId">Spare Part</label>
          <select
            id="partId"
            name="partId"
            value={formData.partId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a part</option>
            {parts.map((part) => (
              <option key={part.PartID} value={part.PartID}>
                {part.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="stockInQuantity">Quantity</label>
          <input
            type="number"
            id="stockInQuantity"
            name="stockInQuantity"
            value={formData.stockInQuantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Stock In
        </button>
      </form>
    </div>
  );
};

export default AddStockIn;
