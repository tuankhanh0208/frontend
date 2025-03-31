// src/services/api.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { TOKEN_STORAGE } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Thay đổi thành false để tránh lỗi CORS với credentials
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie và thêm vào header Authorization
    const token = Cookies.get(TOKEN_STORAGE.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Xử lý lỗi 404 - Endpoint không tồn tại
    if (error.response?.status === 404) {
      console.error('API endpoint not found:', error.config.url);
    }
    
    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Với cấu trúc mới, chúng ta không còn sử dụng refresh token
        // Chuyển hướng người dùng đến trang đăng nhập
        console.log('Token hết hạn, chuyển hướng đến trang đăng nhập');
        
        // Xóa token hiện tại từ cookie
        // Import Cookies từ js-cookie để sử dụng
        const Cookies = require('js-cookie');
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('tokenExpiry', { path: '/' });
        
        // Chuyển hướng đến trang đăng nhập
        window.location.href = '/login';
        return Promise.reject(error);
      } catch (refreshError) {
        // Enhanced error logging for token refresh failures
        console.error('Token refresh failed:', {
          message: refreshError.message,
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          stack: refreshError.stack
        });
        
        // If refresh token is invalid, clear cookies and redirect to login
        const Cookies = require('js-cookie');
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        Cookies.remove('tokenExpiry', { path: '/' });
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
