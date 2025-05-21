import axios from 'axios';
import { PAYOS_CONFIG, API_URL } from '../config';

// Hàm kiểm tra kết nối PayOS API
const testPayOSConnection = async () => {
    try {
        console.log('Kiểm tra thông tin cấu hình PayOS:');
        console.log('- Client ID:', PAYOS_CONFIG.clientId);
        console.log('- API Key:', PAYOS_CONFIG.apiKey ? '✓ Đã cấu hình' : '✗ Chưa cấu hình');
        console.log('- URL Callback:', PAYOS_CONFIG.callbackUrl);
        console.log('- API URL:', PAYOS_CONFIG.apiUrl);

        // Sử dụng API proxy từ backend thay vì gọi trực tiếp
        const response = await axios.get(`${API_URL}/api/payments/payos/config-check`, {
            headers: {
                'x-client-id': PAYOS_CONFIG.clientId,
                'x-api-key': PAYOS_CONFIG.apiKey
            },
            timeout: 10000
        });

        if (response.status === 200) {
            console.log('✅ Kết nối thành công đến API PayOS');
            console.log('Thông tin phản hồi:', response.data);
            return true;
        } else {
            console.error('❌ Kết nối thất bại với mã lỗi:', response.status);
            console.error('Thông tin lỗi:', response.data);
            return false;
        }
    } catch (error) {
        console.error('❌ Lỗi khi kiểm tra kết nối PayOS:');
        if (error.response) {
            console.error('- Mã lỗi HTTP:', error.response.status);
            console.error('- Thông tin phản hồi:', error.response.data);
        } else if (error.request) {
            console.error('- Không nhận được phản hồi từ server');
        } else {
            console.error('- Lỗi:', error.message);
        }
        return false;
    }
};

// Hàm kiểm tra endpoint của backend
const testBackendEndpoint = async () => {
    try {
        console.log('\nKiểm tra endpoint backend:');

        // Kiểm tra endpoint health check (nên tạo route này trong backend)
        const response = await axios.get(`${API_URL}/api/health-check`, {
            timeout: 5000
        });

        if (response.status === 200) {
            console.log('✅ Kết nối thành công đến backend');
            return true;
        } else {
            console.error('❌ Kết nối thất bại với mã lỗi:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Lỗi khi kết nối đến backend:');
        if (error.response) {
            console.error('- Mã lỗi HTTP:', error.response.status);
        } else if (error.request) {
            console.error('- Không nhận được phản hồi từ server');
            console.error('- Backend có thể chưa khởi động hoặc không chạy ở cổng 8000');
        } else {
            console.error('- Lỗi:', error.message);
        }
        return false;
    }
};

// Export các hàm để sử dụng trong development
export {
    testPayOSConnection,
    testBackendEndpoint
};

// Tự động chạy test khi file được import trực tiếp
if (process.env.NODE_ENV === 'development') {
    console.log('=== PAYOS TEST UTILITY ===');
    testPayOSConnection()
        .then(() => testBackendEndpoint())
        .then(() => {
            console.log('\n=== KẾT QUẢ KIỂM TRA ===');
            console.log('1. Kiểm tra các thông tin cấu hình trong file config.js');
            console.log('2. Đảm bảo backend đã cấu hình đúng thông tin PayOS');
            console.log('3. Kiểm tra API Key và Client ID trên casso.vn');
        });
} 