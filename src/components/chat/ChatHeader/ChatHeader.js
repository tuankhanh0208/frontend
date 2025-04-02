import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaAngleLeft, FaPlus } from 'react-icons/fa';

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

const IconsWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  font-size: 16px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ChatHeader = ({ onClose, onNewChat }) => {
  const handleButtonClick = (e, callback) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn sự kiện lan toả lên
    callback();
  };

  return (
    <Header onClick={(e) => e.stopPropagation()}>
      <IconButton onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
        <FaAngleLeft />
      </IconButton>
      <Title onClick={(e) => e.stopPropagation()}>Trò chuyện</Title>
      <IconsWrapper onClick={(e) => e.stopPropagation()}>
        <IconButton 
          onClick={(e) => handleButtonClick(e, onNewChat)} 
          title="Bắt đầu cuộc trò chuyện mới"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <FaPlus />
        </IconButton>
        <IconButton 
          onClick={(e) => handleButtonClick(e, onClose)} 
          title="Đóng hộp thoại"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <FaTimes />
        </IconButton>
      </IconsWrapper>
    </Header>
  );
};

export default ChatHeader;