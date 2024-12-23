import axios from 'axios';
//192.168.68.58
const API = axios.create({
  baseURL: 'http://192.168.68.58:8080/', // Replace with your backend URL
  withCredentials: true, // Enable cookies for CORS
// },{headers: {
//   'Content-Type': 'application/json',
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',

// }

});
const token = response.data.token;


export default API;
