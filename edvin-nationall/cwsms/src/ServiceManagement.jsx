import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    record_number: null,
    plate_number: '',
    package_number: '',
    service_date: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, packagesRes, servicesRes] = await Promise.all([
        axios.get('/cars'),
        axios.get('/packages'),
        axios.get('/services'),
      ]);
      setCars(carsRes.data);
      setPackages(packagesRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.record_number) {
        // Update
        await axios.put(`/services/${formData.record_number}`, formData);
      } else {
        // Create
        const { data } = await axios.post('/services', formData);
        const selectedPackage = packages.find(p => p.package_number === formData.package_number);
        if (selectedPackage) {
          await axios.post('/payments', {
            record_number: data.record_number,
            amount_paid: selectedPackage.package_price,
            payment_date: formData.service_date,
          });
        }
      }

      setFormData({
        record_number: null,
        plate_number: '',
        package_number: '',
        service_date: new Date().toISOString().slice(0, 16),
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setFormData({
      record_number: record.record_number,
      plate_number: record.plate_number,
      package_number: record.package_number,
      service_date: new Date(record.service_date).toISOString().slice(0, 16),
    });
  };

  const handleDelete = async (record_number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/services/${record_number}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Service Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add/Edit Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {formData.record_number ? 'Edit Service' : 'Record New Service'}
          </h2>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Car</label>
              <select
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.plate_number}
                onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
              >
                <option value="">Select car</option>
                {cars.map(car => (
                  <option key={car.plate_number} value={car.plate_number}>
                    {car.plate_number} - {car.driver_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Service Package</label>
              <select
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.package_number}
                onChange={(e) => setFormData({ ...formData, package_number: e.target.value })}
              >
                <option value="">Select package</option>
                {packages.map(pkg => (
                  <option key={pkg.package_number} value={pkg.package_number}>
                    {pkg.package_name} - {pkg.package_price} Rwf
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Service Date & Time</label>
              <input
                type="datetime-local"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.service_date}
                onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                formData.record_number ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : formData.record_number ? 'Update Service' : 'Record Service'}
            </button>
          </form>
        </div>

        {/* Service History Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Service History</h2>

          {services.length === 0 ? (
            <p className="text-gray-500">No services recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map(service => {
                    const car = cars.find(c => c.plate_number === service.plate_number);
                    const pkg = packages.find(p => p.package_number === service.package_number);
                    return (
                      <tr key={service.record_number} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{car?.plate_number}</div>
                          <div className="text-sm text-gray-500">{car?.driver_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{pkg?.package_name}</div>
                          <div className="text-sm text-gray-500">{pkg?.package_price} Rwf</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(service.service_date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-yellow-600 hover:text-yellow-900 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service.record_number)}
                            className="text-red-600 hover:text-red-900 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
