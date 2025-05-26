import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AiOutlineCalendar } from 'react-icons/ai';

const RegisterCandidatePage = () => {
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
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load available posts.');
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateForDatabase = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const allFieldsFilled = Object.values(formData).every((field) => field !== '');
    if (!allFieldsFilled) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      postID: parseInt(formData.postID, 10),
      marks: parseFloat(formData.marks),
      dateOfBirth: formatDateForDatabase(formData.dateOfBirth),
      examDate: formatDateForDatabase(formData.examDate),
    };

    try {
      const response = await axios.post('/api/candidates', payload);
      
      if (response.status === 201) {
        setSuccess('Candidate registered successfully!');
        setFormData({
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
        setTimeout(() => navigate('/manage-candidates'), 2000);
      }
    } catch (err) {
      console.error('Error registering candidate:', err.response || err);
      let errorMessage = 'Failed to register candidate.';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server responded with status: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response received from the server.';
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Register New Candidate</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Fill in the details below to register a new candidate
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-100 rounded">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <strong className="font-bold">Error: </strong>
                  <span className="ml-1">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-100 rounded">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <strong className="font-bold">Success: </strong>
                  <span className="ml-1">{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'candidateNationalId', label: 'National ID', type: 'text', required: true },
                  { id: 'firstName', label: 'First Name', type: 'text', required: true },
                  { id: 'lastName', label: 'Last Name', type: 'text', required: true },
                  { id: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true },
                  { id: 'marks', label: 'Marks', type: 'number', required: true },
                ].map(({ id, label, type, required }) => (
                  <div key={id} className="space-y-2">
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={type}
                      id={id}
                      name={id}
                      value={formData[id]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                      placeholder={`Enter ${label}`}
                      required={required}
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pr-10 transition duration-200"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AiOutlineCalendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exam Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="examDate"
                      name="examDate"
                      value={formData.examDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pr-10 transition duration-200"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AiOutlineCalendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="postID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Post <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="postID"
                    name="postID"
                    value={formData.postID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                    required
                  >
                    <option value="">Select Post</option>
                    {posts.map((post) => (
                      <option key={post.PostID} value={post.PostID}>
                        {post.PostName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white transition duration-200 ${
                    isLoading
                      ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Register Candidate'
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

export default RegisterCandidatePage;