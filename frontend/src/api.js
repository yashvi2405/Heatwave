// api.js - central place for all backend API calls
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getWeatherData = (limit = 30) => api.get(`/data?limit=${limit}`);
export const getAlerts = () => api.get('/alerts');
export const predictHeatwave = (payload) => api.post('/predict', payload);
export const loginUser = (payload) => api.post('/login', payload);

export default api;
