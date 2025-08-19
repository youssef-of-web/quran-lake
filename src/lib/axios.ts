import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://www.mp3quran.net/api/v3/",
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for better error handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
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
