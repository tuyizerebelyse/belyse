// src/context/AuthProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; // still fine to leave this

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const res = await axios.post('/api/auth/login', credentials);
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
