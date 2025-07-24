import axios from 'axios';

const api = axios.create({
  baseURL: 'http://206.189.134.117:8000/api', // ⬅️ Your backend root
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // If CSRF or cookies are involved
});

export default api;
