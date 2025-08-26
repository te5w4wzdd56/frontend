import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle 403 Forbidden - real access denied
      console.error('Access forbidden:', error.response.data);
      // Don't show alert for profile not found scenarios, let components handle it
      if (window.location.pathname !== '/login' && 
          !error.config?.url?.includes('/my-profile')) {
        alert('Access denied. You do not have permission to perform this action.');
      }
    } else if (error.response?.status === 404) {
      // Handle 404 Not Found - resource doesn't exist
      console.error('Resource not found:', error.response.data);
      // Let individual components handle 404 errors appropriately
    }
    return Promise.reject(error);
  }
);

// Helper function for public endpoints
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
