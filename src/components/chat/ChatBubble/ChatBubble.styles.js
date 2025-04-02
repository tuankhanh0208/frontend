import styled from 'styled-components';

export const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 3px;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
  align-items: flex-start;
  gap: 0;
`;

export const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: 0;
`;

export const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
`;

export const Message = styled.div`
  max-width: 90%;
  padding: 5px 8px;
  border-radius: 15px;
  background-color: ${props => {
    if (props['data-is-error']) return 'rgba(220, 53, 69, 0.1)';
    return props.isUser ? '#e9ecef' : 'rgba(57, 192, 237, 0.2)';
  }};
  color: ${props => props['data-is-error'] ? '#dc3545' : '#333'};
  font-size: 13px;
`;

export const NewSessionButton = styled.button`
  display: block;
  margin-top: 8px;
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0056b3;
  }
`;

export const ProcessingTime = styled.div`
  font-size: 10px;
  color: #6c757d;
  margin-top: 2px;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;
