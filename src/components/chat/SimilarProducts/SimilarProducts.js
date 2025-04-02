import React, { useEffect, useRef } from 'react';
import { useChat } from '../../../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  ProductsList,
  ProductCard,
  ProductImage,
  ProductName,
  ProductPrice,
  AddToCartButton
} from './SimilarProducts.styles';

const SimilarProducts = ({ products, messageId }) => {
  const { setSelectedProduct, isNewChat } = useChat();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Đảm bảo products luôn hiển thị ngay khi component được mount
  useEffect(() => {
    if (products && products.length > 0 && containerRef.current) {
      // Đảm bảo container hiển thị
      containerRef.current.style.display = 'block';
      containerRef.current.style.visibility = 'visible';
      containerRef.current.style.opacity = '1';
      
      // Đảm bảo sản phẩm được hiển thị đúng cách
      const productElements = containerRef.current.querySelectorAll('[data-product-id]');
      productElements.forEach(element => {
        element.style.display = 'block';
      });
    }
  }, [products, messageId]);
  
  // Kiểm tra nếu không có sản phẩm nào, không hiển thị component
  if (!products || products.length === 0) return null;
  
  const handleSelectProduct = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      // Chỉ xử lý khi người dùng thật sự click
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
  
  const handleNavigateToProduct = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Chỉ xử lý khi người dùng thực sự click
    if (e && e.isTrusted) {
      navigate(`/product/${product.id}`);
    }
  };
  
  return (
    <Container 
      ref={containerRef}
      onClick={handleContainerClick} 
      id={`similar-products-${messageId}`}
    >
      <Title>
        {isNewChat 
          ? "Sản phẩm gợi ý cho bạn:" 
          : "Các sản phẩm có thể bạn quan tâm:"}
      </Title>
      <ProductsList onClick={handleContainerClick}>
        {products.map(product => (
          <ProductCard 
            key={product.id}
            data-product-id={product.id}
            onClick={(e) => handleNavigateToProduct(e, product)}
          >
            <ProductImage 
              src={product.image || 'https://via.placeholder.com/150?text=Không+có+hình'} 
              alt={product.name}
              onClick={(e) => handleNavigateToProduct(e, product)}
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