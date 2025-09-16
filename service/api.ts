import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const dataString = localStorage.getItem('userData'); // or whatever key you use
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        if (data && data.token) {
          config.headers.Authorization = `Bearer ${data.token}`;
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
    return config;
  }, 
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Don't modify the response structure here
    // Let your services handle response.data
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('Network Error:', error.message);
    } else if (error.response.status === 401) {
      console.error('Unauthorized Error:', error.response.data);
      // Handle logout or redirect
    }
    return Promise.reject(error);
  }
);

export default api;