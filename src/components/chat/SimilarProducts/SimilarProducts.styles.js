import styled from 'styled-components';

export const Container = styled.div`
  padding: 8px 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #f8f9fa;
  /* Đảm bảo container luôn hiển thị */
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative;
  z-index: 10;
  
  /* Thêm hiệu ứng xuất hiện */
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0.7;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const Title = styled.h4`
  font-size: 13px;
  color: #495057;
  margin: 0 0 8px 0;
`;

export const ProductsList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 5px;
  
  &::-webkit-scrollbar {
    height: 3px;
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

export const ProductCard = styled.div`
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

export const ProductImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
`;

export const ProductName = styled.h5`
  margin: 0 0 5px 0;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProductPrice = styled.p`
  margin: 0;
  font-size: 11px;
  font-weight: bold;
  color: #0dcaf0;
`;

export const AddToCartButton = styled.button`
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