import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <div>
        <Link to="/login">
          <button>Go to Login</button>
        </Link>
      </div>
      <div>
        <Link to="/signup">
          <button>Go to Signup</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;