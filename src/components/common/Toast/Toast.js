import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContainer = styled(motion.div)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
`;

const ToastItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  max-width: 400px;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: white;
  
  &.success {
    border-left: 4px solid #10b981;
    .icon {
      color: #10b981;
    }
  }
  
  &.error {
    border-left: 4px solid #ef4444;
    .icon {
      color: #ef4444;
    }
  }
  
  &.info {
    border-left: 4px solid #3b82f6;
    .icon {
      color: #3b82f6;
    }
  }
`;

const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  color: #111827;
`;

const Message = styled.p`
  margin: 0;
  font-size: 12px;
  color: #6b7280;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  
  &:hover {
    color: #4b5563;
  }
`;

const Toast = ({ toasts, removeToast }) => {
  return (
    <ToastContainer>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            className={toast.type}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <ToastContent>
              <IconContainer className="icon">
                {toast.type === 'success' && <FaCheckCircle />}
                {toast.type === 'error' && <FaExclamationCircle />}
                {toast.type === 'info' && <FaInfoCircle />}
              </IconContainer>
              <TextContainer>
                <Title>{toast.title}</Title>
                {toast.message && <Message>{toast.message}</Message>}
              </TextContainer>
            </ToastContent>
            <CloseButton onClick={() => removeToast(toast.id)}>
              <FaTimes />
            </CloseButton>
          </ToastItem>
        ))}
      </AnimatePresence>
    </ToastContainer>
  );
};

export default Toast; 