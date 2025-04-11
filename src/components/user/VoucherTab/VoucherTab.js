import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTicketAlt, FaPlus, FaHistory, FaInfo } from 'react-icons/fa';

const Container = styled.div`
  padding: 0;
`;

const CardHeader = styled.div`
  background: #f5f5f5;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 10px;
      color: #4CAF50;
    }
  }
`;

const CardBody = styled.div`
  padding: 20px;
`;

// Voucher related components
const VoucherContainer = styled.div`
  padding: 0 0 20px 0;
`;

const VoucherHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const VoucherActions = styled.div`
  display: flex;
  gap: 15px;
`;

const ActionLink = styled.a`
  color: #ee4d2d;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const VoucherInputGroup = styled.div`
  display: flex;
  margin-bottom: 20px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
`;

const VoucherLabel = styled.div`
  width: 150px;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const VoucherInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  
  &:focus {
    outline: none;
    border-color: #ee4d2d;
  }
`;

const VoucherButton = styled.button`
  background-color: #eee;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #ddd;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  overflow-x: auto;
  white-space: nowrap;
`;

const Tab = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  color: ${props => props.active ? '#ee4d2d' : '#333'};
  border-bottom: 2px solid ${props => props.active ? '#ee4d2d' : 'transparent'};
  font-weight: ${props => props.active ? '600' : 'normal'};
  
  &:hover {
    color: #ee4d2d;
  }
`;

const VoucherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VoucherCard = styled.div`
  display: flex;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const VoucherLogo = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ee4d2d;
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 10px;
`;

const VoucherInfo = styled.div`
  flex: 1;
  padding: 15px;
  position: relative;
`;

const VoucherName = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 15px;
`;

const VoucherMinimum = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
`;

const VoucherValidity = styled.div`
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  margin-top: 5px;
  
  svg {
    margin-right: 5px;
    font-size: 10px;
  }
`;

const VoucherTerms = styled.a`
  font-size: 12px;
  color: #2196f3;
  text-decoration: none;
  margin-left: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const VoucherUse = styled.button`
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: white;
  color: #ee4d2d;
  border: 1px solid #ee4d2d;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const VoucherBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff8a8a;
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

const VoucherTab = () => {
  const [voucherTab, setVoucherTab] = useState('all');
  
  // Mock vouchers data
  const vouchers = [
    {
      id: 1,
      logo: 'international',
      name: 'Giảm 15% Giảm tối đa ₫70k',
      minimumOrder: 'Đơn Tối Thiểu ₫200k',
      validity: '2 ngày',
      quantity: 5
    },
    {
      id: 2,
      logo: 'shopee',
      name: 'Giảm 15% Giảm tối đa ₫150k',
      minimumOrder: 'Đơn Tối Thiểu ₫500k',
      validity: '2 ngày',
      quantity: 3
    },
    {
      id: 3,
      logo: 'shopee',
      name: 'Giảm 15% Giảm tối đa ₫150k',
      minimumOrder: 'Đơn Tối Thiểu ₫500k',
      validity: '2 ngày',
      quantity: 3
    },
    {
      id: 4,
      logo: 'shopee-live',
      name: 'Giảm 13% Giảm tối đa ₫1.2tr',
      minimumOrder: 'Đơn Tối Thiểu ₫29k',
      validity: '2 ngày',
      isLive: true,
      quantity: 3
    },
    {
      id: 5,
      logo: 'shopee',
      name: 'Giảm 10% Giảm tối đa ₫50k',
      minimumOrder: 'Đơn Tối Thiểu ₫79k',
      validity: '2 ngày'
    },
    {
      id: 6,
      logo: 'shopee',
      name: 'Giảm 11% Giảm tối đa ₫300k',
      minimumOrder: 'Đơn Tối Thiểu ₫159k',
      validity: '2 ngày'
    }
  ];
  
  const renderVoucherLogo = (logo) => {
    switch (logo) {
      case 'international':
        return (
          <VoucherLogo style={{ backgroundColor: '#e53935' }}>
            Hàng quốc tế
          </VoucherLogo>
        );
      case 'shopee-live':
        return (
          <VoucherLogo style={{ backgroundColor: '#f57c00' }}>
            SHOPEE LIVE
          </VoucherLogo>
        );
      case 'shopee':
      default:
        return (
          <VoucherLogo style={{ backgroundColor: '#f57c00' }}>
            SHOPEE
          </VoucherLogo>
        );
    }
  };
  
  const renderVouchers = () => {
    // Filter vouchers based on selected tab
    let filteredVouchers = vouchers;
    
    return (
      <VoucherGrid>
        {filteredVouchers.map(voucher => (
          <VoucherCard key={voucher.id}>
            {renderVoucherLogo(voucher.logo)}
            
            <VoucherInfo>
              <VoucherName>{voucher.name}</VoucherName>
              <VoucherMinimum>{voucher.minimumOrder}</VoucherMinimum>
              
              {voucher.isLive && (
                <VoucherMinimum style={{ color: '#e53935', fontWeight: 'bold' }}>
                  Chỉ có trên Live
                </VoucherMinimum>
              )}
              
              <VoucherValidity>
                <FaTicketAlt /> Có hiệu lực sau: {voucher.validity}
                <VoucherTerms href="#">Điều Kiện</VoucherTerms>
              </VoucherValidity>
              
              <VoucherUse>
                Dùng Sau
              </VoucherUse>
              
              {voucher.quantity && (
                <VoucherBadge>x{voucher.quantity}</VoucherBadge>
              )}
            </VoucherInfo>
          </VoucherCard>
        ))}
      </VoucherGrid>
    );
  };

  return (
    <Container>
      <CardHeader>
        <h2><FaTicketAlt /> Kho Voucher</h2>
      </CardHeader>
      <CardBody>
        <VoucherContainer>
          <VoucherHeader>
            <VoucherActions>
              <ActionLink href="#"><FaPlus /> Tìm thêm voucher</ActionLink>
              <ActionLink href="#"><FaHistory /> Xem lịch sử voucher</ActionLink>
              <ActionLink href="#"><FaInfo /> Tìm hiểu</ActionLink>
            </VoucherActions>
          </VoucherHeader>
          
          <VoucherInputGroup>
            <VoucherLabel>Mã Voucher</VoucherLabel>
            <VoucherInput 
              type="text"
              placeholder="Nhập mã voucher tại đây"
            />
            <VoucherButton>Lưu</VoucherButton>
          </VoucherInputGroup>
          
          <TabsContainer>
            <Tab 
              active={voucherTab === 'all'} 
              onClick={() => setVoucherTab('all')}
            >
              Tất Cả (740)
            </Tab>
            <Tab 
              active={voucherTab === 'shopee'} 
              onClick={() => setVoucherTab('shopee')}
            >
              Shopee (728)
            </Tab>
            <Tab 
              active={voucherTab === 'shop'} 
              onClick={() => setVoucherTab('shop')}
            >
              Shop (10)
            </Tab>
            <Tab 
              active={voucherTab === 'card'} 
              onClick={() => setVoucherTab('card')}
            >
              Nạp thẻ & Dịch vụ (0)
            </Tab>
            <Tab 
              active={voucherTab === 'scan'} 
              onClick={() => setVoucherTab('scan')}
            >
              Scan & Pay (1)
            </Tab>
            <Tab 
              active={voucherTab === 'finance'} 
              onClick={() => setVoucherTab('finance')}
            >
              Dịch vụ Tài chính (1)
            </Tab>
          </TabsContainer>
          
          {renderVouchers()}
        </VoucherContainer>
      </CardBody>
    </Container>
  );
};

export default VoucherTab; 