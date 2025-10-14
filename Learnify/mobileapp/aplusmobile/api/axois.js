import axios from 'axios';
export const LOCALHOST= `172.23.3.88`;
const API = axios.create({
  baseURL: `http://172.23.3.88:8080`,
  headers: {
    'Content-Type': 'application/json',
  },
  allowCredentials: true,
  withCredentials: true,
});
export default API;
