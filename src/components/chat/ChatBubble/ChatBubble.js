import React from 'react';
import { useChat } from '../../../context/ChatContext';
import { useAuth } from '../../../context/AuthContext';
import { MessageContainer, Avatar, Message, NewSessionButton, ProcessingTime, MessageWrapper } from './ChatBubble.styles';

const ChatBubble = ({ message, isUser, avatar, isError, isAuthError, needNewSession, processingTime }) => {
  const { createNewChatSession } = useChat();
  const { logout } = useAuth();
  
  const handleClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Ngăn sự kiện lan toả lên
    }
  };

  const handleImageLoad = (e) => {
    if (e) e.stopPropagation();
  };

  const handleAvatarClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  const handleNewSessionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Xóa session_id khỏi localStorage
    localStorage.removeItem('chat_session_id');
    createNewChatSession();
  };
  
  const handleLoginAgainClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Đăng xuất người dùng hiện tại và chuyển hướng đến trang đăng nhập
    logout();
    window.location.href = '/login';
  };

  return (
    <MessageContainer isUser={isUser} onClick={handleClick} onMouseDown={handleClick}>
      <Avatar 
        src={avatar} 
        isUser={isUser} 
        onClick={handleAvatarClick} 
        onLoad={handleImageLoad}
        onMouseDown={handleClick}
      />
      <MessageWrapper>
        <Message 
          isUser={isUser} 
          data-is-error={isError} 
          onClick={handleClick}
          onMouseDown={handleClick}
        >
          {message}
        </Message>
        
        {processingTime && !isUser && (
          <ProcessingTime isUser={isUser}>
            Phản hồi trong {processingTime.toFixed(2)}s
          </ProcessingTime>
        )}
        
        {needNewSession && !isUser && (
          <NewSessionButton 
            onClick={handleNewSessionClick}
            onMouseDown={handleClick}
          >
            Bắt đầu phiên mới
          </NewSessionButton>
        )}
        
        {isAuthError && !isUser && (
          <NewSessionButton 
            onClick={handleLoginAgainClick}
            onMouseDown={handleClick}
            style={{ backgroundColor: '#dc3545' }}
          >
            Đăng nhập lại
          </NewSessionButton>
        )}
      </MessageWrapper>
    </MessageContainer>
  );
};

export default ChatBubble;