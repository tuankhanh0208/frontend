// Dữ liệu giả để thử nghiệm trang quản lý đơn hàng

const orders = [
  {
    id: '1001',
    product_name: 'TurboCharge, AeroFlex Wheels',
    customer_name: 'Joe Doe',
    phone_number: '+1 (000) 000-0000',
    email: 'example@gmail.com',
    address: '100 Main St, NYC, NY, USA',
    total_amount: 875.00,
    shipping_method: 'Nhanh',
    is_prepaid: false,
    created_at: '2025-04-15T10:30:00Z',
    status: 'pending'
  },
  {
    id: '1002',
    product_name: 'TurboCharge',
    customer_name: 'Jane Doe',
    phone_number: '+1 (000) 000-0000',
    email: 'example@gmail.com',
    address: '100 Main St, NYC, NY, USA',
    total_amount: 875.00,
    shipping_method: 'Tiêu chuẩn',
    is_prepaid: false,
    created_at: '2025-04-14T14:20:00Z',
    status: 'delivered'
  },
  {
    id: '1003',
    product_name: 'TurboCharge, AeroFlex Wheels',
    customer_name: 'Joe Doe',
    phone_number: '+1 (000) 000-0000',
    email: 'example@gmail.com',
    address: '100 Main St, NYC, NY, USA',
    total_amount: 875.00,
    shipping_method: 'Nhanh',
    is_prepaid: true,
    created_at: '2025-04-13T09:15:00Z',
    status: 'pending'
  },
  {
    id: '1004',
    product_name: 'TurboCharge',
    customer_name: 'Jane Doe',
    phone_number: '+1 (000) 000-0000',
    email: 'example@gmail.com',
    address: '100 Main St, NYC, NY, USA',
    total_amount: 875.00,
    shipping_method: 'Nhanh',
    is_prepaid: true,
    created_at: '2025-04-12T16:45:00Z',
    status: 'delivered'
  },
  {
    id: '1005',
    product_name: 'TurboCharge, AeroFlex Wheels',
    customer_name: 'Joe Doe',
    phone_number: '+1 (000) 000-0000',
    email: 'example@gmail.com',
    address: '100 Main St, NYC, NY, USA',
    total_amount: 875.00,
    shipping_method: 'Nhanh',
    is_prepaid: true,
    created_at: '2025-04-11T11:30:00Z',
    status: 'delivered'
  },
  {
    id: '1006',
    product_name: 'TurboCharge',
    customer_name: 'Jane Doe',
    phone_number: '+1 (000) 000-0000',
    email: 'example@gmail.com',
    address: '100 Main St, NYC, NY, USA',
    total_amount: 875.00,
    shipping_method: 'Tiêu chuẩn',
    is_prepaid: true,
    created_at: '2025-04-10T13:10:00Z',
    status: 'delivered'
  },
  {
    id: '1007',
    product_name: 'TurboCharge, AeroFlex Wheels',
    customer_name: 'Joe Doe',
    phone_number: '+1 (000) 000-0000',
    email: 'example@gmail.com',
    address: '100 Main St, NYC, NY, USA',
    total_amount: 875.00,
    shipping_method: 'Tiêu chuẩn',
    is_prepaid: true,
    created_at: '2025-04-09T15:20:00Z',
    status: 'delivered'
  }
];

// API giả để thử nghiệm
const orderApi = {
  getOrders: (params = {}) => {
    const { skip = 0, limit = 10, filter, sort } = params;
    
    let filteredOrders = [...orders];
    
    // Lọc theo status
    if (filter && filter !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filter);
    }
    
    // Sắp xếp
    if (sort) {
      filteredOrders.sort((a, b) => {
        switch (sort) {
          case 'newest':
            return new Date(b.created_at) - new Date(a.created_at);
          case 'oldest':
            return new Date(a.created_at) - new Date(b.created_at);
          case 'amount_high':
            return b.total_amount - a.total_amount;
          case 'amount_low':
            return a.total_amount - b.total_amount;
          default:
            return 0;
        }
      });
    }
    
    // Phân trang
    const paginatedOrders = filteredOrders.slice(skip, skip + limit);
    
    return {
      orders: paginatedOrders,
      total: filteredOrders.length,
      skip,
      limit
    };
  },
  
  getOrderById: (id) => {
    const order = orders.find(order => order.id === id);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  },
  
  updateOrder: (id, orderData) => {
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    const updatedOrder = { ...orders[orderIndex], ...orderData };
    orders[orderIndex] = updatedOrder;
    
    return updatedOrder;
  },
  
  deleteOrder: (id) => {
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders.splice(orderIndex, 1);
    
    return { success: true, message: 'Order deleted successfully' };
  }
};

export default orderApi; 