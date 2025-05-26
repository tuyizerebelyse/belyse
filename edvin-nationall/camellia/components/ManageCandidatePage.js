import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaUserPlus, FaSpinner, FaSearch, FaFilter } from 'react-icons/fa';
import { MdOutlineWarningAmber } from 'react-icons/md';
import { IoIosInformationCircle, IoMdClose } from 'react-icons/io';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ManageCandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletePopupId, setDeletePopupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/candidates');
        console.log("✅ Candidates fetched:", response.data);

        if (Array.isArray(response.data)) {
          setCandidates(response.data);
          setFilteredCandidates(response.data);
        } else {
          console.error("❌ Unexpected response format:", response.data);
          setError("Unexpected response format. Contact admin.");
        }
      } catch (err) {
        console.error('❌ Error fetching candidates:', err);
        setError(err.response?.data?.message || 'Failed to load candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    let results = candidates;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(candidate =>
        Object.values(candidate).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply additional filters
    if (activeFilter !== 'all') {
      results = results.filter(candidate => 
        activeFilter === 'passed' ? candidate.Marks >= 50 : candidate.Marks < 50
      );
    }
    
    setFilteredCandidates(results);
  }, [searchTerm, activeFilter, candidates]);

  const handleDeleteCandidate = async (candidateNationalId) => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/candidates/${candidateNationalId}`);
      setCandidates(prev => prev.filter(c => c.candidateNationalId !== candidateNationalId));
      setDeletePopupId(null);
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setError('Failed to delete candidate. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateCandidate = (id) => {
    navigate(`/edit-candidate/${id}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full transform transition-all duration-300 hover:scale-[1.02]">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Loading Candidates</h2>
          <p className="text-gray-600 text-lg">Please wait while we fetch the candidate data...</p>
          <div className="mt-6 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="flex items-center justify-center">
              <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 hover:shadow-2xl">
                <div className="inline-flex items-center justify-center bg-red-100 rounded-full p-4 mb-4">
                  <IoIosInformationCircle className="text-red-600 text-5xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Error Occurred</h2>
                <p className="text-red-500 mb-6 text-lg">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 transition-all duration-300 ${deletePopupId ? 'brightness-90' : ''}`}>
          {/* Delete Confirmation Modal */}
          {deletePopupId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-95 hover:scale-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <IoIosInformationCircle className="text-red-500 text-3xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                    <div className="text-gray-600">
                      {(() => {
                        const candidate = candidates.find(c => c.CandidateNationalId === deletePopupId);
                        return candidate ? (
                          <>
                            <p className="mb-3">Are you sure you want to delete candidate:</p>
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-lg">
                              <p className="font-bold text-red-700">{candidate.FirstName} {candidate.LastName}</p>
                              <p className="text-sm text-red-600">National ID: {candidate.CandidateNationalId}</p>
                            </div>
                            <p className="text-red-500 font-medium">This action cannot be undone!</p>
                          </>
                        ) : (
                          <p>Delete this candidate? This action cannot be undone.</p>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setDeletePopupId(null)}
                    className="px-5 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteCandidate(deletePopupId)}
                    disabled={isDeleting}
                    className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center min-w-24"
                  >
                    {isDeleting ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                  Manage Candidates
                </h1>
                <p className="text-gray-600 text-lg">View, edit, and manage candidate records</p>
              </div>
              <button
                onClick={() => navigate('/register-candidate')}
                className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaUserPlus className="text-xl" />
                <span className="font-semibold text-lg">Add New Candidate</span>
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative col-span-1 md:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search candidates by name, ID, or any field..."
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg shadow-sm hover:shadow-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <IoMdClose className="text-gray-400 hover:text-gray-600 text-xl" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <select
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="appearance-none block w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg shadow-sm hover:shadow-md"
                    >
                      <option value="all">All Candidates</option>
                      <option value="passed">Passed Only</option>
                      <option value="failed">Failed Only</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaFilter className="text-gray-400" />
                    </div>
                  </div>
                  {(searchTerm || activeFilter !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-3.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors rounded-xl border border-indigo-100 hover:border-indigo-200"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-2xl shadow-sm transform transition-all duration-300 hover:translate-x-1">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MdOutlineWarningAmber className="text-yellow-500 text-4xl mt-1 mr-4" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-yellow-800 mb-2">No Candidates Found</h3>
                    <p className="text-yellow-700 text-lg">
                      {searchTerm || activeFilter !== 'all' 
                        ? 'No candidates match your search criteria.' 
                        : 'There are no candidates registered yet.'}
                    </p>
                    {(searchTerm || activeFilter !== 'all') && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 px-5 py-2.5 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors shadow-sm"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-600 to-blue-600">
                      <tr>
                        {['National ID', 'First Name', 'Last Name', 'Gender', 'Date of Birth', 'Phone', 'Post', 'Exam Date', 'Marks', 'Actions'].map((title) => (
                          <th
                            key={title}
                            className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider"
                          >
                            <div className="flex items-center">
                              {title}
                              {['Marks', 'Exam Date'].includes(title) && (
                                <span className="ml-1 opacity-70">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCandidates.map((candidate) => (
                        <tr
                          key={candidate.CandidateNationalId}
                          className="hover:bg-gray-50 transition-colors duration-150 group"
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                            {candidate.CandidateNationalId}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {candidate.FirstName}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {candidate.LastName}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                candidate.Gender === 'Male'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-pink-100 text-pink-800'
                              }`}
                            >
                              {candidate.Gender}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                            <span className="font-medium">{new Date(candidate.DataOfficials).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-mono">
                            {candidate.PhoneNumber}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                            <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold">
                              {candidate.PostName || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {new Date(candidate.ExamDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-bold">
                            <span
                              className={`px-3 py-1.5 rounded-full ${
                                candidate.Marks >= 50
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {candidate.Marks}%
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleUpdateCandidate(candidate.CandidateNationalId)}
                                className="text-indigo-600 hover:text-indigo-900 transition-all duration-200 transform hover:scale-125"
                                title="Edit"
                              >
                                <FaEdit className="text-xl" />
                              </button>
                              <button
                                onClick={() => setDeletePopupId(candidate.CandidateNationalId)}
                                className="text-red-600 hover:text-red-900 transition-all duration-200 transform hover:scale-125"
                                title="Delete"
                              >
                                <FaTrashAlt className="text-xl" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-bold text-gray-700">{filteredCandidates.length}</span> of{' '}
                    <span className="font-bold text-gray-700">{candidates.length}</span> candidates
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-300 transition-colors shadow-sm">
                      Previous
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageCandidatesPage;