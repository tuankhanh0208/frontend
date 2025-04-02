import api from './api';

const CHATBOT_API_URL = process.env.REACT_APP_CHATBOT_API_URL || 'http://localhost:8001';

const chatApi = api.create({
  baseURL: CHATBOT_API_URL,
});

// Tạo cuộc trò chuyện mới - Sử dụng endpoint /new_session
export const createNewSession = async (userId = 1) => {
  try {
    // Gọi API /new_session để tạo phiên mới
    const sessionResponse = await chatApi.post('/new_session', {});
    const session_id = sessionResponse.data.session_id;
    
    // Gửi câu chào đầu tiên để bắt đầu cuộc trò chuyện
    const response = await chatApi.post('/query', {
      question: "Xin chào",
      session_id: session_id,
      user_id: userId
    });
    
    return { 
      session_id: session_id, 
      answer: response.data.answer,
      message: "Phiên chat mới đã được tạo" 
    };
  } catch (error) {
    console.error('Lỗi khi tạo phiên chat mới:', error);
    // Fallback để tránh lỗi
    return { 
      session_id: null, 
      answer: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
      message: "Đã tạo phiên chat cục bộ" 
    };
  }
};

// Gửi câu hỏi tới chatbot
export const sendMessage = async (question, sessionId, userId = 1) => {
  try {
    const response = await chatApi.post('/query', {
      question,
      session_id: sessionId,
      user_id: userId
    });
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

export default {
  createNewSession,
  sendMessage,
  checkChatbotHealth,
  getSimilarProducts
};
