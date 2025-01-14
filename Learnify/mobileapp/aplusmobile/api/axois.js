import axios from 'axios';
export const LOCALHOST= `192.168.68.59`;
const API = axios.create({
  baseURL: `http://192.168.68.59:8080`,
  headers: {
    'Content-Type': 'application/json',
  },
  allowCredentials: true,
  withCredentials: true,
});
export default API;
