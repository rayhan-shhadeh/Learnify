import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/axios';
import '../CSS/Login.css';
import Cookies from 'js-cookie'; // Import js-cookie library
import {jwtDecode} from 'jwt-decode';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';                                   
import axios from '../../../api/axios'; // Import axios library
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
//     try {
//       const response = await API.post('login', formData);
//       localStorage.setItem('token', response.data.token); // Save token in local storage
//       setMessage('Logged in successfully!');
// response.setToken(response.data.token);
//       // Redirect to the profile page after successful login
//       navigate('/profile'); // Redirect to '/profile'
//     } catch (error) {
//       setMessage(error.response.data.message || 'Error logging in.');
//     }

    try {
      const response = await axios.post('http://localhost:8080/api/login', formData );
      const token = response.data.token;
      const decoded = jwtDecode(token);
      // Cookies.set('authToken', token); // Save token in a cookie
      // Cookies.set('user', decoded); // Save user data in a cookie
      setMessage('Logged in successfully!');
      navigate('/profile'); // Redirect to '/profile'
    } catch (error) {
      setMessage(error.response.data.message || 'Error logging in.');
    }
    
  };

  return (
    <Container maxWidth="sm" className="sub-container">
      <h2>Login</h2>
      <form  className="sub-container" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </Container>
  );

}

export default Login;
