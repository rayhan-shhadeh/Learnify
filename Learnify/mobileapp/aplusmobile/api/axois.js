import axios from 'axios';
//192.168.68.58
const API = axios.create({
  baseURL: `http://192.168.68.59:8080`, // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  allowCredentials: true,
  withCredentials: true,
});
export default API;
