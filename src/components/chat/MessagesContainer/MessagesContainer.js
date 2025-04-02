import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
import ChatBubble from '../ChatBubble/ChatBubble';
import ProductBubble from '../ProductBubble/ProductBubble';
import SimilarProducts from '../SimilarProducts/SimilarProducts';

const Container = styled.div`
  height: 450px;
  padding: 15px;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

const LoadingContainer = styled.div`
  display: flex;
  padding: 10px 0;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const TypingAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const TypingDots = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(57, 192, 237, 0.2);
  padding: 12px 16px;
  border-radius: 15px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #555;
  border-radius: 50%;
  margin: 0 2px;
  opacity: 0.6;
  animation: typing 1.5s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-8px);
    }
  }
`;

const EmptyStateMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #6c757d;
  font-size: 14px;
  text-align: center;
  padding: 20px;
`;

const MessagesContainer = ({ messages, isLoading, similarProducts }) => {
  const messagesEndRef = useRef();
  const containerRef = useRef();
  
  // Cuộn đến tin nhắn cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  // Thêm event listener cho tất cả sự kiện chuột
  useEffect(() => {
    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    const container = containerRef.current;
    if (container) {
      // Bắt tất cả sự kiện có thể gây ra đóng cửa sổ
      container.addEventListener('click', stopPropagation, true);
      container.addEventListener('mousedown', stopPropagation, true);
      container.addEventListener('mouseup', stopPropagation, true);
      container.addEventListener('touchstart', stopPropagation, true);
      container.addEventListener('touchend', stopPropagation, true);
      container.addEventListener('pointerdown', stopPropagation, true);
      container.addEventListener('pointerup', stopPropagation, true);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', stopPropagation, true);
        container.removeEventListener('mousedown', stopPropagation, true);
        container.removeEventListener('mouseup', stopPropagation, true);
        container.removeEventListener('touchstart', stopPropagation, true);
        container.removeEventListener('touchend', stopPropagation, true);
        container.removeEventListener('pointerdown', stopPropagation, true);
        container.removeEventListener('pointerup', stopPropagation, true);
      }
    };
  }, []);
  
  const handleContainerClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan toả lên
    e.preventDefault(); // Ngăn hành vi mặc định
  };
  
  const handleAllEvents = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  };
  
  return (
    <Container 
      onClick={handleContainerClick}
      onMouseDown={handleAllEvents}
      onMouseUp={handleAllEvents}
      onTouchStart={handleAllEvents}
      onTouchEnd={handleAllEvents}
      onPointerDown={handleAllEvents}
      onPointerUp={handleAllEvents}
      ref={containerRef}
    >
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {msg.isProduct ? (
              <ProductBubble
                product={msg.product}
                isUser={msg.isUser}
                avatar={msg.avatar}
              />
            ) : (
              <ChatBubble
                message={msg.text}
                isUser={msg.isUser}
                avatar={msg.avatar}
                isError={msg.isError}
                needNewSession={msg.needNewSession}
                processingTime={msg.processingTime}
              />
            )}
            
            {/* Hiển thị sản phẩm tương tự sau mỗi tin nhắn bot nếu có */}
            {!msg.isUser && similarProducts && similarProducts[msg.id] && (
              <SimilarProducts 
                products={similarProducts[msg.id]} 
                messageId={msg.id}
              />
            )}
          </React.Fragment>
        ))
      ) : (
        <EmptyStateMessage>
          Chào mừng bạn đến với dịch vụ hỗ trợ trực tuyến của chúng tôi. Tin nhắn sẽ hiển thị ở đây.
        </EmptyStateMessage>
      )}
      
      {isLoading && (
        <TypingIndicator onClick={handleAllEvents}>
          <TypingAvatar 
            src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
            alt="Bot Avatar" 
            onClick={handleAllEvents}
          />
          <TypingDots onClick={handleAllEvents}>
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </TypingDots>
        </TypingIndicator>
      )}
      
      <div ref={messagesEndRef} />
    </Container>
  );
};

export default MessagesContainer; 