import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaSpinner, FaSearch, FaFilter } from 'react-icons/fa';
import { MdOutlineWarningAmber } from 'react-icons/md';
import { IoIosInformationCircle, IoMdClose } from 'react-icons/io';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ManagePostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletePopupId, setDeletePopupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        if (!event.target.closest('.delete-button')) {
          setDeletePopupId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/posts');
        console.log("✅ Posts fetched:", response.data);

        if (Array.isArray(response.data)) {
          setPosts(response.data);
          setFilteredPosts(response.data);
        } else {
          console.error("❌ Unexpected response format:", response.data);
          setError("Unexpected response format. Contact admin.");
        }
      } catch (err) {
        console.error('❌ Error fetching posts:', err);
        setError(err.response?.data?.message || 'Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = posts.filter(post =>
        Object.values(post).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        ));
      setFilteredPosts(results);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const handleDeletePost = async (postIdToDelete) => {
    try {
      const response = await axios.delete(`/api/posts/${postIdToDelete}`);

      if (response.status === 200) {
        console.log('✅ Post deleted successfully:', response.data.message);
        setPosts(prevPosts => prevPosts.filter(p => p.PostID !== postIdToDelete));
        setFilteredPosts(prevFilteredPosts => prevFilteredPosts.filter(p => p.PostID !== postIdToDelete));
        setDeletePopupId(null);
      } else if (response.status === 404) {
        console.error('❌ Post not found on the server.');
        setError('Post not found on the server. Please refresh the page.');
        setDeletePopupId(null);
      } else {
        console.error('❌ Failed to delete post:', response.status, response.data);
        setError(response.data?.error || 'Failed to delete post. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      setError(error.response?.data?.error || 'Failed to delete post. Please check your connection.');
      setDeletePopupId(null);
    }
  };

  const handleUpdatePost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full transform transition-all duration-300 hover:scale-[1.02]">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Loading Posts</h2>
          <p className="text-gray-600 text-lg">Please wait while we fetch the post data...</p>
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
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Posts</h1>
                <p className="text-gray-600">View, edit, and manage all posts</p>
              </div>
              <button
                onClick={() => navigate('/add-post')}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaPlus className="text-lg" />
                <span className="font-medium">Add New Post</span>
              </button>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search posts by title, author, or content..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <IoMdClose className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-2xl shadow-sm transform transition-all duration-300 hover:translate-x-1">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MdOutlineWarningAmber className="text-yellow-500 text-3xl mt-1 mr-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-yellow-800 mb-1">No Posts Found</h3>
                    <p className="text-yellow-700">
                      {searchTerm
                        ? 'No posts match your search criteria.'
                        : 'There are no posts yet.'}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="mt-3 px-4 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-600 to-blue-600">
                      <tr>
                        {['Title', 'Actions'].map((title) => (
                          <th
                            key={title}
                            className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            {title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPosts.map((post) => (
                        <tr
                          key={post.PostID}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-indigo-600 font-medium">
                                  {post.PostName?.charAt(0) || 'P'}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {post.PostName || 'Untitled Post'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {post.author || 'Unknown Author'} • {post.date || 'No date'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 relative">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleUpdatePost(post.PostID)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 transform hover:scale-110"
                                title="Edit"
                              >
                                <FaEdit className="text-lg" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletePopupId(post.PostID);
                                }}
                                className="delete-button text-red-600 hover:text-red-900 transition-colors duration-200 transform hover:scale-110"
                                title="Delete"
                              >
                                <FaTrashAlt className="text-lg" />
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
                    Showing <span className="font-medium">{filteredPosts.length}</span> of{' '}
                    <span className="font-medium">{posts.length}</span> posts
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors">
                      Previous
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal Overlay */}
          {deletePopupId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div 
                ref={popupRef}
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <IoIosInformationCircle className="text-red-500 text-2xl" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-medium text-gray-900">Confirm Deletion</h3>
                    <div className="mt-2 text-gray-500">
                      Are you sure you want to delete this post? This action cannot be undone.
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setDeletePopupId(null)}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const postToDelete = filteredPosts.find(p => p.PostID === deletePopupId);
                      handleDeletePost(postToDelete.PostID);
                    }}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManagePostsPage;