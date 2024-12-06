import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api/', // Replace with your backend URL
  withCredentials: true, // Enable cookies for CORS
  
});

export default API;
