import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StockInList = () => {
  const [stockIns, setStockIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockIns = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stock-in', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch stock in records');
        }
        const data = await response.json();
        setStockIns(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockIns();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Stock In Records</h2>
        <button
          onClick={() => navigate('/stock-in/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Stock In
        </button>
      </div>
      {loading ? (
        <p>Loading stock in records...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : stockIns.length === 0 ? (
        <p>No stock in records found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Part Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Admin</th>
            </tr>
          </thead>
          <tbody>
            {stockIns.map((record) => (
              <tr key={record.StockInID}>
                <td className="border px-4 py-2">{record.PartName}</td>
                <td className="border px-4 py-2">{record.StockInQuantity}</td>
                <td className="border px-4 py-2">{new Date(record.StockInDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{record.AdminName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockInList;
