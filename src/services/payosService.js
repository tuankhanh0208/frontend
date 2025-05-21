import axios from 'axios';
import { API_URL, PAYOS_CONFIG } from '../config';

// Add request interceptor for logging
axios.interceptors.request.use(request => {
    console.log('Starting Request', request);
    return request;
});

// Add response interceptor for logging
axios.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Response Error:', error);
        return Promise.reject(error);
    }
);

const payosService = {
    // Create PayOS order
    createOrder: async (orderData) => {
        try {
            console.log('Creating PayOS order with data:', JSON.stringify(orderData, null, 2));

            // Format data for PayOS payment
            const formattedData = {
                user_id: orderData.user_id,
                total_amount: orderData.total_amount,
                payment_method: 'PAYOS',
                items: orderData.items,
                cart_items: orderData.cart_items,
                status: 'pending',
                recipient_name: orderData.recipient_name,
                recipient_phone: orderData.recipient_phone,
                shipping_address: orderData.shipping_address,
                shipping_city: orderData.shipping_city,
                shipping_province: orderData.shipping_province,
                shipping_postal_code: orderData.shipping_postal_code,
                notes: orderData.notes || ''
            };

            // Add authorization header
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];

            if (!token) {
                throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
            }

            // Gửi request qua backend
            const response = await axios.post(`${API_URL}/api/payments/payos/create`, formattedData, {
                timeout: 60000, // 60 giây
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-PayOS-Client-ID': PAYOS_CONFIG.clientId,
                    'X-PayOS-API-Key': PAYOS_CONFIG.apiKey
                },
                withCredentials: true // Chỉ sử dụng cho các API của backend
            });
            console.log('PayOS create order response:', response.data);
            return response.data;
        } catch (error) {
            console.error('PayOS create order error:', error);

            // Log chi tiết lỗi từ server
            if (error.response) {
                console.error('Server response error details:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            }

            throw error; // Đảm bảo lỗi được ném để component xử lý
        }
    },

    // Lấy mã QR từ PayOS
    getPaymentQRCode: async (orderCode) => {
        try {
            console.log('Getting PayOS QR code for order:', orderCode);

            // Add authorization header
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];

            // Tạo headers
            const headers = {
                'X-PayOS-Client-ID': PAYOS_CONFIG.clientId,
                'X-PayOS-API-Key': PAYOS_CONFIG.apiKey
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.get(`${API_URL}/api/payments/payos/qr/${orderCode}`, {
                headers: headers,
                timeout: 30000
            });

            console.log('PayOS QR code response:', response.data);
            return response.data;
        } catch (error) {
            console.error('PayOS QR code error:', error);

            // Nếu lỗi, thử dùng VietQR như fallback
            try {
                console.log('Attempting to use VietQR fallback...');
                const amount = 10000; // Giá trị mặc định nếu không có thông tin
                const vietQRResponse = await axios.get(`${API_URL}/api/payments/vietqr/${orderCode}?amount=${amount}`, {
                    timeout: 15000
                });
                console.log('VietQR fallback response:', vietQRResponse.data);
                return vietQRResponse.data;
            } catch (fallbackError) {
                console.error('VietQR fallback also failed:', fallbackError);
                // Tạo QR code mẫu tại client
                return {
                    status: 'pending',
                    order_code: orderCode,
                    qr_code_url: `https://img.vietqr.io/image/BIDV-21410000482645-compact2.png?amount=10000&addInfo=Thanh toan don hang ${orderCode}&accountName=NGUYEN VAN A`,
                    fallback: true,
                    error: 'Dữ liệu QR mặc định (không kết nối được tới server)'
                };
            }
        }
    },

    // Check health with PayOS
    checkHealth: async () => {
        try {
            console.log('Checking PayOS health connection');

            // Sử dụng proxy backend thay vì gọi trực tiếp đến PayOS
            const response = await axios.get(`${API_URL}/api/payments/payos/health-check`, {
                timeout: 30000,
                headers: {
                    'X-PayOS-Client-ID': PAYOS_CONFIG.clientId,
                    'X-PayOS-API-Key': PAYOS_CONFIG.apiKey
                }
            });
            console.log('PayOS health check response:', response.data);
            return response.data;
        } catch (error) {
            console.error('PayOS health check error:', error);
            return {
                status: 'error',
                message: error.message || 'Không thể kết nối tới máy chủ'
            };
        }
    },

    // Check PayOS payment status
    checkStatus: async (orderCode) => {
        try {
            console.log('Checking PayOS status for order:', orderCode);

            // Add authorization header
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];

            // Tạo headers
            const headers = {
                'X-PayOS-Client-ID': PAYOS_CONFIG.clientId,
                'X-PayOS-API-Key': PAYOS_CONFIG.apiKey
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.get(`${API_URL}/api/payments/payos/status/${orderCode}`, {
                headers: headers,
                timeout: 30000
            });

            console.log('PayOS status response:', response.data);
            return response.data;
        } catch (error) {
            console.error('PayOS status check error:', error);
            // Trả về trạng thái mặc định là "pending" thay vì ném lỗi
            return {
                status: 'pending',
                order_code: orderCode
            };
        }
    },

    // Handle PayOS callback
    handleCallback: async (callbackData) => {
        try {
            console.log('Handling PayOS callback with data:', callbackData);

            // Add authorization header
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];

            // Tạo headers
            const headers = {
                'Content-Type': 'application/json',
                'X-PayOS-Client-ID': PAYOS_CONFIG.clientId,
                'X-PayOS-API-Key': PAYOS_CONFIG.apiKey
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.post(`${API_URL}/api/payments/payos/callback`, callbackData, {
                headers: headers,
                timeout: 30000
            });

            console.log('PayOS callback response:', response.data);
            return response.data;
        } catch (error) {
            console.error('PayOS callback error:', error);
            throw error; // Ném lỗi để component xử lý
        }
    },

    // Get payment methods
    getPaymentMethods: async () => {
        try {
            console.log('Getting payment methods');

            // Add authorization header
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];

            const response = await axios.get(`${API_URL}/api/payments/payment-methods`, {
                timeout: 30000,
                headers: token ? {
                    'Authorization': `Bearer ${token}`,
                    'X-PayOS-Client-ID': PAYOS_CONFIG.clientId,
                    'X-PayOS-API-Key': PAYOS_CONFIG.apiKey
                } : {
                    'X-PayOS-Client-ID': PAYOS_CONFIG.clientId,
                    'X-PayOS-API-Key': PAYOS_CONFIG.apiKey
                }
            });
            console.log('Payment methods response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Payment methods error:', error);
            throw error; // Ném lỗi để component xử lý
        }
    }
};

export default payosService;