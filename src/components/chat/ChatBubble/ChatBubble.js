import React from 'react';
import styled from 'styled-components';
import { useChat } from '../../../context/ChatContext';

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: ${props => props.isUser ? '0 0 0 10px' : '0 10px 0 0'};
`;

const Message = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: ${props => {
    if (props.isError) return 'rgba(220, 53, 69, 0.1)';
    return props.isUser ? '#e9ecef' : 'rgba(57, 192, 237, 0.2)';
  }};
  color: ${props => props.isError ? '#dc3545' : '#333'};
`;

const NewSessionButton = styled.button`
  display: block;
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ProcessingTime = styled.div`
  font-size: 11px;
  color: #6c757d;
  margin-top: 5px;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const ChatBubble = ({ message, isUser, avatar, isError, needNewSession, processingTime }) => {
  const { createNewChatSession } = useChat();
  
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
    createNewChatSession();
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
      <div>
        <Message 
          isUser={isUser} 
          isError={isError} 
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
      </div>
    </MessageContainer>
  );
};

export default ChatBubble;