import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
    FaPencilAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSave
} from 'react-icons/fa';

const EditPostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    // Local state for form data, errors, and loading
    const [formData, setFormData] = useState({
        postName: '', // Use lowercase postName consistently
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'

    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`/api/posts/${postId}`);
                const postData = response.data;

                if (postData && typeof postData === 'object' && postData.PostName !== undefined) {
                    setFormData({
                        postName: postData.PostName, // Set state with lowercase key, value from API
                    });
                } else {
                    const errorMessage = "Post data is incomplete or in an unexpected format.";
                    setError(errorMessage);
                    console.error(errorMessage, postData);
                }
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to load post data.';
                setError(message);
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (postId) { // Only fetch if postId is available
            fetchPost();
        }
    }, [postId]);

    // Handle input changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('saving');
        setError(null);

        try {
            await axios.put(`/api/posts/${postId}`, formData); // formData should now have { postName: '...' }
            setSaveStatus('success');
            setTimeout(() => {
                navigate('/manage-posts'); // Assuming you have a manage posts page
            }, 2000);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update post.';
            setError(message);
            setSaveStatus('error');
            console.error("Update error:", error);
        }
    };

    // Loading state display
    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <p className="text-gray-500">Loading post data...</p>
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
                            <FaPencilAlt className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            Edit Post
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Post Information Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Post Information</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Edit the post name.
                                    </p>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Post Name Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Post Name
                                        </label>
                                        <input
                                            type="text"
                                            name="postName" // Keep name lowercase
                                            value={formData.postName} // Bind to lowercase state
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter post name"
                                        />
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

export default EditPostPage;