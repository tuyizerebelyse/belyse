import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Salaries() {
    const [salaries, setSalaries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        employeeNumber: '',
        GrossSalary: '',
        TotalDeduction: '',
        NetSalary: '',
        month: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [currentSalaryId, setCurrentSalaryId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [salariesRes, employeesRes] = await Promise.all([
                    axios.get('http://localhost:5000/salaries', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/employees', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setSalaries(salariesRes.data);
                setEmployees(employeesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            
            if (name === 'GrossSalary' || name === 'TotalDeduction') {
                const gross = name === 'GrossSalary' ? parseFloat(value) || 0 : parseFloat(prev.GrossSalary) || 0;
                const deduction = name === 'TotalDeduction' ? parseFloat(value) || 0 : parseFloat(prev.TotalDeduction) || 0;
                newData.NetSalary = (gross - deduction).toFixed(2);
            }
            
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                GrossSalary: parseFloat(formData.GrossSalary),
                TotalDeduction: parseFloat(formData.TotalDeduction),
                NetSalary: parseFloat(formData.NetSalary)
            };

            if (editMode) {
                await axios.put(
                    `http://localhost:5000/salaries/${currentSalaryId}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setSalaries(salaries.map(sal => 
                    sal.salaryID === currentSalaryId ? { ...sal, ...payload } : sal
                ));
                toast.success('Salary updated successfully');
            } else {
                const response = await axios.post(
                    'http://localhost:5000/salaries',
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                const employee = employees.find(e => e.employeeNumber === parseInt(formData.employeeNumber));
                const newSalary = {
                    salaryID: response.data.id,
                    ...payload,
                    FirstName: employee?.FirstName,
                    LastName: employee?.LastName
                };
                
                setSalaries([...salaries, newSalary]);
                toast.success('Salary added successfully');
            }
            
            resetForm();
        } catch (error) {
            console.error('Error saving salary:', error);
            toast.error(`Failed to ${editMode ? 'update' : 'add'} salary`);
        }
    };

    const handleEdit = (salary) => {
        setFormData({
            employeeNumber: salary.employeeNumber.toString(),
            GrossSalary: salary.GrossSalary.toString(),
            TotalDeduction: salary.TotalDeduction.toString(),
            NetSalary: salary.NetSalary.toString(),
            month: salary.month.split('T')[0]
        });
        setEditMode(true);
        setCurrentSalaryId(salary.salaryID);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this salary record?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/salaries/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setSalaries(salaries.filter(sal => sal.salaryID !== id));
            toast.success('Salary deleted successfully');
        } catch (error) {
            console.error('Error deleting salary:', error);
            toast.error('Failed to delete salary');
        }
    };

    const resetForm = () => {
        setFormData({
            employeeNumber: '',
            GrossSalary: '',
            TotalDeduction: '',
            NetSalary: '',
            month: ''
        });
        setEditMode(false);
        setCurrentSalaryId(null);
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Salary Management</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    {editMode ? 'Edit Salary Record' : 'Add New Salary Record'}
                </h3>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Employee</label>
                        <select
                            name="employeeNumber"
                            value={formData.employeeNumber}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.employeeNumber} value={emp.employeeNumber}>
                                    {emp.FirstName} {emp.LastName} ({emp.Position})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Month</label>
                        <input
                            type="date"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
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
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Total Deduction (RWF)</label>
                        <input
                            type="number"
                            name="TotalDeduction"
                            value={formData.TotalDeduction}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                            step="0.01"
                            min="0"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Net Salary (RWF)</label>
                        <input
                            type="number"
                            name="NetSalary"
                            value={formData.NetSalary}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    </div>
                    
                    <div className="md:col-span-2 flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {editMode ? 'Update Salary' : 'Add Salary'}
                        </button>
                        
                        {editMode && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h3 className="text-xl font-semibold p-4 bg-gray-100 text-gray-700">Salary Records</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salaries.map(salary => (
                                <tr key={salary.salaryID} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">
                                            {salary.FirstName} {salary.LastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(salary.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {parseFloat(salary.GrossSalary).toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {parseFloat(salary.TotalDeduction).toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                        {parseFloat(salary.NetSalary).toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(salary)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(salary.salaryID)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
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