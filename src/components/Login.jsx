import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/login?username=${username}`);
      setToken(response.data);
      localStorage.setItem('jwt', response.data);
      setMessage('Login successful! Token saved.');
    } catch (error) {
      console.error('Login failed', error);
      setMessage('Login failed.');
    }
  };

  const validateToken = async () => {
    const storedToken = localStorage.getItem('jwt');
    if (!storedToken) {
      setMessage('No token found. Please log in.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/validate?token=${storedToken}`);
      if (response.data.code === '200') {
        setMessage(`Token valid! Welcome, ${response.data.message}`);
      } else {
        setMessage('Invalid token. Please log in again.');
      }
    } catch (error) {
      console.error('Token validation failed', error);
      setMessage('Token validation failed.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>JWT Login</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={validateToken} style={{ marginLeft: '10px' }}>
        Validate Token
      </button>
      <p>{message}</p>
    </div>
  );
};

export default Login;
