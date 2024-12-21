import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/axios';
import '../../../CSS/Login.css';
import Cookies from 'js-cookie'; // Import js-cookie library
import {jwtDecode} from 'jwt-decode';
import { Container, TextField, Button, Typography, Box, Alert, Card } from '@mui/material';                                   
import axios from '../../../api/axios'; // Import axios library
function UpdatePassword() {
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
      const response = await axios.post('http://localhost:8080/api/updateme', formData );
      const token = response.data.token;
      const decoded = jwtDecode(token);
      
      // Cookies.set('authToken', token); // Save token in a cookie
      // Cookies.set('user', decoded); // Save user data in a cookie
      setMessage('update in successfully!');
      navigate('/profile'); // Redirect to '/profile'
    } catch (error) {
      setMessage(error.response.data.message || 'Error logging in.');
    }
    
  };

  return (
    <>
<Card style={{width: '18rem' , margin: 'auto', marginTop: '10px' , padding: '10px' , textAlign: 'center', backgroundColor: '#1ca7ec'}}> 
  Reset Password
</Card>
    <Container maxWidth="sm" className="sub-container">
      <h2>Did you forgot your password? </h2>

      <form  className="sub-container" onSubmit={handleSubmit}>
        <input style={{width: '100%', padding: '10px', margin: '10px'}}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          />
        <input style={{width: '100%', padding: '10px', margin: '10px'}}
          type="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          >
           Reset my Password
        </Button>

        <button type="submit"></button>
      </form>
      <p>{message}</p>
    </Container>
    </>
  );

}

export default UpdatePassword;
