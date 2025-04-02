import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: ${props => props.isUser ? '0 0 0 10px' : '0 10px 0 0'};
`;

const ProductCard = styled.div`
  max-width: 80%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${props => props.isUser ? '#e9ecef' : 'rgba(57, 192, 237, 0.2)'};
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 8px;
`;

const ProductName = styled.h5`
  margin: 0 0 5px 0;
  font-size: 14px;
`;

const ProductPrice = styled.p`
  margin: 0 0 5px 0;
  font-size: 13px;
  font-weight: bold;
  color: #0dcaf0;
`;

const ProductDescription = styled.p`
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductLink = styled(Link)`
  display: block;
  text-align: right;
  font-size: 12px;
  color: #0dcaf0;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProductBubble = ({ product, isUser, avatar }) => {
  if (!product) return null;
  
  const {
    id,
    name,
    price,
    image,
    description
  } = product;
  
  const handleClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Ngăn sự kiện lan toả lên
    }
  };

  const handleLinkClick = (e) => {
    // Cho phép Link hoạt động nhưng ngăn lan toả
    if (e) e.stopPropagation();
  };

  const handleImageClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  const handleImageLoad = (e) => {
    if (e) e.stopPropagation();
  };
  
  return (
    <MessageContainer isUser={isUser} onClick={handleClick}>
      <Avatar 
        src={avatar} 
        isUser={isUser} 
        onClick={handleClick}
        onLoad={handleImageLoad} 
      />
      <ProductCard isUser={isUser} onClick={handleClick}>
        <ProductImage 
          src={image || 'https://via.placeholder.com/200x150?text=Không+có+hình'} 
          alt={name} 
          onClick={handleImageClick}
          onLoad={handleImageLoad}
        />
        <ProductName onClick={handleClick}>{name}</ProductName>
        <ProductPrice onClick={handleClick}>
          {price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 ₫'}
        </ProductPrice>
        <ProductDescription onClick={handleClick}>{description || 'Không có mô tả'}</ProductDescription>
        <ProductLink to={`/products/${id}`} onClick={handleLinkClick}>
          Xem chi tiết
        </ProductLink>
      </ProductCard>
    </MessageContainer>
  );
};

export default ProductBubble; 