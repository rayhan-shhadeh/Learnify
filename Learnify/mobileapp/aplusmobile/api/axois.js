import axios from 'axios';
//192.168.68.58
const API = axios.create({
  baseURL: 'http://localhost:8080/api/', // Replace with your backend URL
  withCredentials: true, // Enable cookies for CORS
},{headers: {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',

}});


export default API;
