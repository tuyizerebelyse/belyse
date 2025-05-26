import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const Sidebar = () => {
  const [isCandidatesOpen, setCandidatesOpen] = useState(false);
  const [isMarksOpen, setMarksOpen] = useState(false);
  const [isPostsOpen, setPostsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-72 min-h-screen shadow-2xl flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          CAMELLIA
        </h1>
        <p className="text-xs mt-1 text-gray-400">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-3">
          {/* Dashboard */}
          <li>
            <Link
              to="/dashboard"
              className="flex items-center px-5 py-3 rounded-xl transition-all duration-300 hover:bg-gray-700 hover:shadow-lg hover:translate-x-1 group"
            >
              <span className="mr-4 text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                📊
              </span>
              <span className="font-medium group-hover:text-blue-300">Dashboard</span>
            </Link>
          </li>

          {/* Candidates Dropdown */}
          <li>
            <div
              className="flex items-center justify-between px-5 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:shadow-lg"
              onClick={() => setCandidatesOpen(!isCandidatesOpen)}
            >
              <div className="flex items-center">
                <span className="mr-4 text-xl bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                  👤
                </span>
                <span className="font-medium">Candidates</span>
              </div>
              <span className={`transition-transform duration-300 ${isCandidatesOpen ? 'rotate-180 text-purple-400' : 'text-gray-400'}`}>
                ▼
              </span>
            </div>
            {isCandidatesOpen && (
              <div className="ml-8 mt-2 space-y-2 overflow-hidden animate-fadeIn">
                <Link
                  to="/register-candidate"
                  className="block px-5 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:pl-6 hover:text-blue-300"
                >
                  ➕ Add Candidate
                </Link>
                <Link
                  to="/manage-candidates"
                  className="block px-5 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:pl-6 hover:text-blue-300"
                >
                  🛠️ Manage Candidates
                </Link>
              </div>
            )}
          </li>

          <li>
            <div
              className="flex items-center justify-between px-5 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:shadow-lg"
              onClick={() => setPostsOpen(!isPostsOpen)}
            >
              <div className="flex items-center">
                <span className="mr-4 text-xl bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                  ✍️
                </span>
                <span className="font-medium">Posts</span>
              </div>
              <span className={`transition-transform duration-300 ${isPostsOpen ? 'rotate-180 text-purple-400' : 'text-gray-400'}`}>
                ▼
              </span>
            </div>
            {isPostsOpen && (
              <div className="ml-8 mt-2 space-y-2 overflow-hidden animate-fadeIn">
                <Link
                  to="/add-post"
                  className="block px-5 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:pl-6 hover:text-blue-300"
                >
                  ➕ Add Post
                </Link>
                <Link
                  to="/manage-posts"
                  className="block px-5 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:pl-6 hover:text-blue-300"
                >
                  🛠️ Manage Posts
                </Link>
              </div>
            )}
          </li>
          <li>
            <Link
              to="/settings"
              className="block px-5 py-3 rounded-xl transition-all duration-300 hover:bg-gray-700 hover:shadow-lg hover:translate-x-1 group"
            >
              <span className="mr-4 text-xl  text-white group-hover:scale-110 transition-transform">
                ⚙️
              </span>
              <span className="font-medium group-hover:text-blue-300">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          <span className="mr-3">🚪</span>
          Logout
          <span className="ml-3 text-xs opacity-70">ESC</span>
        </button>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;