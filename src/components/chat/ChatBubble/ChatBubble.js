import React from 'react';
import styled from 'styled-components';

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
  background-color: ${props => props.isUser ? '#e9ecef' : 'rgba(57, 192, 237, 0.2)'};
  color: ${props => props.isUser ? '#333' : '#333'};
`;

const ChatBubble = ({ message, isUser, avatar }) => {
  return (
    <MessageContainer isUser={isUser}>
      <Avatar src={avatar} isUser={isUser} />
      <Message isUser={isUser}>
        {message}
      </Message>
    </MessageContainer>
  );
};

export default ChatBubble;