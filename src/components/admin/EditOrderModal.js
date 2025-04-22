import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

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
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #111827;
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

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  grid-column: ${props => props.fullWidth ? '1 / span 2' : 'auto'};
  
  @media (max-width: 640px) {
    grid-column: 1;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background-color: white;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  grid-column: 1 / span 2;
  
  @media (max-width: 640px) {
    grid-column: 1;
  }
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

const CancelButton = styled(Button)`
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const SaveButton = styled(Button)`
  background: #4f46e5;
  border: 1px solid #4f46e5;
  color: white;
  
  &:hover {
    background: #4338ca;
    border-color: #4338ca;
  }
`;

const EditOrderModal = ({ isOpen, onClose, onSave, order }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    customer_name: '',
    phone_number: '',
    email: '',
    address: '',
    total_amount: 0,
    shipping_method: 'Tiêu chuẩn',
    is_prepaid: false
  });
  
  useEffect(() => {
    if (order) {
      setFormData({
        product_name: order.product_name || '',
        customer_name: order.customer_name || '',
        phone_number: order.phone_number || '',
        email: order.email || '',
        address: order.address || '',
        total_amount: order.total_amount || 0,
        shipping_method: order.shipping_method || 'Tiêu chuẩn',
        is_prepaid: order.is_prepaid || false
      });
    }
  }, [order]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'total_amount' ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...order, ...formData });
  };
  
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
              <Title>Cập nhật đơn hàng</Title>
              <CloseButton onClick={onClose}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="product_name">Tên sản phẩm</Label>
                <Input
                  type="text"
                  id="product_name"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="customer_name">Khách hàng</Label>
                <Input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone_number">SĐT</Label>
                <Input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup fullWidth>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="total_amount">Tổng tiền</Label>
                <Input
                  type="number"
                  id="total_amount"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="shipping_method">Shipping</Label>
                <Select
                  id="shipping_method"
                  name="shipping_method"
                  value={formData.shipping_method}
                  onChange={handleChange}
                >
                  <option value="Tiêu chuẩn">Tiêu chuẩn</option>
                  <option value="Nhanh">Nhanh</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="is_prepaid">Trả trước</Label>
                <Select
                  id="is_prepaid"
                  name="is_prepaid"
                  value={formData.is_prepaid}
                  onChange={handleChange}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </Select>
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton type="button" onClick={onClose}>
                  Hủy
                </CancelButton>
                <SaveButton type="submit">
                  Lưu thay đổi
                </SaveButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default EditOrderModal; 