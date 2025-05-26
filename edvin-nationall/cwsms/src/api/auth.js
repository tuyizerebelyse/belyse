// src/api/auth.js
import axios from 'axios';

export const onLogin = async ({ username, password }) => {
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { token, user } = response.data;

    // Save the token so axiosInstance can pick it up
    localStorage.setItem('token', token);

    return { success: true, user };
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || 'Login failed'
    };
  }
};
