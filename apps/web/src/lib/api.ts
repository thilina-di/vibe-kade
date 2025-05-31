import axios from 'axios';

// Define public routes that don't require authentication
const publicRoutes = ['/products', '/auth/login', '/auth/register', '/health'];

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    // Check if the error is 401 and the route is not public
    if (
      error.response?.status === 401 &&
      !publicRoutes.some(route => error.config.url?.includes(route))
    ) {
      // Clear token and redirect to login only for protected routes
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
