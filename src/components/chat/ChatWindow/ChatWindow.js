import React from 'react';
import styled from 'styled-components';
import { useChat } from '../../../context/ChatContext';
import ChatHeader from '../ChatHeader/ChatHeader';
import ChatBubble from '../ChatBubble/ChatBubble';
import ChatInput from '../ChatInput/ChatInput';

const Container = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 350px;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  background: white;
  overflow: hidden;
  opacity: ${props => props.isOpen ? 1 : 0};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.3s ease-in-out;
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const MessagesContainer = styled.div`
  height: 400px;
  padding: 15px;
  overflow-y: auto;
`;

const ChatWindow = () => {
  const { isOpen, setIsOpen, messages, setMessages } = useChat();

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      isUser: true,
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp'
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <Container isOpen={isOpen}>
      <ChatHeader onClose={() => setIsOpen(false)} />
      <MessagesContainer>
        {messages.map(msg => (
          <ChatBubble
            key={msg.id}
            message={msg.text}
            isUser={msg.isUser}
            avatar={msg.avatar}
          />
        ))}
      </MessagesContainer>
      <ChatInput onSend={handleSendMessage} />
    </Container>
  );
};

export default ChatWindow;