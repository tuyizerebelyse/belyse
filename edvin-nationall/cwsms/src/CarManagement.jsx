import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CarManagement() {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    plate_number: '',
    car_type: '',
    car_size: '',
    driver_name: '',
    phone_number: ''
  });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/cars', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCars(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cars');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (editing) {
        await axios.put(`/cars/${formData.plate_number}`, formData, { headers });
      } else {
        await axios.post('/cars', formData, { headers });
      }
      setFormData({
        plate_number: '',
        car_type: '',
        car_size: '',
        driver_name: '',
        phone_number: ''
      });
      setEditing(null);
      fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save car');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car) => {
    setFormData(car);
    setEditing(true);
  };

  const handleDelete = async (plate_number) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/cars/${plate_number}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete car');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Car Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editing ? 'Edit Car' : 'Add New Car'}
          </h2>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {['plate_number', 'car_type', 'driver_name', 'phone_number'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {field.replace('_', ' ')}
                </label>
                <input
                  type="text"
                  required
                  disabled={editing && field === 'plate_number'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Size</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.car_size}
                onChange={(e) => setFormData({ ...formData, car_size: e.target.value })}
              >
                <option value="">Select size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : editing ? 'Update Car' : 'Add Car'}
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registered Cars</h2>

          {cars.length === 0 ? (
            <p className="text-gray-500">No cars registered yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Plate', 'Type', 'Driver', 'Phone', 'Actions'].map((header, idx) => (
                      <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cars.map((car) => (
                    <tr key={car.plate_number} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-800 font-medium">{car.plate_number}</td>
                      <td className="px-6 py-3 text-gray-600">{car.car_type}</td>
                      <td className="px-6 py-3 text-gray-600">{car.driver_name}</td>
                      <td className="px-6 py-3 text-gray-600">{car.phone_number}</td>
                      <td className="px-6 py-3 space-x-3">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(car.plate_number)}
                          className="text-red-600 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
