import axios from 'axios';

// Aligning the backend server with the frontend
// VITE_API_URL should be set in your deployment platform (e.g., Vercel environment variables)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://manoj-portfolio-api-lpw5.onrender.com';


console.log(`[API] Connecting to: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 seconds timeout for better UX
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor: Attach Token & Performance Tracking
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const method = config.method?.toUpperCase();
  
  // Performance tracking
  config.metadata = { startTime: new Date() };

  // Only attach token for non-GET (admin/write) requests to avoid 401 on public endpoints
  if (token && method !== 'GET') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Perfect Error Handling & Logging
api.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`[API] ${response.config.method.toUpperCase()} ${response.config.url} took ${duration}ms`);
    }
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      // The server responded with a status code that falls out of the range of 2xx
      console.error(`[API Error] Status: ${response.status}`, response.data);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      } else if (response.status === 403) {
        console.warn('[API] Access Denied. Check your permissions.');
      } else if (response.status >= 500) {
        console.error('[API] Server Error. Please try again later.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[API Error] No response received. Check your internet connection or if the backend is down.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[API Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper to get the full image URL.
 * Optimally handles both relative paths and absolute URLs.
 */
export const getImgUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Ensure we don't have double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export default api;

