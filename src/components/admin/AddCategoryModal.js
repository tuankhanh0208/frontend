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
  margin-bottom: 15px;
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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
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

const AddCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  isLoading = false, 
  isEdit = false, 
  categoryData = null,
  categories = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: ''
  });
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);
  
  // Khởi tạo form data khi mở modal hoặc chuyển sang chế độ chỉnh sửa
  useEffect(() => {
    if (isOpen) {
      if (isEdit && categoryData) {
        setFormData({
          name: categoryData.name || '',
          description: categoryData.description || '',
          parent_id: categoryData.parent_id || ''
        });
      } else {
        // Reset form khi đóng modal hoặc thêm mới
        setFormData({
          name: '',
          description: '',
          parent_id: ''
        });
      }
      
      setErrors({});
      
      // Focus vào input tên
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, isEdit, categoryData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống';
    }
    
    // Kiểm tra không được chọn chính danh mục đang chỉnh sửa làm cha
    if (isEdit && categoryData && formData.parent_id && formData.parent_id === categoryData.category_id) {
      newErrors.parent_id = 'Không thể chọn chính danh mục này làm danh mục cha';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validate()) return;
    
    try {
      // Chuyển đổi parent_id từ string sang number hoặc null
      const processedData = {
        ...formData,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null
      };
      
      await onSave(processedData);
      
      // Reset form sau khi lưu thành công
      if (!isEdit) {
        setFormData({
          name: '',
          description: '',
          parent_id: ''
        });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      // Có thể xử lý lỗi trả về từ server ở đây
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        setErrors({
          ...errors,
          form: serverError.detail || 'Đã xảy ra lỗi khi lưu danh mục'
        });
      } else {
        setErrors({
          ...errors,
          form: 'Đã xảy ra lỗi khi lưu danh mục. Vui lòng thử lại sau.'
        });
      }
    }
  };
  
  // Lọc danh mục cha hợp lệ (không bao gồm danh mục đang chỉnh sửa và các danh mục con của nó)
  const getValidParentCategories = () => {
    // Đầu tiên lọc lấy các danh mục gốc (từ categoryTree đã là các danh mục gốc)
    const rootCategories = categories;
    
    // Nếu không phải là chế độ chỉnh sửa, trả về tất cả các danh mục cha
    if (!isEdit || !categoryData) {
      return rootCategories;
    }
    
    // Hàm đệ quy để tìm tất cả các danh mục con (bao gồm cả con của con)
    const findAllSubcategoryIds = (categoryId) => {
      const result = [];
      
      // Tìm category trong danh sách
      let category = null;
      
      // Tìm trong rootCategories
      for (const rootCat of rootCategories) {
        if (rootCat.category_id === categoryId) {
          category = rootCat;
          break;
        }
        // Tìm trong subcategories của từng rootCategory
        for (const subCat of (rootCat.subcategories || [])) {
          if (subCat.category_id === categoryId) {
            category = subCat;
            break;
          }
        }
        if (category) break;
      }
      
      // Nếu không tìm thấy category
      if (!category) return result;
      
      // Nếu có subcategories, thêm vào kết quả và tìm tiếp
      if (category.subcategories && category.subcategories.length > 0) {
        for (const subCat of category.subcategories) {
          result.push(subCat.category_id);
          result.push(...findAllSubcategoryIds(subCat.category_id));
        }
      }
      
      return result;
    };
    
    const allSubcategoryIds = findAllSubcategoryIds(categoryData.category_id);
    
    // Lọc ra các danh mục cha không phải là con và không phải là danh mục hiện tại
    return rootCategories.filter(category => 
      category.category_id !== categoryData.category_id && 
      !allSubcategoryIds.includes(category.category_id)
    );
  };
  
  return (
    <ModalOverlay className={isOpen ? 'active' : ''} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Đóng">
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="name">Tên danh mục</FormLabel>
              <FormInput
                ref={nameInputRef}
                type="text"
                id="name"
                name="name"
                placeholder="Nhập tên danh mục..."
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <FormError>{errors.name}</FormError>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="parent_id">Danh mục cha</FormLabel>
              <FormSelect
                id="parent_id"
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
              >
                <option value="">-- Không có danh mục cha --</option>
                {getValidParentCategories().map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </FormSelect>
              {errors.parent_id && <FormError>{errors.parent_id}</FormError>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="description">Mô tả</FormLabel>
              <FormTextarea
                id="description"
                name="description"
                placeholder="Nhập mô tả danh mục (không bắt buộc)..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <FormError>{errors.description}</FormError>}
            </FormGroup>
            
            {errors.form && <FormError>{errors.form}</FormError>}
          </form>
        </ModalBody>
        
        <ModalFooter>
          <SaveButton 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Lưu')}
          </SaveButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddCategoryModal; 