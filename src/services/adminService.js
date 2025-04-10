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
  }
};

export default adminService; 