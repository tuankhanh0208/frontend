// src/pages/admin/CategoryList.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import AddCategoryModal from '../../components/admin/AddCategoryModal';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const THead = styled.thead`
  background-color: #f5f5f5;
`;

const Th = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  color: #666;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.color || '#666'};
  font-size: 16px;
  margin-right: 10px;
  
  &:hover {
    color: ${props => props.hoverColor || '#333'};
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageInfo = styled.span`
  color: #666;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#2196F3' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#2196F3' : '#f5f5f5'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Mock data - sẽ được thay thế bằng dữ liệu thực từ API
const mockCategories = [
  { id: 1, name: 'Thịt', count: 24, created_at: '04/18/2025' },
  { id: 2, name: 'Cá', count: 112, created_at: '02/15/2025' },
  { id: 3, name: 'Hải sản', count: 84, created_at: '09/21/2024' },
  { id: 4, name: 'Rau', count: 0, created_at: '06/02/2024' },
];

const CategoryList = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Trong thực tế, sẽ fetch dữ liệu từ API
  useEffect(() => {
    // fetchCategories()
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(
    category => category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async (categoryData) => {
    setIsLoading(true);
    try {
      // Thực tế sẽ gọi API
      // await categoryService.addCategory(categoryData);
      
      // Mock thêm category mới
      const newCategory = {
        id: categories.length + 1,
        name: categoryData.name,
        count: 0,
        created_at: new Date().toLocaleDateString('en-US')
      };
      
      setCategories([...categories, newCategory]);
      toast.success('Đã thêm danh mục thành công!');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Không thể thêm danh mục. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      // Thực tế sẽ gọi API
      // await categoryService.deleteCategory(id);
      
      // Mock xóa category
      setCategories(categories.filter(category => category.id !== id));
      toast.success('Đã xóa danh mục thành công!');
    }
  };

  return (
    <Container>
      <Header>
        <Title>Quản lý danh mục</Title>
        <Button 
          variant="primary" 
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<FaPlus />}
        >
          Thêm danh mục
        </Button>
      </Header>
      
      <ActionBar>
        <SearchContainer>
          <SearchInput 
            type="text" 
            placeholder="Tìm kiếm danh mục..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>
        
        <FiltersContainer>
          {/* Các bộ lọc khác nếu cần */}
        </FiltersContainer>
      </ActionBar>
      
      <Table>
        <THead>
          <tr>
            <Th>Tên sản phẩm</Th>
            <Th>Số lượng</Th>
            <Th>Ngày thêm vào</Th>
            <Th>Thao tác</Th>
          </tr>
        </THead>
        <tbody>
          {filteredCategories.map(category => (
            <tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>{category.count}</Td>
              <Td>{category.created_at}</Td>
              <Td>
                <ActionButton color="#2196F3" hoverColor="#1976D2">
                  <FaEdit />
                </ActionButton>
                <ActionButton 
                  color="#F44336" 
                  hoverColor="#D32F2F"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <FaTrash />
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Pagination>
        <PageButton disabled>&lt;&lt;</PageButton>
        <PageButton disabled>&lt;</PageButton>
        <PageButton active>1</PageButton>
        <PageButton disabled>&gt;</PageButton>
        <PageButton disabled>&gt;&gt;</PageButton>
        <PageInfo>Trang 1 trên 1</PageInfo>
      </Pagination>
      
      <AddCategoryModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCategory}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default CategoryList;