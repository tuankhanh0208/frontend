// src/services/authService.js
import api from './api';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

// Token storage keys
export const TOKEN_STORAGE = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry'
};

// Token utility functions
const tokenUtils = {
  // Store tokens securely with expiration in cookies
  storeTokens: (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
      
      // Tính toán thời gian hết hạn cho cookie (30 ngày)
      // Sử dụng thời gian dài hơn cho cookie so với thời gian hết hạn của token
      // để đảm bảo phiên đăng nhập được duy trì khi refresh trang
      const cookieExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 ngày
      
      // Lưu token vào cookie với thời gian hết hạn dài hơn
      Cookies.set(TOKEN_STORAGE.ACCESS_TOKEN, token, { expires: cookieExpiry, path: '/' });
      Cookies.set(TOKEN_STORAGE.TOKEN_EXPIRY, expiryTime.toString(), { expires: cookieExpiry, path: '/' });
      
      console.log('Token stored in cookies with extended expiry time');
      return true;
    } catch (error) {
      console.error('Failed to store token:', error);
      return false;
    }
  },
  
  // Get stored tokens from cookies
  getTokens: () => {
    return {
      accessToken: Cookies.get(TOKEN_STORAGE.ACCESS_TOKEN),
      refreshToken: Cookies.get(TOKEN_STORAGE.REFRESH_TOKEN),
      tokenExpiry: Cookies.get(TOKEN_STORAGE.TOKEN_EXPIRY)
    };
  },
  
  // Clear all stored tokens from cookies
  clearTokens: () => {
    // Xóa token khỏi cookie
    Cookies.remove(TOKEN_STORAGE.ACCESS_TOKEN, { path: '/' });
    Cookies.remove(TOKEN_STORAGE.REFRESH_TOKEN, { path: '/' });
    Cookies.remove(TOKEN_STORAGE.TOKEN_EXPIRY, { path: '/' });
    console.log('Tokens cleared from cookies');
  },
  
  // Check if token is expired
  isTokenExpired: (expiryTime) => {
    if (!expiryTime) return true;
    
    const currentTime = Date.now();
    const expiry = parseInt(expiryTime, 10);
    
    return currentTime >= expiry;
  },
  
  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon: (expiryTime) => {
    if (!expiryTime) return true;
    
    const currentTime = Date.now();
    const expiry = parseInt(expiryTime, 10);
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    return currentTime >= (expiry - fiveMinutes);
  },
  
  // Validate token format and structure
  validateToken: (token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      return !!decoded.exp; // Check if expiration exists
    } catch (error) {
      console.error('Invalid token format:', error);
      return false;
    }
  },
  
  // Decode token to extract user information
  decodeToken: (token) => {
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
};

const authService = {
  // Login with username and password
  login: async (username, password) => {
    try {
      console.log('Attempting login for user:', username);
      const response = await api.post('/api/auth/login', { username, password });
      
      console.log('Login response:', response.data);
      const { token, token_type, user_id, role } = response.data;
      
      if (!token || !token_type) {
        console.error('Missing tokens in login response');
        throw new Error('Authentication failed: Missing tokens');
      }
  
      // Lưu token vào cookie
      const tokenStored = tokenUtils.storeTokens(token);
      if (!tokenStored) {
        console.error('Failed to store token in cookie');
        throw new Error('Authentication failed: Could not store token');
      }
      console.log('Token stored successfully');
  
      // Lấy thông tin user đầy đủ
      const userData = {
        id: user_id,
        role: role,
        username: username
      };
  
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.detail || 'Đăng nhập thất bại');
    }
  },
  
  // Register new user
  register: async (username, name, email, phone, password) => {
    try {
      const response = await api.post('/api/auth/register', { 
        username,
        email,
        full_name: name,
        password
      });
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Đăng ký thất bại');
    }
  },
  
  // Logout
  logout: async () => {
    try {
      console.log('Performing logout');
      // Xóa token ngay lập tức không cần đợi API
      tokenUtils.clearTokens();
      
      // Có thể bỏ qua phần gọi API nếu backend không hỗ trợ
      // const response = await api.post('/api/auth/logout');
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Đã xóa token rồi nên không cần throw error
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      console.log('Attempting to get current user');
      // Get tokens using tokenUtils
      const { accessToken, tokenExpiry } = tokenUtils.getTokens();
      
      if (!accessToken) {
        console.log('No access token found, user is not authenticated');
        return null;
      }
      
      // Check if token is valid
      if (!tokenUtils.validateToken(accessToken)) {
        console.error('Invalid access token format, but keeping token');
        // Không xóa token khi không hợp lệ, chỉ trả về null
        // Giữ token để người dùng có thể thử lại sau khi refresh trang
        return null;
      }
      
      // Check if token is expired using tokenUtils
      if (tokenUtils.isTokenExpired(tokenExpiry)) {
        console.log('Access token is expired, attempting to refresh');
        // Token is expired, try to refresh
        try {
          const refreshed = await authService.refreshToken();
          if (!refreshed) {
            console.error('Token refresh failed');
            // Không xóa token ngay lập tức khi refresh thất bại
            // Người dùng có thể vẫn muốn giữ phiên đăng nhập
            return null;
          }
          console.log('Token refreshed successfully');
        } catch (error) {
          // Refresh failed, but don't clear storage immediately
          console.error('Token refresh error:', error.message);
          return null;
        }
      } else if (tokenUtils.isTokenExpiringSoon(tokenExpiry)) {
        // If token is about to expire, refresh in background
        console.log('Token is expiring soon, refreshing in background');
        authService.refreshToken().catch(error => {
          console.error('Background token refresh failed:', error.message);
        });
      }
      
      // Get user profile with the (potentially refreshed) token
      console.log('Fetching user profile from API');
      const response = await api.get('/api/auth/me');
      
      // Validate user data
      if (!response.data || typeof response.data !== 'object') {
        console.error('Invalid user data received:', response.data);
        return null;
      }
      
      // Giải mã token để lấy thông tin username
      try {
        const { accessToken } = tokenUtils.getTokens();
        
        if (!accessToken) {
          return null;
        }

        // Giải mã token để lấy thông tin cơ bản
        const decodedToken = jwtDecode(accessToken);
        
        try {
          // Gọi API để lấy thông tin user đầy đủ
          const response = await api.get('/api/auth/me');
          
          // Kết hợp thông tin từ token và API
          return {
            ...response.data,
            username: decodedToken.username || response.data.username,
            role: response.data.role,
            id: response.data.id
          };
        } catch (error) {
          if (error.response?.status === 401) {
            tokenUtils.clearTokens();
          }
          return null;
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        console.log('Current user fetched successfully');
        return response.data;
      }
    } catch (error) {
      console.error('Failed to get current user:', {
        message: error.message,
        responseStatus: error.response?.status,
        responseData: error.response?.data
      });
      return null;
    }
  },
  
  // Refresh token
  refreshToken: async () => {
    try {
      console.log('Attempting to refresh access token');
      // Get tokens using tokenUtils
      const { refreshToken } = tokenUtils.getTokens();
      
      if (!refreshToken) {
        console.error('Refresh token not found in storage');
        return false;
      }
      
      const response = await api.post('/api/auth/refresh-token', { refreshToken });
      
      // Log the response structure for debugging
      console.log('Refresh token API response structure:', JSON.stringify(response.data, null, 2));
      
      // Validate response
      if (!response.data || !response.data.accessToken) {
        console.error('Invalid refresh token response:', response.data);
        return false;
      }
      
      const { accessToken } = response.data;
      
      // Validate the new access token
      if (!tokenUtils.validateToken(accessToken)) {
        console.error('Invalid access token received from refresh');
        return false;
      }
      
      // Store the new access token while keeping the same refresh token
      const tokensStored = tokenUtils.storeTokens(accessToken, refreshToken);
      if (!tokensStored) {
        console.error('Failed to store refreshed access token');
        return false;
      }
      
      console.log('Token refresh successful');
      return true;
    } catch (error) {
      console.error('Token refresh failed:', {
        message: error.message,
        responseStatus: error.response?.status,
        responseData: error.response?.data
      });
      return false;
    }
  },
  
  // Login with Google
  loginWithGoogle: async () => {
    try {
      console.log('Attempting Google login');
      // In a real app, this would likely open a popup window for OAuth
      // For now, we'll just simulate with an API call
      const response = await api.post('/api/auth/google');
      
      // Log the response structure for debugging
      console.log('Google login API response structure:', JSON.stringify(response.data, null, 2));
      
      // Validate response structure
      if (!response.data || typeof response.data !== 'object') {
        console.error('Invalid response format from Google login:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      const { accessToken, refreshToken, user } = response.data;
      
      // Validate tokens
      if (!accessToken || !refreshToken) {
        console.error('Missing tokens in Google login response:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken 
        });
        throw new Error('Authentication failed: Missing tokens in response');
      }
      
      // Validate user object
      if (!user || typeof user !== 'object') {
        console.error('Missing or invalid user object in Google login response:', user);
        throw new Error('Authentication failed: Invalid user data');
      }
      
      // Use tokenUtils to store tokens securely with expiration
      const tokensStored = tokenUtils.storeTokens(accessToken, refreshToken);
      if (!tokensStored) {
        console.error('Failed to store Google authentication tokens');
        throw new Error('Authentication failed: Could not store tokens');
      }
      
      console.log('Google login successful for user:', user.username || user.email || 'Unknown');
      return user;
    } catch (error) {
      console.error('Google login error:', {
        message: error.message,
        responseStatus: error.response?.status,
        responseData: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Đăng nhập Google thất bại');
    }
  },
  
  // Login with Facebook
  loginWithFacebook: async () => {
    try {
      console.log('Attempting Facebook login');
      // Similar to Google login
      const response = await api.post('/api/auth/facebook');
      
      // Log the response structure for debugging
      console.log('Facebook login API response structure:', JSON.stringify(response.data, null, 2));
      
      // Validate response structure
      if (!response.data || typeof response.data !== 'object') {
        console.error('Invalid response format from Facebook login:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      const { accessToken, refreshToken, user } = response.data;
      
      // Validate tokens
      if (!accessToken || !refreshToken) {
        console.error('Missing tokens in Facebook login response:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken 
        });
        throw new Error('Authentication failed: Missing tokens in response');
      }
      
      // Validate user object
      if (!user || typeof user !== 'object') {
        console.error('Missing or invalid user object in Facebook login response:', user);
        throw new Error('Authentication failed: Invalid user data');
      }
      
      // Use tokenUtils to store tokens securely with expiration
      const tokensStored = tokenUtils.storeTokens(accessToken, refreshToken);
      if (!tokensStored) {
        console.error('Failed to store Facebook authentication tokens');
        throw new Error('Authentication failed: Could not store tokens');
      }
      
      console.log('Facebook login successful for user:', user.username || user.email || 'Unknown');
      return user;
    } catch (error) {
      console.error('Facebook login error:', {
        message: error.message,
        responseStatus: error.response?.status,
        responseData: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Đăng nhập Facebook thất bại');
    }
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/api/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    }
  },
  
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      await api.post('/api/auth/change-password', { 
        currentPassword, 
        newPassword 
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Thay đổi mật khẩu thất bại');
    }
  },
  
  // Reset password (request reset link)
  resetPassword: async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Yêu cầu đặt lại mật khẩu thất bại');
    }
  },
  
  // Confirm reset password with token
  confirmResetPassword: async (token, newPassword) => {
    try {
      await api.post('/api/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    }
  },
  
  // Verify email
  verifyEmail: async (token) => {
    try {
      await api.post('/api/auth/verify-email', { token });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Xác minh email thất bại');
    }
  }
};

// Export tokenUtils để có thể sử dụng trong các component khác
authService.tokenUtils = tokenUtils;

export default authService;
