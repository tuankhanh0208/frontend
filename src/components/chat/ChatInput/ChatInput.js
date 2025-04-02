import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';
import { useChat } from '../../../context/ChatContext';

const InputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  outline: none;
  
  &:focus {
    border-color: #0dcaf0;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? '#0dcaf0' : '#f8f9fa'};
  color: ${props => props.primary ? 'white' : '#0dcaf0'};
  border: ${props => props.primary ? 'none' : '1px solid #0dcaf0'};
  border-radius: 8px;
  padding: 0 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  
  &:hover {
    background: ${props => props.primary ? '#0bb5d8' : '#e9ecef'};
  }
`;

const SelectedProductContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const ProductImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  object-fit: cover;
`;

const ProductName = styled.span`
  font-size: 12px;
  flex: 1;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: #dc3545;
  }
`;

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const { selectedProduct, setSelectedProduct } = useChat();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (message.trim() || selectedProduct) {
      onSend(message);
      setMessage('');
    }
  };

  const handleOpenProductSelector = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const event = new CustomEvent('openProductSelector');
    window.dispatchEvent(event);
  };

  const handleRemoveProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(null);
  };

  const handleTextAreaClick = (e) => {
    e.stopPropagation();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };
  
  return (
    <InputContainer onClick={(e) => e.stopPropagation()}>
      <Form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        {selectedProduct && (
          <SelectedProductContainer onClick={(e) => e.stopPropagation()}>
            <ProductImage 
              src={selectedProduct.image || 'https://via.placeholder.com/30?text=Không+có+hình'} 
              alt={selectedProduct.name} 
              onClick={(e) => e.stopPropagation()}
            />
            <ProductName onClick={(e) => e.stopPropagation()}>{selectedProduct.name}</ProductName>
            <RemoveButton onClick={handleRemoveProduct} type="button">
              ✕
            </RemoveButton>
          </SelectedProductContainer>
        )}
        
        <InputWrapper onClick={(e) => e.stopPropagation()}>
          <TextArea
            rows="3"
            placeholder="Nhập tin nhắn của bạn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onClick={handleTextAreaClick}
            onKeyPress={handleKeyPress}
            onMouseDown={(e) => e.stopPropagation()}
          />
          
          <ButtonsWrapper onClick={(e) => e.stopPropagation()}>
            <ActionButton 
              type="button" 
              onClick={handleOpenProductSelector}
              title="Đính kèm sản phẩm"
            >
              <FaPaperclip />
            </ActionButton>
            <ActionButton type="submit" primary title="Gửi" onClick={(e) => e.stopPropagation()}>
              <FaPaperPlane />
            </ActionButton>
          </ButtonsWrapper>
        </InputWrapper>
      </Form>
    </InputContainer>
  );
};

export default ChatInput;