import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api/', // Replace with your backend URL
  withCredentials: true, // Enable cookies for CORS
},{headers: {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Authorization': 'Bearer '+localStorage.getItem('token'),
  'Access-Control-Allow-Credentials': 'true',
'Access-Control-Max-Age': 86400

}});


export default API;
