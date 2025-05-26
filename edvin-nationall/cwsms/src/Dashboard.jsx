import { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalCarsRegistered: 0,
    servicesToday: 0,
    revenueToday: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Total Cars Registered
        // Assuming you'll add an endpoint like /api/stats/cars-count or /api/cars that returns total count
        const carsResponse = await axios.get('/cars'); // Modify if your endpoint is different
        setStats(prevStats => ({
          ...prevStats,
          totalCarsRegistered: carsResponse.data.length, // Assuming /api/cars returns an array of all cars
        }));

        // Fetch Services Today and Revenue Today
        // Your backend already has /api/reports/daily
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const dailyReportResponse = await axios.get(`/reports/daily?date=${today}`);
        const dailyReportData = dailyReportResponse.data;

        const totalServicesToday = dailyReportData.length;
        const totalRevenueToday = dailyReportData.reduce((sum, item) => sum + (item.amount_paid || 0), 0);

        setStats(prevStats => ({
          ...prevStats,
          servicesToday: totalServicesToday,
          revenueToday: totalRevenueToday,
        }));

        // Fetch Recent Activity
        // For recent activity, we can use the daily report data, or you might create a specific
        // endpoint for "recent activities" which could include car registrations, new services etc.
        // For now, let's use the daily services as "recent activity" for demonstration.
        // In a real app, you might want a dedicated endpoint for various recent activities.
        const activities = dailyReportData.slice(0, 3).map(item => ({
          type: 'service', // or 'car_registration', 'payment', etc.
          description: `Service for ${item.plate_number} (${item.package_name}). Paid ${item.amount_paid || 0} Rwf.`,
          time: new Date(item.payment_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), // Format time
        }));
        setRecentActivities(activities);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cards */}
        <Link to="/cars" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Car Management</h2>
              <p className="text-gray-500 mt-2">Manage registered vehicles</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/services" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Service Management</h2>
              <p className="text-gray-500 mt-2">Record and track services</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/reports" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Reports</h2>
              <p className="text-gray-500 mt-2">View and export reports</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">User Info</h2>
              <p className="text-gray-500 mt-2">Logged in as: {user?.username}</p>
              <p className="text-gray-500">Role: <span className="capitalize">{user?.role}</span></p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800">Total Cars Registered</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalCarsRegistered}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800">Services Today</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.servicesToday}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800">Revenue Today</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.revenueToday.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent activity today.</p>
          )}
        </div>
      </div>
    </div>
  );
}