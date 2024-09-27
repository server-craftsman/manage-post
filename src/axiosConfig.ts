import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: 'https://66f4051b77b5e8897097eaef.mockapi.io/', 
  timeout: 10000, // Set a timeout if needed
  headers: {
    'Content-Type': 'application/json',
  },
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