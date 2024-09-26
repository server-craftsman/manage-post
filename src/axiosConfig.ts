import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: '/api', // Set your base URL here
  timeout: 10000, // Set a timeout if needed
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Add any request interceptors here
    console.log('Request Interceptor', config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // Add any response interceptors here
    console.log('Response Interceptor', response);
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;