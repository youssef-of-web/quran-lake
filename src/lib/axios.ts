import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://www.mp3quran.net/api/v3/",
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling (removed cache-busting timestamp for better caching)
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);
