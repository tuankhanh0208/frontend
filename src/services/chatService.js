import api from './api';
import Cookies from 'js-cookie';
import { TOKEN_STORAGE } from './authService';

const CHATBOT_API_URL = process.env.REACT_APP_CHATBOT_API_URL || 'http://localhost:8001';

const chatApi = api.create({
  baseURL: CHATBOT_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm interceptor để gắn token vào mỗi request
chatApi.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie và thêm vào header Authorization
    const token = Cookies.get(TOKEN_STORAGE.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to chatbot API request:', config.url);
    } else {
      console.log('No token available for chatbot API request:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý các lỗi phản hồi
chatApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Ghi log chi tiết về lỗi
    console.error('Chatbot API error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

// Tạo cuộc trò chuyện mới - Sử dụng endpoint /new_session
export const createNewSession = async (userId = null) => {
  try {
    // Gọi API /new_session để tạo phiên mới
    const sessionResponse = await chatApi.post('/new_session', {});
    const session_id = sessionResponse.data.session_id;
    
    // Ghi log để debug
    console.log('Đã nhận session_id mới từ API /new_session:', session_id);
    
    // Không gửi câu chào đầu tiên nữa, trả về ngay session_id
    return { 
      session_id: session_id, 
      answer: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
      message: "Phiên chat mới đã được tạo" 
    };
  } catch (error) {
    console.error('Lỗi khi tạo phiên chat mới:', error);
    
    // Xử lý lỗi 403 Forbidden khi tạo phiên mới
    if (error.response && error.response.status === 403) {
      return { 
        session_id: null, 
        answer: "Bạn không có quyền truy cập vào chức năng này. Vui lòng đăng nhập lại hoặc liên hệ quản trị viên.",
        message: "Lỗi xác thực khi tạo phiên chat",
        authError: true
      };
    }
    
    // Fallback để tránh lỗi
    return { 
      session_id: null, 
      answer: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
      message: "Đã tạo phiên chat cục bộ" 
    };
  }
};

// Gửi câu hỏi tới chatbot
export const sendMessage = async (question, sessionId, userId = null) => {
  try {
    // Chuẩn bị payload với question và session_id
    const payload = {
      question,
      session_id: sessionId
    };
    
    // Chỉ thêm user_id vào payload nếu có giá trị
    // Không bắt buộc phải có user_id nữa
    if (userId !== null && userId !== undefined) {
      payload.user_id = userId;
    }
    
    const response = await chatApi.post('/query', payload);
    return {
      answer: response.data.answer,
      session_id: response.data.session_id || sessionId,
      recommendedProducts: response.data.recommendedProducts || [],
      processing_time: response.data.processing_time
    };
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error);
    
    // Xử lý trường hợp vượt quá giới hạn câu hỏi (mã 429)
    if (error.response && error.response.status === 429) {
      return {
        answer: "Bạn đã đạt giới hạn 30 câu hỏi cho phiên trò chuyện này. Vui lòng bắt đầu phiên mới để tiếp tục.",
        session_id: sessionId,
        limitReached: true
      };
    }
    
    // Xử lý lỗi 403 Forbidden - Không có quyền truy cập
    if (error.response && error.response.status === 403) {
      return {
        answer: "Bạn không có quyền truy cập vào chức năng này. Vui lòng đăng nhập lại hoặc liên hệ quản trị viên.",
        session_id: sessionId,
        isError: true,
        authError: true
      };
    }
    
    throw error;
  }
};

// Kiểm tra trạng thái của chatbot service
export const checkChatbotHealth = async () => {
  try {
    const response = await chatApi.get('/health');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái chatbot:', error);
    return { status: "offline" };
  }
};

// Lấy danh sách sản phẩm tương tự dựa vào câu hỏi
export const getSimilarProducts = async (question, limit = 3) => {
  try {
    const response = await chatApi.get('/similar-products', {
      params: { query: question, limit }
    });
    return response.data.products || [];
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm tương tự:', error);
    return [];
  }
};

// Lấy lịch sử trò chuyện dựa trên session_id
export const getChatHistory = async (sessionId) => {
  try {
    if (!sessionId) {
      return { messages: [], error: 'Không có session_id' };
    }
    
    const response = await chatApi.get(`/chat_history/${sessionId}`);
    return {
      messages: response.data.messages || [],
      question_count: response.data.question_count || 0,
      session_id: response.data.session_id
    };
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử trò chuyện:', error);
    if (error.response && error.response.status === 404) {
      return { messages: [], error: 'Không tìm thấy phiên chat' };
    }
    return { messages: [], error: 'Lỗi khi lấy lịch sử trò chuyện' };
  }
};

export default {
  createNewSession,
  sendMessage,
  checkChatbotHealth,
  getSimilarProducts,
  getChatHistory
};
