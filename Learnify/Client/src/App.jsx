import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';
import Login from './Components/Login';
import Home from './Components/Home';
import SignUp from './Components/SignUp';
import PrivateRoute from './Components/PrivateRoute';
import Profile from './Components/Profile'; // Adjust the path as necessary

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api');
      setArray(response.data.fruits);
      console.log(response.data.fruits);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <div className="container">
        <div className="d-flex justify-content-center my-4">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 className="text-center">Vite + React</h1>
        <div className="card text-center">
          <button className="btn btn-primary" onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
          {array.map((fruit, index) => (
            <div key={index}>
              <p>{fruit}</p>
              <br />
            </div>
          ))}
        </div>
        <p className="read-the-docs text-center">
          Click on the Vite and React logos to learn more
        </p>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/private" element={<PrivateRoute />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;