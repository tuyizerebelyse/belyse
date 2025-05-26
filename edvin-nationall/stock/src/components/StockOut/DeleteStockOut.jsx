import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const DeleteStockOut = () => {
  const { id } = useParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const deleteStockOut = async () => {
      try {
        await axios.delete(`/stock-out/${id}`);
        navigate('/stock-out');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete stock out');
      }
    };
    deleteStockOut();
  }, [id, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
      ) : (
        <p>Deleting stock out record...</p>
      )}
    </div>
  );
};

export default DeleteStockOut;
