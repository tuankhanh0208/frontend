import api from './api';

/**
 * Service để quản lý các API liên quan đến phần quản trị
 * Bao gồm các API dashboard đã được triển khai ở backend
 */
const adminService = {
  /**
   * Lấy thống kê tổng hợp (Total Order, Total Revenue, Total Customer, Total Product)
   * @returns {Promise<Object>} - Thống kê tổng hợp
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê dashboard:', error);
      throw new Error('Không thể lấy thống kê dashboard');
    }
  },

  /**
   * Lấy danh sách đơn hàng gần đây
   * @param {number} limit - Số lượng đơn hàng muốn lấy (mặc định: 10)
   * @returns {Promise<Object>} - Danh sách đơn hàng gần đây
   */
  getRecentOrders: async (limit = 10) => {
    try {
      const response = await api.get(`/api/admin/dashboard/recent-orders?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng gần đây:', error);
      throw new Error('Không thể lấy đơn hàng gần đây');
    }
  },

  /**
   * Lấy thống kê doanh thu theo thời gian
   * @param {string} mode - Khoảng thời gian (daily, weekly, monthly, yearly)
   * @returns {Promise<Object>} - Thống kê doanh thu theo thời gian
   */
  getRevenueOverview: async (mode = 'monthly') => {
    try {
      const response = await api.get(`/api/admin/dashboard/revenue-overview?mode=${mode}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy tổng quan doanh thu:', error);
      throw new Error('Không thể lấy tổng quan doanh thu');
    }
  },

  /**
   * Lấy tất cả thống kê dashboard (stats, recent orders, revenue) trong một lần gọi
   * @param {number} orderLimit - Số lượng đơn hàng muốn lấy (mặc định: 10)
   * @param {string} revenueMode - Khoảng thời gian (daily, weekly, monthly, yearly)
   * @returns {Promise<Object>} - Tất cả thống kê dashboard
   */
  getAllDashboardData: async (orderLimit = 10, revenueMode = 'monthly') => {
    try {
      const [stats, recentOrders, revenueOverview] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentOrders(orderLimit),
        adminService.getRevenueOverview(revenueMode)
      ]);
      
      return {
        stats,
        recentOrders: recentOrders.orders,
        revenueOverview: revenueOverview.revenue_periods
      };
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu dashboard:', error);
      throw new Error('Không thể lấy dữ liệu dashboard');
    }
  },

  /**
   * Lấy danh sách người dùng với phân trang
   * @param {number} skip - Số bản ghi bỏ qua (mặc định: 0)
   * @param {number} limit - Số bản ghi tối đa (mặc định: 10)
   * @returns {Promise<Object>} - Danh sách người dùng và thông tin phân trang
   */
  getUsers: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/api/admin/manage/users?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      throw new Error(error.response?.data?.detail || 'Không thể lấy danh sách người dùng');
    }
  },

  /**
   * Lấy thông tin chi tiết của một người dùng theo ID
   * @param {number} userId - ID của người dùng
   * @returns {Promise<Object>} - Thông tin chi tiết người dùng
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/api/admin/manage/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin người dùng ID ${userId}:`, error);
      throw new Error(error.response?.data?.detail || 'Không thể lấy thông tin người dùng');
    }
  },

  /**
   * Tìm kiếm người dùng theo các tiêu chí
   * @param {Object} searchParams - Các tiêu chí tìm kiếm (name, role, status)
   * @param {number} skip - Số bản ghi bỏ qua (mặc định: 0) 
   * @param {number} limit - Số bản ghi tối đa (mặc định: 10)
   * @returns {Promise<Object>} - Kết quả tìm kiếm và thông tin phân trang
   */
  searchUsers: async (searchParams, skip = 0, limit = 10) => {
    try {
      const response = await api.post(`/api/admin/manage/users/search?skip=${skip}&limit=${limit}`, searchParams);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
      throw new Error(error.response?.data?.detail || 'Không thể tìm kiếm người dùng');
    }
  },

  /**
   * Thêm người dùng mới
   * @param {Object} userData - Thông tin người dùng mới
   * @returns {Promise<Object>} - Thông tin người dùng đã tạo
   */
  addUser: async (userData) => {
    try {
      const response = await api.post('/api/admin/manage/users', userData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm người dùng mới:', error);
      throw new Error(error.response?.data?.detail || 'Không thể thêm người dùng mới');
    }
  },

  /**
   * Cập nhật thông tin người dùng
   * @param {number} userId - ID của người dùng
   * @param {Object} userData - Thông tin cập nhật
   * @returns {Promise<Object>} - Thông tin người dùng đã cập nhật
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/api/admin/manage/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật người dùng ID ${userId}:`, error);
      throw new Error(error.response?.data?.detail || 'Không thể cập nhật thông tin người dùng');
    }
  },

  /**
   * Xóa người dùng
   * @param {number} userId - ID của người dùng
   * @returns {Promise<Object>} - Kết quả xóa người dùng
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/api/admin/manage/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa người dùng ID ${userId}:`, error);
      throw new Error(error.response?.data?.detail || 'Không thể xóa người dùng');
    }
  }
};

export default adminService; 