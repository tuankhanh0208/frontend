import React, { createContext, useState, useContext, useEffect } from 'react';
import { createNewSession, sendMessage, getSimilarProducts, getChatHistory } from '../services/chatService';
import { useAuth } from './AuthContext';
import mockProducts from '../mock/products';

// Constants
const SESSION_ID_KEY = 'chat_session_id';
const MAX_MESSAGES_PER_SESSION = 30;
const MESSAGE_COUNT_KEY = 'chat_message_count';
const IS_NEW_CHAT_KEY = 'chat_is_new_session';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState({}); // Lưu sản phẩm tương tự theo ID tin nhắn
  const [isNewChat, setIsNewChat] = useState(true); // Đánh dấu phiên chat là mới hay không
  const { user, isAuthenticated } = useAuth();

  // Load session_id và message_count từ localStorage khi khởi động
  useEffect(() => {
    const savedSessionId = localStorage.getItem(SESSION_ID_KEY);
    const savedMessageCount = parseInt(localStorage.getItem(MESSAGE_COUNT_KEY) || '0', 10);
    const savedIsNewChat = localStorage.getItem(IS_NEW_CHAT_KEY) === 'true';
    
    if (savedSessionId) {
      console.log('Khôi phục session_id từ localStorage:', savedSessionId);
      setSessionId(savedSessionId);
      setIsNewChat(savedIsNewChat);
      
      // Nếu đã có tin nhắn, không cần tải lại lịch sử
      if (messages.length === 0) {
        // Luôn gọi API để lấy lịch sử trò chuyện nếu có session_id
        loadChatHistory(savedSessionId);
      }
    } else {
      // Chỉ tạo phiên chat mới khi KHÔNG có session_id trong localStorage
      // VÀ là lần đầu tiên mở ứng dụng (không phải refresh)
      console.log('Không tìm thấy session_id trong localStorage, cần tạo mới trong lần mở chat đầu tiên');
      // QUAN TRỌNG: KHÔNG tạo session mới ở đây, chỉ tạo khi người dùng mở chat
      // createNewChatSession(true); - LOẠI BỎ DÒNG NÀY
    }
    
    if (savedMessageCount) {
      setMessageCount(savedMessageCount);
    }
  }, []);

  // Lưu session_id và message_count vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (sessionId) {
      console.log('Lưu session_id vào localStorage:', sessionId);
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    
    localStorage.setItem(MESSAGE_COUNT_KEY, messageCount.toString());
    localStorage.setItem(IS_NEW_CHAT_KEY, isNewChat.toString());
  }, [sessionId, messageCount, isNewChat]);

  // Hàm tải lịch sử trò chuyện từ backend
  const loadChatHistory = async (chatSessionId) => {
    try {
      setIsLoading(true);
      const historyData = await getChatHistory(chatSessionId);
      
      if (historyData.error) {
        console.error('Lỗi khi tải lịch sử trò chuyện:', historyData.error);
        // QUAN TRỌNG: KHÔNG tạo session mới khi có lỗi, chỉ xóa loading
        setIsLoading(false);
        return;
      }
      
      if (historyData.messages && historyData.messages.length > 0) {
        // Đảo ngược mảng tin nhắn để tin nhắn cũ nhất ở dưới cùng
        const reversedMessages = [...historyData.messages].reverse();
        
        // Chuyển đổi tin nhắn từ API thành định dạng hiển thị
        const formattedMessages = reversedMessages.flatMap((msg, index) => {
          const messages = [];
          
          // Thêm tin nhắn của người dùng
          const userMsgId = Date.now() + index * 2;
          messages.push({
            id: userMsgId,
            text: msg.question,
            isUser: true,
            avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp'
          });
          
          // Thêm tin nhắn của bot
          const botMsgId = Date.now() + index * 2 + 1;
          messages.push({
            id: botMsgId,
            text: msg.answer,
            isUser: false,
            avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp',
            // Đánh dấu tin nhắn chào đầu tiên (bây giờ là tin nhắn cuối sau khi đảo ngược)
            isFirstMessage: index === reversedMessages.length - 1
          });
          
          return messages;
        });
        
        // Cập nhật messages và messageCount
        setMessages(formattedMessages);
        setMessageCount(historyData.question_count || formattedMessages.length / 2);
        // Đánh dấu không phải phiên mới vì đã có lịch sử
        setIsNewChat(false);
        localStorage.setItem(IS_NEW_CHAT_KEY, 'false');
      } else {
        // Nếu không có tin nhắn từ API nhưng vẫn có session_id hợp lệ
        // Hiển thị tin nhắn chào mừng mà KHÔNG tạo session mới
        console.log('Session hợp lệ nhưng không có lịch sử trò chuyện, hiển thị tin nhắn chào mừng');
        createInitialWelcomeMessage();
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch sử trò chuyện:', error);
      // QUAN TRỌNG: KHÔNG tạo session mới khi có lỗi, chỉ hiển thị chào mừng
      createInitialWelcomeMessage();
    } finally {
      setIsLoading(false);
    }
  };

  // Tạo phiên chat mới khi component được mount hoặc khi user thay đổi
  useEffect(() => {
    // Chỉ thực hiện kiểm tra khi user thay đổi
    if (isAuthenticated && user?.id) {
      // Chỉ kiểm tra xem session hiện tại có thuộc về user này không
      // Không tự động tạo session mới
      console.log('User thay đổi, nếu muốn chat mới hãy nhấn nút tạo phiên mới');
    }
  }, [isAuthenticated, user]);

  // Hàm tạo tin nhắn chào mừng mà không cần gọi API
  const createInitialWelcomeMessage = () => {
    setIsLoading(true);
    
    // Tạo tin nhắn chào mừng mặc định
    const welcomeMessage = {
      id: Date.now(),
      text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
      isUser: false, 
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp',
      isFirstMessage: true // Đánh dấu là tin nhắn đầu tiên
    };
    
    // Reset messages trước khi thêm tin nhắn chào mừng
    setMessages([welcomeMessage]);
    
    // Chỉ tăng unreadCount nếu chat box đang đóng
    if (!isOpen) {
      setUnreadCount(1);
    }
    
    // Chỉ thêm sản phẩm gợi ý cho tin nhắn chào mừng nếu là phiên chat mới
    if (isNewChat) {
      const randomProducts = getRandomProducts(3);
      setSimilarProducts({
        [welcomeMessage.id]: randomProducts
      });
    } else {
      // Không thêm sản phẩm nếu không phải phiên chat mới
      setSimilarProducts({});
    }
    
    setIsLoading(false);
  };

  const createNewChatSession = async (shouldCallApi = true) => {
    try {
      setIsLoading(true);
      
      // Reset unreadCount và messageCount khi tạo cuộc trò chuyện mới
      setUnreadCount(0);
      setMessageCount(0);
      setIsNewChat(true); // Đánh dấu là phiên chat mới
      localStorage.setItem(MESSAGE_COUNT_KEY, '0');
      localStorage.setItem(IS_NEW_CHAT_KEY, 'true');
      
      // Tạo tin nhắn chào mừng mặc định
      const tempWelcomeMessage = {
        id: Date.now(),
        text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
        isUser: false, 
        avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp',
        isFirstMessage: true // Đánh dấu là tin nhắn đầu tiên
      };
      
      // Reset messages trước khi thêm tin nhắn chào mừng
      setMessages([tempWelcomeMessage]);
      
      // Thêm sản phẩm gợi ý ngẫu nhiên cho tin nhắn chào mừng vì là phiên chat mới
      const randomProducts = getRandomProducts(3);
      setSimilarProducts({
        [tempWelcomeMessage.id]: randomProducts
      });
      
      // Tạo session mới từ API
      if (shouldCallApi) {
        try {
          // Nếu đã đăng nhập thì sử dụng userId, còn không thì để mặc định
          const userId = isAuthenticated && user?.id ? user.id : null;
          console.log('Gọi API tạo phiên mới với userId:', userId);
          const response = await createNewSession(userId);
          
          // Kiểm tra nếu có lỗi xác thực (403 Forbidden)
          if (response.authError) {
            console.log('Lỗi xác thực (403 Forbidden) khi tạo phiên chat mới');
            
            // Nếu người dùng đã đăng nhập, hiển thị thông báo lỗi khác
            if (isAuthenticated && user) {
              const authErrorMessage = {
                id: tempWelcomeMessage.id,
                text: "Đã xảy ra lỗi khi kết nối đến dịch vụ chat. Vui lòng thử lại sau.",
                isUser: false,
                isError: true,
                avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp',
                isFirstMessage: true
              };
              
              setMessages([authErrorMessage]);
            } else {
              // Nếu chưa đăng nhập, hiển thị thông báo đăng nhập
              const authErrorMessage = {
                id: tempWelcomeMessage.id,
                text: response.answer || "Bạn không có quyền truy cập vào chức năng này. Vui lòng đăng nhập lại hoặc liên hệ quản trị viên.",
                isUser: false,
                isError: true,
                isAuthError: true,
                avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp',
                isFirstMessage: true
              };
              
              setMessages([authErrorMessage]);
            }
            return;
          }
          
          if (response.session_id) {
            console.log('Nhận session_id mới từ API:', response.session_id);
            // Lưu session_id mới vào state và localStorage
            // QUAN TRỌNG: Đảm bảo session_id được lưu vào localStorage ngay khi nhận được
            localStorage.setItem(SESSION_ID_KEY, response.session_id);
            setSessionId(response.session_id);
          } else {
            console.log('API không trả về session_id, lỗi kết nối');
            console.error('Chi tiết phản hồi từ API:', response);
          }
        } catch (error) {
          console.error('Lỗi khi gọi API tạo phiên chat mới:', error);
          // QUAN TRỌNG: Không tạo session_id tạm thời nữa, chỉ giữ trạng thái hiện tại
        }
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

  // Hiển thị một tin nhắn chào mừng khi mở khung chat và chưa có tin nhắn nào
  useEffect(() => {
    if (isOpen) {
      // Nếu chat được mở
      if (messages.length === 0) {
        // Và không có tin nhắn nào
        if (!isLoading) {
          // Và không đang tải
          const savedSessionId = localStorage.getItem(SESSION_ID_KEY);
          
          if (savedSessionId) {
            // Nếu có session_id trong localStorage và chưa được set vào state
            if (!sessionId) {
              console.log('Phát hiện session_id trong localStorage khi mở chat:', savedSessionId);
              setSessionId(savedSessionId);
              loadChatHistory(savedSessionId);
            }
          } else {
            // Nếu không có session_id trong localStorage và trong state, TẠO MỚI
            console.log('Không có session_id, tạo phiên mới khi mở chat lần đầu');
            createNewChatSession(true);
          }
        }
      }
    }
  }, [isOpen, messages.length, isLoading]);

  const handleSendMessage = async (text) => {
    if (!text.trim() && !selectedProduct) return;

    // Đảm bảo không vượt quá giới hạn tin nhắn
    if (messageCount >= MAX_MESSAGES_PER_SESSION) {
      // Hiển thị thông báo và gợi ý tạo phiên mới
      const limitMessage = {
        id: Date.now(),
        text: "Bạn đã đạt giới hạn 30 câu hỏi cho phiên trò chuyện này. Vui lòng bắt đầu phiên mới để tiếp tục.",
        isUser: false,
        isError: true,
        needNewSession: true,
        avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
      };
      setMessages([...messages, limitMessage]);
      return;
    }

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
      // Đây không còn là phiên chat mới nữa vì người dùng đã gửi tin nhắn
      setIsNewChat(false);
      localStorage.setItem(IS_NEW_CHAT_KEY, 'false');
      
      // Đảm bảo có session_id trước khi gửi tin nhắn
      let currentSessionId = sessionId;
      
      if (!currentSessionId) {
        console.log('Không có session_id, cần tạo phiên chat mới từ API');
        try {
          // Tạo phiên mới từ API
          const userId = isAuthenticated && user?.id ? user.id : null;
          const response = await createNewSession(userId);
          
          if (response.session_id) {
            currentSessionId = response.session_id;
            setSessionId(currentSessionId);
            localStorage.setItem(SESSION_ID_KEY, currentSessionId);
            console.log('Đã tạo session_id mới từ API:', currentSessionId);
          } else {
            console.error('Không thể tạo session_id mới từ API');
            throw new Error('Không thể tạo session_id mới');
          }
        } catch (error) {
          console.error('Lỗi khi tạo session_id mới:', error);
          
          // Hiển thị thông báo lỗi
          const errorMessage = {
            id: Date.now() + 2,
            text: "Xin lỗi, đã xảy ra lỗi khi kết nối đến dịch vụ chat. Vui lòng thử lại sau.",
            isUser: false,
            isError: true,
            avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
          };
          
          setMessages([...updatedMessages, errorMessage]);
          setIsLoading(false);
          return;
        }
      }

      console.log('Gửi tin nhắn với session_id:', currentSessionId);
      
      // Tăng số lượng tin nhắn đã gửi
      const newMessageCount = messageCount + 1;
      setMessageCount(newMessageCount);
      localStorage.setItem(MESSAGE_COUNT_KEY, newMessageCount.toString());

      // Gửi tin nhắn đến API với session_id hiện tại
      const response = await sendMessage(text, currentSessionId, user?.id || null);
      
      // Kiểm tra nếu có lỗi xác thực (403 Forbidden)
      if (response.authError) {
        console.log('Lỗi xác thực (403 Forbidden) khi gửi tin nhắn');
        // Nếu người dùng đã đăng nhập, hiển thị thông báo lỗi khác
        if (isAuthenticated && user) {
          const authErrorMessage = {
            id: Date.now() + 2,
            text: "Đã xảy ra lỗi khi kết nối đến dịch vụ chat. Vui lòng thử lại sau.",
            isUser: false,
            isError: true,
            avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
          };
          setMessages([...updatedMessages, authErrorMessage]);
        } else {
          // Nếu chưa đăng nhập, hiển thị thông báo đăng nhập
          const authErrorMessage = {
            id: Date.now() + 2,
            text: response.answer || "Bạn không có quyền truy cập vào chức năng này. Vui lòng đăng nhập lại hoặc liên hệ quản trị viên.",
            isUser: false,
            isError: true,
            isAuthError: true,
            avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
          };
          setMessages([...updatedMessages, authErrorMessage]);
        }
        return;
      }
      
      // Kiểm tra và xử lý session_id từ server
      if (response.session_id) {
        // Chỉ cập nhật session_id nếu khác với session_id hiện tại
        if (response.session_id !== currentSessionId) {
          console.log('Cập nhật session_id mới từ server:', response.session_id);
          setSessionId(response.session_id);
          localStorage.setItem(SESSION_ID_KEY, response.session_id);
          // Reset message count khi nhận session_id mới từ server
          setMessageCount(1);
          localStorage.setItem(MESSAGE_COUNT_KEY, '1');
        }
      } else {
        console.log('Server không trả về session_id, giữ session_id hiện tại:', currentSessionId);
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
      if (response.limitReached || newMessageCount >= MAX_MESSAGES_PER_SESSION) {
        console.log('Đã đạt giới hạn tin nhắn, hiển thị thông báo');
        botMessage.isLimitReached = true;
        botMessage.needNewSession = true;
      }
      
      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);

      // Tăng số lượng tin nhắn chưa đọc nếu chat box đang đóng
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }

      // Xử lý sản phẩm gợi ý cho tin nhắn bot - chỉ thêm nếu có từ server
      if (response.recommendedProducts && response.recommendedProducts.length > 0) {
        console.log('Nhận sản phẩm gợi ý từ server:', response.recommendedProducts.length);
        setSimilarProducts(prev => ({
          ...prev,
          [botMessage.id]: response.recommendedProducts
        }));
      }
      // Không thêm sản phẩm gợi ý ngẫu nhiên nếu không có từ server

      // Log performance metrics
      if (response.processing_time) {
        console.log(`Chatbot response time: ${response.processing_time.toFixed(2)}s`);
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      
      // Xử lý lỗi và hiển thị thông báo lỗi
      const errorMessage = {
        id: Date.now() + 2,
        text: "Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.",
        isUser: false,
        isError: true,
        avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
      };
      
      setMessages([...updatedMessages, errorMessage]);
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
    similarProducts,
    isNewChat
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