import axios from 'axios';
import { API_URL, PAYOS_CONFIG } from '../config';

// Kiểm tra xem backend đã cấu hình đúng PayOS chưa
const testBackendPayOSConfig = async () => {
    try {
        console.log('Kiểm tra cấu hình PayOS trên backend:');

        // Gọi API kiểm tra cấu hình PayOS (bạn cần tạo API này trong backend)
        const response = await axios.get(`${API_URL}/api/payments/payos/config-check`, {
            timeout: 10000,
            headers: {
                'X-PayOS-Client-ID': PAYOS_CONFIG.clientId,
                'X-PayOS-API-Key': PAYOS_CONFIG.apiKey
            }
        });

        if (response.status === 200 && response.data.status === 'success') {
            console.log('✅ Backend đã cấu hình PayOS đúng');
            console.log('- Thông tin:', response.data.message);
            return true;
        } else {
            console.error('❌ Backend chưa cấu hình PayOS đúng');
            console.error('- Thông tin:', response.data);
            return false;
        }
    } catch (error) {
        console.error('❌ Lỗi khi kiểm tra cấu hình PayOS trên backend:');
        if (error.response) {
            console.error('- Mã lỗi HTTP:', error.response.status);
            console.error('- Thông tin phản hồi:', error.response.data);
        } else if (error.request) {
            console.error('- Không nhận được phản hồi từ server');
            console.error('- Backend có thể chưa khởi động');
        } else {
            console.error('- Lỗi:', error.message);
        }
        return false;
    }
};

// Tạo đơn hàng test
const createTestOrder = async () => {
    try {
        console.log('\nTạo đơn hàng test để kiểm tra tích hợp:');

        // Dữ liệu đơn hàng test
        const testOrder = {
            user_id: '1', // ID người dùng test
            total_amount: 10000, // 10.000 VND
            payment_method: 'PAYOS',
            items: [
                {
                    product_id: 'test-product',
                    quantity: 1,
                    price: 10000
                }
            ],
            status: 'pending',
            recipient_name: 'Khách hàng Test',
            recipient_phone: '0123456789',
            shipping_address: 'Địa chỉ test',
            shipping_city: 'Thành phố test',
            shipping_province: 'Tỉnh test',
            shipping_postal_code: '100000'
        };

        // Gọi API tạo đơn hàng
        const response = await axios.post(`${API_URL}/api/payments/payos/test-create`, testOrder, {
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                'X-PayOS-Client-ID': PAYOS_CONFIG.clientId,
                'X-PayOS-API-Key': PAYOS_CONFIG.apiKey
            }
        });

        if (response.status === 200 && response.data.payment_url) {
            console.log('✅ Tạo đơn hàng test thành công');
            console.log('- URL thanh toán:', response.data.payment_url);
            console.log('- Mã đơn hàng:', response.data.order_code);
            return response.data;
        } else {
            console.error('❌ Tạo đơn hàng test thất bại');
            console.error('- Thông tin phản hồi:', response.data);
            return null;
        }
    } catch (error) {
        console.error('❌ Lỗi khi tạo đơn hàng test:');
        if (error.response) {
            console.error('- Mã lỗi HTTP:', error.response.status);
            console.error('- Thông tin phản hồi:', error.response.data);

            // Hiển thị lỗi chi tiết nếu có
            if (error.response.data?.detail) {
                console.error('- Chi tiết lỗi:', error.response.data.detail);
            }
        } else if (error.request) {
            console.error('- Không nhận được phản hồi từ server');
        } else {
            console.error('- Lỗi:', error.message);
        }
        return null;
    }
};

// Export các hàm
export {
    testBackendPayOSConfig,
    createTestOrder
};

// Tự động chạy kiểm tra nếu được import trực tiếp
if (process.env.NODE_ENV === 'development') {
    console.log('=== BACKEND PAYOS TEST ===');
    testBackendPayOSConfig()
        .then(configOk => {
            if (configOk) {
                return createTestOrder();
            }
            console.log('\n⚠️ Vui lòng sửa cấu hình PayOS trên backend trước khi tiếp tục');
            return null;
        })
        .then(orderData => {
            console.log('\n=== HƯỚNG DẪN SỬA LỖI ===');
            if (!orderData) {
                console.log('1. Kiểm tra cấu hình PayOS trong backend');
                console.log('2. Đảm bảo rằng API Key và Client ID trong backend khớp với frontend');
                console.log('3. Xác nhận rằng backend đã có route api/payments/payos/create');
                console.log('4. Kiểm tra logs của backend để xem lỗi chi tiết');
            } else {
                console.log('🎉 Tích hợp PayOS hoạt động tốt!');
                console.log('- Bạn có thể mở URL thanh toán trên để kiểm tra toàn bộ luồng thanh toán');
            }
        });
} 