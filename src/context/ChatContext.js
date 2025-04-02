import React, { createContext, useState, useContext, useEffect } from 'react';
import { createNewSession, sendMessage, getSimilarProducts } from '../services/chatService';
import { useAuth } from './AuthContext';
import mockProducts from '../mock/products';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState({}); // Lưu sản phẩm tương tự theo ID tin nhắn
  const { user, isAuthenticated } = useAuth();

  // Tạo phiên chat mới khi component được mount hoặc khi user thay đổi
  useEffect(() => {
    // Luôn tạo một phiên chat mới khi component được mount
    // Nếu đã đăng nhập thì sử dụng userId, còn không thì dùng ID mặc định
    if (!sessionId || (isAuthenticated && user?.id)) {
      createNewChatSession();
    }
  }, [isAuthenticated, user]);

  // Thêm thêm một hàm mới để tạo tin nhắn chào mừng mà không cần gọi API
  const createInitialWelcomeMessage = () => {
    setIsLoading(true);
    
    // Tạo tin nhắn chào mừng mặc định
    const welcomeMessage = {
      id: Date.now(),
      text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
      isUser: false, 
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
    };
    
    // Reset messages trước khi thêm tin nhắn chào mừng
    setMessages([welcomeMessage]);
    
    // Chỉ tăng unreadCount nếu chat box đang đóng
    if (!isOpen) {
      setUnreadCount(1);
    }
    
    // Thêm sản phẩm gợi ý ngẫu nhiên cho tin nhắn chào mừng
    const randomProducts = getRandomProducts(3);
    setSimilarProducts({
      [welcomeMessage.id]: randomProducts
    });
    
    setIsLoading(false);
  };

  const createNewChatSession = async () => {
    try {
      setIsLoading(true);
      // Reset unreadCount khi tạo cuộc trò chuyện mới
      setUnreadCount(0);
      
      // Tạo tin nhắn chào mừng trước khi gọi API để đảm bảo luôn có ngay lập tức
      const tempWelcomeMessage = {
        id: Date.now(),
        text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
        isUser: false, 
        avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
      };
      
      // Reset messages trước khi thêm tin nhắn chào mừng
      setMessages([tempWelcomeMessage]);
      
      // Thêm sản phẩm gợi ý ngẫu nhiên cho tin nhắn chào mừng
      const randomProducts = getRandomProducts(3);
      setSimilarProducts({
        [tempWelcomeMessage.id]: randomProducts
      });
      
      // Luôn gọi API để tạo phiên chat mới, bất kể người dùng đã đăng nhập hay chưa
      try {
        // Nếu đã đăng nhập thì sử dụng userId, còn không thì dùng ID mặc định
        const userId = isAuthenticated && user?.id ? user.id : 1;
        const response = await createNewSession(userId);
        setSessionId(response.session_id);
        
        // Cập nhật tin nhắn chào mừng nếu API trả về
        if (response.answer) {
          const apiWelcomeMessage = {
            id: tempWelcomeMessage.id,
            text: response.answer,
            isUser: false, 
            avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
          };
          
          setMessages([apiWelcomeMessage]);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API tạo phiên chat mới:', error);
        // Nếu có lỗi khi gọi API, tạo sessionId tạm thời
        setSessionId(`guest-${Date.now()}`);
        // Vẫn giữ tin nhắn chào mừng tạm thời nếu có lỗi API
      }
      
      // Chỉ tăng unreadCount nếu chat box đang đóng
      if (!isOpen) {
        setUnreadCount(1);
      }
    } catch (error) {
      console.error('Lỗi khi tạo phiên chat mới:', error);
      // Vẫn tạo tin nhắn chào mừng mặc định khi có lỗi
      createInitialWelcomeMessage();
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy sản phẩm ngẫu nhiên từ mock data (chỉ sử dụng khi không có API)
  const getRandomProducts = (count = 3) => {
    const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Luôn hiển thị một tin nhắn chào mừng khi mở khung chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      createInitialWelcomeMessage();
    }
  }, [isOpen]);

  const handleSendMessage = async (text) => {
    if (!text.trim() && !selectedProduct) return;

    // Thêm tin nhắn của người dùng vào state
    const userMessage = {
      id: Date.now(),
      text,
      isUser: true,
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp'
    };
    
    // Nếu có sản phẩm được chọn, thêm thông tin sản phẩm vào tin nhắn
    const updatedMessages = [...messages, userMessage];
    if (selectedProduct) {
      const productMessage = {
        id: Date.now() + 1,
        product: selectedProduct,
        isUser: true,
        isProduct: true,
        avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp'
      };
      updatedMessages.push(productMessage);
      setSelectedProduct(null);
    }
    
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Gửi tin nhắn đến API
      const response = await sendMessage(text, sessionId, user?.id || 1);
      
      // Cập nhật session ID nếu có
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // Thêm phản hồi từ chatbot vào state
      const botMessage = {
        id: Date.now() + 2,
        text: response.answer,
        isUser: false,
        avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp',
        processingTime: response.processing_time
      };
      
      // Kiểm tra nếu đã đạt giới hạn số câu hỏi
      if (response.limitReached) {
        botMessage.isLimitReached = true;
        botMessage.needNewSession = true;
      }
      
      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);

      // Tăng số lượng tin nhắn chưa đọc nếu chat box đang đóng
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }

      // Log performance metrics
      if (response.processing_time) {
        console.log(`Chatbot response time: ${response.processing_time.toFixed(2)}s`);
      }

      // Lấy sản phẩm tương tự nếu chatbot đề cập đến sản phẩm
      try {
        // Chỉ lấy sản phẩm tương tự nếu không đạt giới hạn
        if (!response.limitReached) {
          // Thử sử dụng API để lấy sản phẩm tương tự
          const similarProds = await getSimilarProducts(text);
          
          // Nếu không có sản phẩm trả về từ API hoặc có lỗi, sử dụng sản phẩm ngẫu nhiên
          if (!similarProds || similarProds.length === 0) {
            // Kiểm tra nếu tin nhắn có đề cập đến sản phẩm, dinh dưỡng, thực phẩm...
            const productKeywords = ['sản phẩm', 'mua', 'giá', 'đồ ăn', 'thực phẩm', 'dinh dưỡng', 'vitamin'];
            const shouldShowProducts = productKeywords.some(keyword => 
              response.answer.toLowerCase().includes(keyword.toLowerCase()) || 
              text.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (shouldShowProducts) {
              setSimilarProducts(prev => ({
                ...prev,
                [botMessage.id]: getRandomProducts(3)
              }));
            }
          } else {
            // Nếu API trả về sản phẩm tương tự, lưu vào state
            setSimilarProducts(prev => ({
              ...prev,
              [botMessage.id]: similarProds
            }));
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm tương tự:', error);
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      
      // Thêm thông báo lỗi
      const errorMessage = {
        id: Date.now() + 2,
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        isUser: false,
        isError: true,
        avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
      };
      
      setMessages([...updatedMessages, errorMessage]);
      
      // Tăng số lượng tin nhắn chưa đọc nếu chat box đang đóng
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset số lượng tin nhắn chưa đọc khi mở chat box
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const value = {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    unreadCount,
    setUnreadCount,
    sessionId,
    setSessionId,
    isLoading,
    handleSendMessage,
    createNewChatSession,
    selectedProduct,
    setSelectedProduct,
    similarProducts
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};