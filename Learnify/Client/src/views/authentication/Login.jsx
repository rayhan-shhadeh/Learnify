import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography, TextField, Button, Alert } from '@mui/material';

// components
import PageContainer from '../../Components/container/PageContainer';
import Logo from '../../layouts/full/shared/logo/Logo';
import API from '../../../src/api/axios';
import Cookies from 'js-cookie';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false); // To differentiate success/error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('login', formData);  
      const token = response.data.token;
      console.log("token from login: ",token);
Cookies.set('token', token);
      // localStorage.setItem('authToken', token);
      setMessage('Logged in successfully!');
      setError(false); // Reset error state

      // Redirect to the profile page after successful login
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error logging in.');
      setError(true); // Set error state
    }
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Logo />
              </Box>
              <form onSubmit={handleSubmit}>
                <Typography variant="h5" textAlign="center" mb={2}>
                  Login to A+
                </Typography>
                {message && (
                  <Alert severity={error ? 'error' : 'success'} sx={{ mb: 2 }}>
                    {message}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  required
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Login
                </Button>
              </form>
              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="500">
                  New to A+?
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/register"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Create an account
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login;
