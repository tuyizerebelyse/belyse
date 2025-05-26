import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Report() {
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/report/monthly', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReportData(response.data);
            } catch (error) {
                console.error('Error fetching report:', error);
                toast.error('Failed to load payroll report');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, []);

    const filteredData = selectedMonth
        ? reportData.filter(item => {
            const itemMonth = new Date(item.month).toISOString().slice(0, 7);
            return itemMonth === selectedMonth;
        })
        : reportData;

    const uniqueMonths = [...new Set(
        reportData.map(item => new Date(item.month).toISOString().slice(0, 7))
    )].sort().reverse();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Payroll Report</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">Payroll Summary</h3>
                    
                    <div className="flex items-center gap-2">
                        <label htmlFor="monthFilter" className="text-sm font-medium text-gray-700">
                            Filter by Month:
                        </label>
                        <select
                            id="monthFilter"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Months</option>
                            {uniqueMonths.map(month => (
                                <option key={month} value={month}>
                                    {new Date(month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">
                                                {item.FirstName} {item.LastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.Position}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.DepartmentName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {parseFloat(item.GrossSalary).toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {parseFloat(item.TotalDeduction).toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                            {parseFloat(item.NetSalary).toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        No payroll data available for the selected month
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {filteredData.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Payroll Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-800 mb-1">Total Employees</h4>
                            <p className="text-2xl font-bold text-blue-600">
                                {new Set(filteredData.map(item => `${item.FirstName}${item.LastName}`)).size}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-green-800 mb-1">Total Net Payroll</h4>
                            <p className="text-2xl font-bold text-green-600">
                                {filteredData
                                    .reduce((sum, item) => sum + parseFloat(item.NetSalary), 0)
                                    .toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
                            </p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-red-800 mb-1">Total Deductions</h4>
                            <p className="text-2xl font-bold text-red-600">
                                {filteredData
                                    .reduce((sum, item) => sum + parseFloat(item.TotalDeduction), 0)
                                    .toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}