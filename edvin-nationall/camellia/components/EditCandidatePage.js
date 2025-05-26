import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
    FaUser,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSave,
    FaCalendarAlt
} from 'react-icons/fa';

const EditCandidatePage = () => {
    const { candidateNationalId } = useParams();
    const navigate = useNavigate();

    // Local state for form data, posts, errors, and loading
    const [formData, setFormData] = useState({
        candidateNationalId: '',
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        phoneNumber: '',
        postID: '',
        examDate: '',
        marks: '',
    });
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'

    // Format date for display (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            console.error("Error formatting date:", e);
            return '';
        }
    };

    // Fetch posts and candidate data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            try {
                // Fetch posts (for the dropdown)
                const postsResponse = await axios.get('/api/posts');
                setPosts(postsResponse.data);

                // Fetch candidate data by nationalId
                const candidateResponse = await axios.get(`/api/candidates/${candidateNationalId}`);
                const candidateData = candidateResponse.data;

                console.log("Candidate data from server:", candidateData);


                if (candidateData &&
                    typeof candidateData === 'object' && 
                    candidateData.CandidateNationalId !== undefined &&  
                    candidateData.FirstName !== undefined &&      
                    candidateData.LastName !== undefined &&       
                    candidateData.Gender !== undefined &&           // Corrected property name
                    candidateData.DataOfficials !== undefined &&      // Corrected property name
                    candidateData.PhoneNumber !== undefined &&      // Corrected property name
                    candidateData.PostID !== undefined &&           // Corrected property name
                    candidateData.ExamDate !== undefined &&         // Corrected property name
                    candidateData.Marks !== undefined          // Corrected property name
                ) {
                    setFormData({
                        candidateNationalId: candidateData.CandidateNationalId, // Corrected property name
                        firstName: candidateData.FirstName,         // Corrected property name
                        lastName: candidateData.LastName,           // Corrected property name
                        gender: candidateData.Gender,               // Corrected property name
                        dateOfBirth: formatDateForInput(candidateData.DataOfficials), // Corrected property name
                        phoneNumber: candidateData.PhoneNumber,       // Corrected property name
                        postID: candidateData.PostID,                 // Corrected property name
                        examDate: formatDateForInput(candidateData.ExamDate),   // Corrected property name
                        marks: candidateData.Marks,               // Corrected property name
                    });
                } else {
                    // Handle the case where candidate data is not in the expected format.
                    const errorMessage = "Candidate data is incomplete or in an unexpected format.";
                    setError(errorMessage);
                    console.error(errorMessage, candidateData);
                    return; // Stop the function to prevent further errors.
                }

            } catch (error) {
                const message = error.response?.data?.message || 'Failed to load data.';
                setError(message);
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [candidateNationalId]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('saving');
        setError(null); // Clear previous errors

        try {
            // Send a PUT request to update the candidate data
            await axios.put(`/api/candidates/${candidateNationalId}`, formData);
            setSaveStatus('success');
            setTimeout(() => {
                navigate('/manage-candidates'); // Redirect after successful save
            }, 2000);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update candidate.';
            setError(message);
            setSaveStatus('error');
            console.error("Update error:", error);
        }
    };

    // Loading state display
    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <p className="text-gray-500">Loading candidate data...</p>
            </div>
        );
    }

    // Error state display
    if (error) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    // Main component rendering
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
                            <FaUser className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            Edit Candidate
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Personal Information</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Edit the candidate&apos;s personal details.
                                    </p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* National ID Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                National ID
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                The candidate&apos;s national identification number.
                                            </p>
                                            <input
                                                type="text"
                                                name="candidateNationalId"
                                                value={formData.candidateNationalId}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                disabled // National ID is typically not editable
                                            />
                                        </div>
                                        {/* First Name Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                First Name
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                The candidate&apos;s first name.
                                            </p>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        {/* Last Name Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Last Name
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                The candidate&apos;s last name.
                                            </p>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Gender Select */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Gender
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                The candidate&apos;s gender.
                                            </p>
                                            <select
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">Select gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        {/* Date of Birth Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Date of Birth
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                The candidate&apos;s date of birth.
                                            </p>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                />
                                                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
                                            </div>
                                        </div>
                                        {/* Phone Number Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Phone Number
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                The candidate&apos;s phone number.
                                            </p>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Application Details Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Application Details</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Details related to the candidate&apos;s application.
                                    </p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Post Select */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Post
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                The post the candidate applied for.
                                            </p>
                                            <select
                                                value={formData.postID}
                                                onChange={(e) => setFormData({ ...formData, postID: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">Select post</option>
                                                {posts.map((post) => (
                                                    <option key={post.PostID} value={post.PostID}>
                                                        {post.PostName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Exam Date Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Exam Date
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                The date of the candidate&apos;s exam.
                                            </p>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    name="examDate"
                                                    value={formData.examDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                />
                                                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
                                            </div>
                                        </div>
                                        {/* Marks Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Marks
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                The candidate&apos;s exam score.
                                            </p>
                                            <input
                                                type="number"
                                                name="marks"
                                                value={formData.marks}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter marks"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saveStatus === 'saving'}
                                    className={`
                                        px-6 py-3 rounded-md font-semibold text-white transition-colors duration-200 
                                        ${saveStatus === 'idle' && 'bg-blue-600 hover:bg-blue-700'}
                                        ${saveStatus === 'saving' && 'bg-blue-400 cursor-not-allowed'}
                                        ${saveStatus === 'success' && 'bg-green-600 hover:bg-green-700'}
                                        ${saveStatus === 'error' && 'bg-red-600 hover:bg-red-700'}
                                        flex items-center gap-2
                                    `}
                                >
                                    {saveStatus === 'idle' && (
                                        <>
                                            <FaSave />
                                            Save Changes
                                        </>
                                    )}
                                    {saveStatus === 'saving' && 'Saving...'}
                                    {saveStatus === 'success' && (
                                        <>
                                            <FaCheckCircle />
                                            Saved!
                                        </>
                                    )}
                                    {saveStatus === 'error' && (
                                        <>
                                            <FaExclamationTriangle />
                                            Error
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditCandidatePage;