import styled from 'styled-components';

export const Container = styled.div`
  height: 450px;
  padding: 8px 12px;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

export const LoadingContainer = styled.div`
  display: flex;
  padding: 4px 0;
`;

export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

export const TypingAvatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 8px;
`;

export const TypingDots = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(57, 192, 237, 0.2);
  padding: 10px 14px;
  border-radius: 15px;
`;

export const Dot = styled.div`
  width: 7px;
  height: 7px;
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
      transform: translateY(-7px);
    }
  }
`;

export const EmptyStateMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #6c757d;
  font-size: 14px;
  text-align: center;
  padding: 20px;
`; 