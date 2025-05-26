import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">SIMS</Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">Spare Parts</Link>
                <Link to="/stock-in" className="hover:bg-blue-700 px-3 py-2 rounded">Stock In</Link>
                <Link to="/stock-out" className="hover:bg-blue-700 px-3 py-2 rounded">Stock Out</Link>
                <div className="relative group">
                  <button className="hover:bg-blue-700 px-3 py-2 rounded">Reports</button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/reports/stock-status" className="block px-4 py-2 hover:bg-gray-100">Stock Status</Link>
                    <Link to="/reports/daily-stock-out" className="block px-4 py-2 hover:bg-gray-100">Daily Stock Out</Link>
                  </div>
                </div>
                <span className="px-3 py-2">Welcome, {user?.username}</span>
                <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">Login</Link>
                <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;