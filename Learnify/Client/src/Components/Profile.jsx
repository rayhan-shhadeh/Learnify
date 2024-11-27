import React, { useEffect, useState } from 'react';
import '../CSS/profile.css'; // CSS file for styling

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API (e.g., based on stored token)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simulate fetching user data
      setTimeout(() => {
        // This is where you'd make an API call to fetch user data.
        setUser({
          name: 'John Doe',
          email: 'johndoe@example.com',
          dateOfBirth: '1990-01-01',
          major: 'Computer Engineering',
          subscription: 'Premium',
        });
        setLoading(false);
      }, 1000);
    }
  }, []);

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img src="https://via.placeholder.com/150" alt="User Avatar" />
        </div>
        <div className="profile-details">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.major}</p>
          <p>Subscription: {user.subscription}</p>
        </div>
      </div>

      <div className="profile-info">
        <h3>Account Details</h3>
        <div className="profile-item">
          <strong>Date of Birth:</strong> {user.dateOfBirth}
        </div>
        <div className="profile-item">
          <strong>Subscription Plan:</strong> {user.subscription}
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-button">Edit Profile</button>
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Profile;
