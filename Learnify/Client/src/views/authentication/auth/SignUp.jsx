import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import '../CSS/SignUp.css';


const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    dateOfBirth: '',
    Major: '',
    photo: '', // Optional field
    flag: 1,  // Implicit value for flag
    subscription: 1,  // Implicit value for subscription
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/api/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Success response handling
      setSuccess('Account created successfully!');
      setFormData({
        email: '',
        username: '',
        password: '',
        dateOfBirth: '',
        Major: '',
        photo: '', // Reset photo input
        flag: 1,   // Reset flag
        subscription: 1, // Reset subscription
      });

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error signing up.');
      }
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:8080/api/auth/google';
  };

  return (
    <>

      <Container maxWidth="sm" className="sub-container">
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up
          </Typography>
          {error && <Alert severity="error" className="alert">{error}</Alert>}
          {success && <Alert severity="success" className="alert">{success}</Alert>}
        </Box>
        <form className="sub-container" onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
              className="form-control"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Major"
              name="Major"
              value={formData.Major}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Photo URL"
              name="photo"
              value={formData.photo}
              onChange={handleInputChange}
              className="form-control"
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth className="btn-primary">
            Sign Up
          </Button>
        </form>
      </Container>
      <Container>


      </Container>    
        <Button variant="contained" color="primary" fullWidth className="btn-primary h1" onClick={handleGoogleAuth}>
        Sign in with Google
      </Button>


    </>
  );
};

export default SignUp;