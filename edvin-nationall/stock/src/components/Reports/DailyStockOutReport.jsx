import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DailyStockOutReport = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async (selectedDate) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/reports/daily-stock-out', {
        params: { date: selectedDate }
      });
      setReportData(response.data);
    } catch (err) {
      setError('Failed to fetch daily stock out report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(date);
  }, [date]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Daily Stock Out Report</h2>
      <div className="mb-4">
        <label htmlFor="date" className="mr-2 font-semibold">Select Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          className="border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {loading ? (
        <p>Loading report...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reportData.length === 0 ? (
        <p>No data available for the selected date.</p>
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
            </tr>
          </thead>
          <tbody>
            {reportData.map((item) => (
              <tr key={item.StockOutID}>
                <td className="border px-4 py-2">{item.PartName}</td>
                <td className="border px-4 py-2">{item.StockOutQuantity}</td>
                <td className="border px-4 py-2">${item.StockOutUnitPrice}</td>
                <td className="border px-4 py-2">${item.StockOutTotalPrice}</td>
                <td className="border px-4 py-2">{new Date(item.StockOutDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{item.AdminName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DailyStockOutReport;
