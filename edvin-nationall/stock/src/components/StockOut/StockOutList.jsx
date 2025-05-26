import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StockOutList = () => {
  const [stockOuts, setStockOuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStockOuts = async () => {
      try {
        const response = await axios.get('/stock-out');
        setStockOuts(response.data);
      } catch (err) {
        setError('Failed to fetch stock out records');
      } finally {
        setLoading(false);
      }
    };

    fetchStockOuts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Stock Out Records</h2>
        <Link
          to="/stock-out/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Stock Out
        </Link>
      </div>
      {loading ? (
        <p>Loading stock out records...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : stockOuts.length === 0 ? (
        <p>No stock out records found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Part Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Unit Price</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Admin</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockOuts.map((record) => (
              <tr key={record.StockOutID}>
                <td className="border px-4 py-2">{record.PartName}</td>
                <td className="border px-4 py-2">{record.StockOutQuantity}</td>
                <td className="border px-4 py-2">${record.StockOutUnitPrice}</td>
                <td className="border px-4 py-2">${record.StockOutTotalPrice}</td>
                <td className="border px-4 py-2">{new Date(record.StockOutDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{record.AdminName}</td>
                <td className="border px-4 py-2 space-x-2">
                  <Link
                    to={`/stock-out/edit/${record.StockOutID}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/stock-out/delete/${record.StockOutID}`}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockOutList;
