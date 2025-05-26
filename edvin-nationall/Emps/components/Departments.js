import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        DepartmentCode: '',
        DepartmentName: '',
        GrossSalary: ''
    });

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/departments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
                toast.error('Failed to load departments');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/departments',
                {
                    ...formData,
                    GrossSalary: parseFloat(formData.GrossSalary)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setDepartments([...departments, { ...formData, GrossSalary: parseFloat(formData.GrossSalary) }]);
            toast.success('Department added successfully');
            
            setFormData({
                DepartmentCode: '',
                DepartmentName: '',
                GrossSalary: ''
            });
        } catch (error) {
            console.error('Error adding department:', error);
            toast.error('Failed to add department');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Department Management</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Department</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Department Code</label>
                        <input
                            type="text"
                            name="DepartmentCode"
                            value={formData.DepartmentCode}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                            maxLength="4"
                            placeholder="E.g., ADMS"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Department Name</label>
                        <input
                            type="text"
                            name="DepartmentName"
                            value={formData.DepartmentName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="E.g., Administration"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Gross Salary (RWF)</label>
                        <input
                            type="number"
                            name="GrossSalary"
                            value={formData.GrossSalary}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                            step="0.01"
                            min="0"
                            placeholder="E.g., 500000"
                        />
                    </div>
                    
                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Add Department
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h3 className="text-xl font-semibold p-4 bg-gray-100 text-gray-700">Department List</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {departments.map(dept => (
                                <tr key={dept.DepartmentCode} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {dept.DepartmentCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {dept.DepartmentName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {parseFloat(dept.GrossSalary).toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}