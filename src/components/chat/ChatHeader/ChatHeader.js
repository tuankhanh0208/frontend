import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaAngleLeft } from 'react-icons/fa';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #0dcaf0;
  color: white;
`;

const Title = styled.p`
  margin: 0;
  font-weight: 600;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ChatHeader = ({ onClose }) => {
  return (
    <Header>
      <IconButton>
        <FaAngleLeft />
      </IconButton>
      <Title>Live Chat</Title>
      <IconButton onClick={onClose}>
        <FaTimes />
      </IconButton>
    </Header>
  );
};

export default ChatHeader;