import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SparePartList = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await axios.get('/spare-parts');
        setSpareParts(response.data);
      } catch (err) {
        setError('Failed to fetch spare parts');
      } finally {
        setLoading(false);
      }
    };

    fetchSpareParts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Spare Parts</h2>
        <Link
          to="/spare-parts/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Spare Part
        </Link>
      </div>
      {loading ? (
        <p>Loading spare parts...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : spareParts.length === 0 ? (
        <p>No spare parts found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {spareParts.map((part) => (
              <tr key={part.PartID}>
                <td className="border px-4 py-2">{part.Name}</td>
                <td className="border px-4 py-2">{part.Category}</td>
                <td className="border px-4 py-2">{part.Quantity}</td>
                <td className="border px-4 py-2">${part.UnitPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SparePartList;
