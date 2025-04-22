import React from 'react';
import styled from 'styled-components';

const ProductRow = styled.tr`
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const ProductCell = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProductDetails = styled.div`
  margin-left: 15px;
`;

const ProductName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ProductVariant = styled.div`
  font-size: 14px;
  color: #666;
`;

const ProductPrice = styled.div`
  font-weight: 500;
`;

const ProductQuantity = styled.div`
  font-weight: 500;
`;

const ProductTotal = styled.div`
  font-weight: 600;
  color: #4CAF50;
`;

const OrderProductItem = ({ item }) => {
  return (
    <ProductRow>
      <ProductCell>
        <ProductInfo>
          <ProductImage src={item.product.image} alt={item.product.name} />
          <ProductDetails>
            <ProductName>{item.product.name}</ProductName>
            {item.variant && <ProductVariant>{item.variant}</ProductVariant>}
          </ProductDetails>
        </ProductInfo>
      </ProductCell>
      <ProductCell>
        <ProductPrice>{Math.round(item.price).toLocaleString()}đ/{item.product.unit || 'kg'}</ProductPrice>
      </ProductCell>
      <ProductCell>
        <ProductQuantity>{item.quantity}</ProductQuantity>
      </ProductCell>
      <ProductCell>
        <ProductTotal>{Math.round(item.price * item.quantity).toLocaleString()}đ</ProductTotal>
      </ProductCell>
    </ProductRow>
  );
};

export default OrderProductItem;