import React from 'react';
import styled from 'styled-components';
import { useChat } from '../../../context/ChatContext';

const Container = styled.div`
  padding: 10px 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  background-color: #f8f9fa;
`;

const Title = styled.h4`
  font-size: 14px;
  color: #495057;
  margin: 0 0 10px 0;
`;

const ProductsList = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #0dcaf0;
  }
`;

const ProductCard = styled.div`
  min-width: 120px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #0dcaf0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ProductName = styled.h5`
  margin: 0 0 5px 0;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.p`
  margin: 0;
  font-size: 11px;
  font-weight: bold;
  color: #0dcaf0;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: #0dcaf0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px;
  margin-top: 5px;
  font-size: 11px;
  cursor: pointer;
  
  &:hover {
    background: #0bb5d8;
  }
`;

const SimilarProducts = ({ products, messageId }) => {
  const { setSelectedProduct } = useChat();
  
  if (!products || products.length === 0) return null;
  
  const handleSelectProduct = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      // Nếu là sự kiện từ hệ thống (không phải do người dùng tạo ra)
      if (!e.isTrusted) return;
    }
    setSelectedProduct(product);
  };

  const handleContainerClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  const handleImageClick = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Chỉ xử lý khi người dùng thực sự click
    if (e && e.isTrusted) {
      handleSelectProduct(e, product);
    }
  };
  
  return (
    <Container onClick={handleContainerClick}>
      <Title>Sản phẩm gợi ý cho bạn:</Title>
      <ProductsList onClick={handleContainerClick}>
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            onClick={(e) => handleSelectProduct(e, product)}
          >
            <ProductImage 
              src={product.image || 'https://via.placeholder.com/150?text=Không+có+hình'} 
              alt={product.name}
              onClick={(e) => handleImageClick(e, product)}
              onLoad={(e) => e.stopPropagation()}
            />
            <ProductName onClick={handleContainerClick}>{product.name}</ProductName>
            <ProductPrice onClick={handleContainerClick}>
              {product.price?.toLocaleString('vi-VN', { 
                style: 'currency', 
                currency: 'VND' 
              }) || 'Liên hệ'}
            </ProductPrice>
            <AddToCartButton onClick={(e) => handleSelectProduct(e, product)}>
              Chọn sản phẩm
            </AddToCartButton>
          </ProductCard>
        ))}
      </ProductsList>
    </Container>
  );
};

export default SimilarProducts; 