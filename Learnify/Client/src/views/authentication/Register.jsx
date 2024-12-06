import React, { useState } from 'react';
import axios from '../../../src/api/axios';
import { Grid, Box, Card, Stack, Typography, Alert, Button, TextField } from '@mui/material';

// components
import PageContainer from '../../Components/container/PageContainer';
import Logo from '../../layouts/full/shared/logo/Logo';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    dateOfBirth: '',
    Major: '',
    photo: '',
    flag: 1,
    subscription: 1,
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

      setSuccess('Account created successfully!');
      setFormData({
        email: '',
        username: '',
        password: '',
        dateOfBirth: '',
        Major: '',
        photo: '',
        flag: 1,
        subscription: 1,
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
    <PageContainer title="Sign Up" description="this is Sign Up page">
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
              <Typography variant="h4" textAlign="center" mb={2}>
                Sign Up
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Major"
                    name="Major"
                    value={formData.Major}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Photo URL"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                  />
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sign Up
                  </Button>
                </Stack>
              </form>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleGoogleAuth}
              >
                Sign in with Google
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default SignUp;
