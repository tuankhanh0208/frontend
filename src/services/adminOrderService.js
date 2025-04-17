import api from './api';

const adminOrderService = {
  // Lấy danh sách đơn hàng với phân trang, lọc và sắp xếp
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/manage/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
    }
  },
  
  // Lấy chi tiết đơn hàng
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/api/admin/manage/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết đơn hàng');
    }
  },
  
  // Cập nhật đơn hàng
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/api/admin/manage/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật đơn hàng');
    }
  },
  
  // Xóa đơn hàng
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/api/admin/manage/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error(error.response?.data?.message || 'Không thể xóa đơn hàng');
    }
  },
  
  // Lấy tùy chọn lọc đơn hàng
  getOrderFilterOptions: async () => {
    try {
      const response = await api.get('/api/admin/manage/orders/filter-options');
      return response.data;
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy tùy chọn lọc');
    }
  }
};

export default adminOrderService; 