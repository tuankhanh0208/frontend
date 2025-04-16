import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  &.active {
    opacity: 1;
    visibility: visible;
  }
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 95%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transform: translateY(-20px);
  transition: transform 0.3s ease;
  overflow: hidden;
  
  ${ModalOverlay}.active & {
    transform: translateY(0);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  
  &:hover {
    color: #000;
  }
`;

const ModalBody = styled.div`
  padding: 20px 20px 15px;
`;

const FormGroup = styled.div`
  margin-bottom: 0;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const FormError = styled.div`
  color: #F44336;
  font-size: 0.875rem;
  margin-top: 5px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #eee;
`;

const SaveButton = styled.button`
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #1976D2;
  }
  
  &:disabled {
    background-color: #90CAF9;
    cursor: not-allowed;
  }
`;

const AddCategoryModal = ({ isOpen, onClose, onSave, isLoading = false }) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Đặt focus vào input khi modal mở
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Reset form khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setCategoryName('');
      setError('');
    }
  }, [isOpen]);
  
  const handleChange = (e) => {
    setCategoryName(e.target.value);
    if (error) setError('');
  };
  
  const validate = () => {
    if (!categoryName.trim()) {
      setError('Tên danh mục không được để trống');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await onSave({ name: categoryName });
      setCategoryName('');
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Đã xảy ra lỗi khi lưu danh mục. Vui lòng thử lại sau.');
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <ModalOverlay className={isOpen ? 'active' : ''} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Thêm loại sản phẩm mới</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Đóng">
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormInput
                ref={inputRef}
                type="text"
                placeholder="Tên..."
                value={categoryName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              {error && <FormError>{error}</FormError>}
            </FormGroup>
          </form>
        </ModalBody>
        
        <ModalFooter>
          <SaveButton 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu'}
          </SaveButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddCategoryModal; 