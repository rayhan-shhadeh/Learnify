import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    dateOfBirth: '',
    Major: '',
    photo: '', // Optional field
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate the form data before submission
  const validateForm = () => {
    const { email, username, password, dateOfBirth, Major } = formData;

    // Basic validation checks
    if (!email || !username || !password || !dateOfBirth || !Major) {
      setError('All fields are required!');
      return false;
    }


    return true;
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages
    setSuccess(''); // Clear previous success messages

    if (!validateForm()) {
      return; // Stop the form submission if validation fails
    }

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
      });

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Display server-side error message
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      {error && <p className="error-message text-danger">{error}</p>}
      {success && <p className="success-message text-success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateOfBirth" className="form-label">Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            className="form-control"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Major" className="form-label">Major:</label>
          <input
            type="text"
            name="Major"
            className="form-control"
            value={formData.Major}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Photo URL:</label>
          <input
            type="text"
            name="photo"
            className="form-control"
            value={formData.photo}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
