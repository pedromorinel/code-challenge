import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method ? config.method.toUpperCase() : 'UNKNOWN'} ${config.url}`);
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
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    console.error('Response Error:', (error.response && error.response.data) || error.message);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('Bad Request:', data.message);
          break;
        case 404:
          console.error('Not Found:', data.message);
          break;
        case 500:
          console.error('Internal Server Error:', data.message);
          break;
        case 502:
          console.error('OMDB API Error:', data.message);
          break;
        default:
          console.error('Unknown Error:', data.message);
      }
    } else if (error.request) {
      console.error('Network Error: No response received');
    } else {
      console.error('Request Configuration Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 