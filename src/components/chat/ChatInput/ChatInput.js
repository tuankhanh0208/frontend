import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';

const InputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
`;

const Form = styled.form`
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

const SendButton = styled.button`
  background: #0dcaf0;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #0bb5d8;
  }
`;

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <InputContainer>
      <Form onSubmit={handleSubmit}>
        <TextArea
          rows="3"
          placeholder="Nhập tin nhắn của bạn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <SendButton type="submit">
          <FaPaperPlane />
        </SendButton>
      </Form>
    </InputContainer>
  );
};

export default ChatInput;