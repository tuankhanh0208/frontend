import React from 'react';
import styled from 'styled-components';
import { FaComments } from 'react-icons/fa';
import { useChat } from '../../../context/ChatContext';

const Button = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #0dcaf0;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 999;

  &:hover {
    transform: scale(1.1);
    background: #0bb5d8;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const ChatButton = () => {
  const { setIsOpen, unreadCount } = useChat();

  return (
    <Button onClick={() => setIsOpen(true)}>
      <FaComments />
      {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
    </Button>
  );
};

export default ChatButton;