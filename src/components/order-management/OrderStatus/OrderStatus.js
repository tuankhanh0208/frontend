import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  margin-bottom: 20px;
`;

const StatusTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 10px;
  color: #666;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  ${props => {
    if (props.status === 'completed') {
      return `
        background-color: rgba(76, 175, 80, 0.1);
        color: #4CAF50;
      `;
    } else if (props.status === 'processing') {
      return `
        background-color: rgba(33, 150, 243, 0.1);
        color: #2196F3;
      `;
    } else if (props.status === 'cancelled') {
      return `
        background-color: rgba(244, 67, 54, 0.1);
        color: #F44336;
      `;
    } else if (props.status === 'shipped') {
      return `
        background-color: rgba(0, 188, 212, 0.1);
        color: #00BCD4;
      `;
    } else if (props.status === 'delivered') {
      return `
        background-color: rgba(156, 39, 176, 0.1);
        color: #9C27B0;
      `;
    } else {
      return `
        background-color: rgba(255, 152, 0, 0.1);
        color: #FF9800;
      `;
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const StatusTracker = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  position: relative;
  max-width: 600px;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #eee;
    transform: translateY(-50%);
    z-index: 1;
  }
`;

const StatusStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
`;

const StatusDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4CAF50' : '#eee'};
  margin-bottom: 8px;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.completed && `
    background-color: #4CAF50;
    
    &::after {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      width: 8px;
      height: 8px;
      background-color: white;
      border-radius: 50%;
    }
  `}
`;

const StatusLabel = styled.span`
  font-size: 12px;
  color: ${props => props.active ? '#4CAF50' : '#999'};
  text-align: center;
  max-width: 80px;
`;

const OrderStatus = ({ status, showTracker = false }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };
  
  const getStatusIndex = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'completed'];
    return statuses.indexOf(status);
  };
  
  const currentIndex = getStatusIndex(status);
  
  return (
    <StatusContainer>
      <StatusTitle>Trạng thái đơn hàng</StatusTitle>
      <StatusBadge status={status.toLowerCase()}>
        {getStatusText(status)}
      </StatusBadge>
      
      {showTracker && status !== 'cancelled' && (
        <StatusTracker>
          {['pending', 'processing', 'shipped', 'delivered', 'completed'].map((step, index) => (
            <StatusStep key={step}>
              <StatusDot 
                active={currentIndex === index} 
                completed={currentIndex > index}
              />
              <StatusLabel active={currentIndex >= index}>
                {getStatusText(step)}
              </StatusLabel>
            </StatusStep>
          ))}
        </StatusTracker>
      )}
    </StatusContainer>
  );
};

export default OrderStatus;