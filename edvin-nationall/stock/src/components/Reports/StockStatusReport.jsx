import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockStatusReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports/stock-status');
        setReportData(response.data);
      } catch (err) {
        setError('Failed to fetch stock status report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Stock Status Report</h2>
      {loading ? (
        <p>Loading report...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reportData.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Part Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Stored Quantity</th>
              <th className="border px-4 py-2">Total Stock In</th>
              <th className="border px-4 py-2">Total Stock Out</th>
              <th className="border px-4 py-2">Remaining Quantity</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item) => (
              <tr key={item.PartID}>
                <td className="border px-4 py-2">{item.Name}</td>
                <td className="border px-4 py-2">{item.Category}</td>
                <td className="border px-4 py-2">{item.StoredQuantity}</td>
                <td className="border px-4 py-2">{item.TotalStockIn}</td>
                <td className="border px-4 py-2">{item.TotalStockOut}</td>
                <td className="border px-4 py-2">{item.RemainingQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockStatusReport;
