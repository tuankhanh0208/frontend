import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const WarningIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fef2f2;
  color: #dc2626;
  margin-right: 16px;
  
  svg {
    font-size: 18px;
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #111827;
`;

const Message = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  padding-left: 56px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
  }
`;

const CancelButton = styled(Button)`
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const DeleteButton = styled(Button)`
  background: #ef4444;
  border: 1px solid #ef4444;
  color: white;
  
  &:hover {
    background: #dc2626;
    border-color: #dc2626;
  }
`;

const OrderDetails = styled.div`
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  padding-left: 56px;
`;

const OrderDetail = styled.div`
  display: flex;
  font-size: 14px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
  min-width: 120px;
  color: #4b5563;
`;

const DetailValue = styled.span`
  color: #111827;
`;

const DeleteOrderModal = ({ isOpen, onClose, onConfirm, order }) => {
  if (!order) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <WarningIcon>
                <FaExclamationTriangle />
              </WarningIcon>
              <Title>Xác nhận xóa đơn hàng</Title>
            </ModalHeader>
            
            <Message>
              Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.
            </Message>
            
            <OrderDetails>
              <OrderDetail>
                <DetailLabel>Khách hàng:</DetailLabel>
                <DetailValue>{order.customer_name}</DetailValue>
              </OrderDetail>
              <OrderDetail>
                <DetailLabel>Sản phẩm:</DetailLabel>
                <DetailValue>{order.product_name}</DetailValue>
              </OrderDetail>
              <OrderDetail>
                <DetailLabel>Tổng tiền:</DetailLabel>
                <DetailValue>{order.total_amount?.toLocaleString('vi-VN')} đ</DetailValue>
              </OrderDetail>
            </OrderDetails>
            
            <ButtonGroup>
              <CancelButton onClick={onClose}>
                Hủy
              </CancelButton>
              <DeleteButton onClick={() => onConfirm(order.id)}>
                Xác nhận xóa
              </DeleteButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default DeleteOrderModal; 