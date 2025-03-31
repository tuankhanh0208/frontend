import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEye, FaFileDownload, FaTruck } from 'react-icons/fa';
import Button from '../../common/Button/Button';

const OrderItemContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
`;

const OrderNumber = styled.div`
  font-weight: 600;
  color: #333;
`;

const OrderDate = styled.div`
  color: #666;
  font-size: 14px;
`;

const OrderContent = styled.div`
  padding: 20px;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const OrderProducts = styled.div`
  display: flex;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
`;

const ProductCount = styled.div`
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  margin-left: 10px;
`;

const OrderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const OrderTotal = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
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
    } else {
      return `
        background-color: rgba(255, 152, 0, 0.1);
        color: #FF9800;
      `;
    }
  }}
`;

const OrderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const OrderItem = ({ order }) => {
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
  
  return (
    <OrderItemContainer>
      <OrderHeader>
        <OrderNumber>Đơn hàng #{order.orderNumber}</OrderNumber>
        <OrderDate>{new Date(order.createdAt).toLocaleDateString()}</OrderDate>
      </OrderHeader>
      
      <OrderContent>
        <OrderInfo>
          <OrderProducts>
            {order.items && order.items.length > 0 && (
              <>
                <ProductImage src={order.items[0].product.image} alt={order.items[0].product.name} />
                {order.items.length > 1 && (
                  <ProductCount>+{order.items.length - 1} sản phẩm khác</ProductCount>
                )}
              </>
            )}
          </OrderProducts>
          
          <OrderMeta>
            <StatusBadge status={order.status.toLowerCase()}>
              {getStatusText(order.status)}
            </StatusBadge>
            <OrderTotal>{order.total}đ</OrderTotal>
          </OrderMeta>
        </OrderInfo>
        
        <OrderActions>
          <Button
            as={Link}
            to={`/orders/${order.id}`}
            variant="outline"
            size="small"
          >
            <FaEye /> Xem chi tiết
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => {/* Track order logic */}}
          >
            <FaTruck /> Theo dõi
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => {/* Download invoice logic */}}
          >
            <FaFileDownload /> Hóa đơn
          </Button>
        </OrderActions>
      </OrderContent>
    </OrderItemContainer>
  );
};

export default OrderItem;