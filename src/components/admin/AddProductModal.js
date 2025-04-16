import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import Button from '../common/Button/Button';

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
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 600px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
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
  font-size: 1.4rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #000;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
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
  gap: 10px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormColumn = styled.div`
  flex: 1;
`;

const ImageUploadContainer = styled.div`
  margin-bottom: 20px;
`;

const ImageUploadLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const UploadButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  input {
    display: none;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  
  input {
    margin-right: 8px;
  }
  
  label {
    font-size: 0.9rem;
    color: #555;
  }
`;

const DescriptionContainer = styled.div`
  margin-bottom: 20px;
`;

const FinancialContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
`;

const FinancialRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InventoryInput = styled.div`
  margin-bottom: 20px;
`;

const AddProductModal = ({ isOpen, onClose, onSave, isLoading = false }) => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    size: 'Medium',
    discount: '0.00',
    productionCost: '0.00',
    profit: '0.00',
    description: '',
    inventory: 0,
    featured: false,
    image: null
  });
  
  const [errors, setErrors] = useState({});
  
  if (!isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProduct({
        ...product,
        image: e.target.files[0]
      });
      
      if (errors.image) {
        setErrors({
          ...errors,
          image: null
        });
      }
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!product.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }
    
    if (!product.category.trim()) {
      newErrors.category = 'Danh mục là bắt buộc';
    }
    
    if (!product.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      await onSave(product);
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };
  
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Sản phẩm</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <ImageUploadContainer>
              <ImageUploadLabel>Ảnh</ImageUploadLabel>
              <UploadButton as="label">
                Upload an Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </UploadButton>
            </ImageUploadContainer>
            
            <FormRow>
              <FormColumn>
                <FormGroup>
                  <FormLabel>Tên</FormLabel>
                  <FormInput
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Tên sản phẩm"
                  />
                </FormGroup>
              </FormColumn>
              
              <FormColumn>
                <FormGroup>
                  <FormLabel>Category</FormLabel>
                  <FormSelect
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="1">Danh mục 1</option>
                    <option value="2">Danh mục 2</option>
                    <option value="3">Danh mục 3</option>
                  </FormSelect>
                </FormGroup>
              </FormColumn>
            </FormRow>
            
            <FormGroup>
              <FormLabel>Size</FormLabel>
              <FormSelect
                name="size"
                value={product.size}
                onChange={handleChange}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </FormSelect>
            </FormGroup>
            
            <FinancialContainer>
              <FinancialRow>
                <FormGroup>
                  <FormLabel>Giảm giá</FormLabel>
                  <FormInput
                    type="number"
                    name="discount"
                    value={product.discount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Chi phí sản xuất</FormLabel>
                  <FormInput
                    type="number"
                    name="productionCost"
                    value={product.productionCost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </FormGroup>
              </FinancialRow>
              
              <FormGroup>
                <FormLabel>Lợi nhuận</FormLabel>
                <FormInput
                  type="number"
                  name="profit"
                  value={product.profit}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </FormGroup>
            </FinancialContainer>
            
            <DescriptionContainer>
              <FormLabel>Mô tả</FormLabel>
              <FormTextarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Mô tả sản phẩm ..."
              />
            </DescriptionContainer>
            
            <CheckboxContainer>
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={product.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured">
                Nổi bật
              </label>
              <p>Sản phẩm này sẽ xuất hiện trên trang chủ.</p>
            </CheckboxContainer>
            
            <InventoryInput>
              <FormLabel>Có sẵn trong kho</FormLabel>
              <FormInput
                type="number"
                name="inventory"
                value={product.inventory}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </InventoryInput>
          </form>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            Lưu sản phẩm
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddProductModal;