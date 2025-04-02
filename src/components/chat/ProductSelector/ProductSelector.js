import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, InputBase } from '@mui/material';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useChat } from '../../../context/ChatContext';
import mockProducts from '../../../mock/products';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
`;

const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
`;

const ProductCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #0dcaf0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.selected && `
    border-color: #0dcaf0;
    background-color: rgba(13, 202, 240, 0.05);
  `}
`;

const ProductImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 5px;
`;

const ProductName = styled.h5`
  margin: 0 0 5px 0;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: bold;
  color: #0dcaf0;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 20px;
  color: #6c757d;
`;

const ProductSelector = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { setSelectedProduct } = useChat();
  
  // Lấy danh sách sản phẩm từ mock data (sau này có thể thay bằng API)
  useEffect(() => {
    setFilteredProducts(mockProducts);
  }, []);
  
  // Lọc sản phẩm theo từ khóa tìm kiếm
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredProducts(mockProducts);
    } else {
      const searchTerms = search.toLowerCase().split(' ');
      const filtered = mockProducts.filter(product => {
        const nameMatch = searchTerms.every(term => 
          product.name.toLowerCase().includes(term)
        );
        return nameMatch;
      });
      setFilteredProducts(filtered);
    }
  }, [search]);
  
  // Lắng nghe sự kiện mở ProductSelector
  useEffect(() => {
    const handleOpenSelector = () => {
      setOpen(true);
    };
    
    window.addEventListener('openProductSelector', handleOpenSelector);
    
    return () => {
      window.removeEventListener('openProductSelector', handleOpenSelector);
    };
  }, []);
  
  const handleClose = () => {
    setOpen(false);
    setSelectedProductId(null);
    setSearch('');
  };
  
  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
  };
  
  const handleConfirm = () => {
    if (selectedProductId) {
      const product = mockProducts.find(p => p.id === selectedProductId);
      setSelectedProduct(product);
    }
    handleClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Chọn sản phẩm để đính kèm
        <IconButton
          aria-label="đóng"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <FaTimes />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <SearchContainer>
          <FaSearch style={{ color: '#6c757d', marginRight: '8px' }} />
          <InputBase
            placeholder="Tìm kiếm sản phẩm..."
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchContainer>
        
        {filteredProducts.length > 0 ? (
          <ProductsContainer>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id}
                selected={selectedProductId === product.id}
                onClick={() => handleSelectProduct(product.id)}
              >
                <ProductImage 
                  src={product.image || 'https://via.placeholder.com/200x150?text=Không+có+hình'} 
                  alt={product.name} 
                />
                <ProductName>{product.name}</ProductName>
                <ProductPrice>
                  {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </ProductPrice>
              </ProductCard>
            ))}
          </ProductsContainer>
        ) : (
          <NoResults>
            Không tìm thấy sản phẩm phù hợp
          </NoResults>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="primary" 
          variant="contained"
          disabled={!selectedProductId}
        >
          Đính kèm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSelector; 