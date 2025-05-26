import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Employees from './components/Employees';
import Departments from './components/Departments';
import Salaries from './components/Salaries';
import Report from './components/Report';
import './index.css';

import {
  UsersIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [systemStats, setSystemStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        payrollThisMonth: 0
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/dashboard/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSystemStats(data);
                } else {
                    console.error('Failed to fetch dashboard stats');
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        if (token) fetchStats();
    }, []);

    return (
        <Router>
            {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
            <div className={`min-h-screen transition-all duration-300 ${isAuthenticated ? 'bg-gradient-to-br from-gray-50 to-blue-50 pt-20' : 'bg-gray-900'}`}>
                <Routes>
                    <Route path="/login" element={
                        !isAuthenticated ?
                            <Login setIsAuthenticated={setIsAuthenticated} /> :
                            <Navigate to="/" />
                    } />
                    <Route path="/" element={
                        isAuthenticated ?
                            <Dashboard systemStats={systemStats} /> :
                            <Navigate to="/login" />
                    } />
                    <Route path="/employees" element={
                        isAuthenticated ?
                            <Employees /> :
                            <Navigate to="/login" />
                    } />
                    <Route path="/departments" element={
                        isAuthenticated ?
                            <Departments /> :
                            <Navigate to="/login" />
                    } />
                    <Route path="/salaries" element={
                        isAuthenticated ?
                            <Salaries /> :
                            <Navigate to="/login" />
                    } />
                    <Route path="/report" element={
                        isAuthenticated ?
                            <Report /> :
                            <Navigate to="/login" />
                    } />
                    <Route path="/logout" element={
                        <Logout setIsAuthenticated={setIsAuthenticated} />
                    } />
                </Routes>
            </div>
        </Router>
    );
}

function Dashboard({ systemStats }) {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 inline-block">
                        EPMS Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your payroll today...</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Employees"
                    value={systemStats.totalEmployees}
                    icon={<UsersIcon className="h-6 w-6 text-blue-500" />}
                    color="bg-blue-100"
                />
                <StatCard
                    title="Departments"
                    value={systemStats.totalDepartments}
                    icon={<BuildingOfficeIcon className="h-6 w-6 text-purple-500" />}
                    color="bg-purple-100"
                />
                <StatCard
                    title="Monthly Payroll"
                    value={`$${(systemStats.payrollThisMonth / 1000).toFixed(1)}k`}
                    icon={<CurrencyDollarIcon className="h-6 w-6 text-green-500" />}
                    color="bg-green-100"
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between">
                <div className={`${color} p-3 rounded-lg`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-gray-500 text-sm mt-4">{title}</h3>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}

function Logout({ setIsAuthenticated }) {
    useEffect(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    }, [setIsAuthenticated]);

    return <Navigate to="/login" />;
}

export default App;
