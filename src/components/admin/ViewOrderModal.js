import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaBox, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTruck, FaCreditCard } from 'react-icons/fa';

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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #111827;
`;

const OrderId = styled.span`
  font-size: 14px;
  color: #6b7280;
  margin-left: 8px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
    color: #111827;
  }
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 12px;
  color: #111827;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #f3f4f6;
  color: #4f46e5;
  margin-right: 12px;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin-right: 8px;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #111827;
`;

const ProductInfo = styled.div`
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const ProductName = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
`;

const ProductPrice = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #4f46e5;
  margin-top: 8px;
`;

const ShippingBadge = styled.span`
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  
  &.standard {
    background-color: #e2e8f0;
    color: #475569;
  }
  
  &.fast {
    background-color: #dcfce7;
    color: #166534;
  }
`;

const PaymentBadge = styled.span`
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  
  &.paid {
    background-color: #dcfce7;
    color: #166534;
  }
  
  &.unpaid {
    background-color: #fef2f2;
    color: #b91c1c;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
  }
`;

const CloseModalButton = styled(Button)`
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ViewOrderModal = ({ isOpen, onClose, order }) => {
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
              <Title>
                Chi tiết đơn hàng
                <OrderId>#{order.id}</OrderId>
              </Title>
              <CloseButton onClick={onClose}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ProductInfo>
              <ProductName>{order.product_name}</ProductName>
              <ProductPrice>{order.total_amount?.toLocaleString('vi-VN')} đ</ProductPrice>
            </ProductInfo>
            
            <SectionTitle>Thông tin khách hàng</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <IconWrapper>
                  <FaUser />
                </IconWrapper>
                <div>
                  <InfoLabel>Tên:</InfoLabel>
                  <InfoValue>{order.customer_name}</InfoValue>
                </div>
              </InfoItem>
              
              <InfoItem>
                <IconWrapper>
                  <FaPhone />
                </IconWrapper>
                <div>
                  <InfoLabel>SĐT:</InfoLabel>
                  <InfoValue>{order.phone_number}</InfoValue>
                </div>
              </InfoItem>
              
              <InfoItem>
                <IconWrapper>
                  <FaEnvelope />
                </IconWrapper>
                <div>
                  <InfoLabel>Email:</InfoLabel>
                  <InfoValue>{order.email}</InfoValue>
                </div>
              </InfoItem>
              
              <InfoItem>
                <IconWrapper>
                  <FaMapMarkerAlt />
                </IconWrapper>
                <div>
                  <InfoLabel>Địa chỉ:</InfoLabel>
                  <InfoValue>{order.address}</InfoValue>
                </div>
              </InfoItem>
            </InfoGrid>
            
            <SectionTitle>Thông tin đơn hàng</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <IconWrapper>
                  <FaBox />
                </IconWrapper>
                <div>
                  <InfoLabel>Sản phẩm:</InfoLabel>
                  <InfoValue>{order.product_name}</InfoValue>
                </div>
              </InfoItem>
              
              <InfoItem>
                <IconWrapper>
                  <FaTruck />
                </IconWrapper>
                <div>
                  <InfoLabel>Shipping:</InfoLabel>
                  <ShippingBadge className={order.shipping_method === 'Nhanh' ? 'fast' : 'standard'}>
                    {order.shipping_method}
                  </ShippingBadge>
                </div>
              </InfoItem>
              
              <InfoItem>
                <IconWrapper>
                  <FaCreditCard />
                </IconWrapper>
                <div>
                  <InfoLabel>Trả trước:</InfoLabel>
                  <PaymentBadge className={order.is_prepaid ? 'paid' : 'unpaid'}>
                    {order.is_prepaid ? 'Yes' : 'No'}
                  </PaymentBadge>
                </div>
              </InfoItem>
              
              <InfoItem>
                <IconWrapper>
                  <FaBox />
                </IconWrapper>
                <div>
                  <InfoLabel>Ngày đặt:</InfoLabel>
                  <InfoValue>{formatDate(order.created_at)}</InfoValue>
                </div>
              </InfoItem>
            </InfoGrid>
            
            <ButtonGroup>
              <CloseModalButton onClick={onClose}>
                Đóng
              </CloseModalButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ViewOrderModal; 