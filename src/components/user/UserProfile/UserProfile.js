import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaTicketAlt, FaHeart, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import useUser from '../../../hooks/useUser';

const ProfileContainer = styled.div`
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: fit-content;
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const UserInfo = styled.div`
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  overflow: hidden;
  border: 2px solid #4CAF50;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.h3`
  margin: 0 0 5px;
  font-size: 18px;
  color: #333;
`;

const UserEmail = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: ${props => props.active ? '#4CAF50' : '#333'};
  text-decoration: none;
  transition: all 0.2s ease;
  background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  font-weight: ${props => props.active ? '600' : 'normal'};
  
  svg {
    margin-right: 10px;
    font-size: 18px;
  }
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
  }
`;

const Content = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ContentHeader = styled.div`
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

const ContentBody = styled.div`
  padding: 20px;
`;

const UserProfile = ({ activeTab = 'profile', children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <ProfileContainer>
      <Sidebar>
        <UserInfo>
          <Avatar>
            <img src="https://via.placeholder.com/80" alt="User Avatar" />
          </Avatar>
          <UserName>{user?.full_name || 'Chưa cập nhật'}</UserName>
          <UserEmail>{user?.email || 'Chưa cập nhật'}</UserEmail>
        </UserInfo>
        
        <NavMenu>
          <NavItem>
            <NavLink to="/profile" active={activeTab === 'profile' ? 1 : 0}>
              <FaUser /> Hồ Sơ
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/orders" active={activeTab === 'orders' ? 1 : 0}>
              <FaShoppingBag /> Đơn Mua
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/vouchers" active={activeTab === 'vouchers' ? 1 : 0}>
              <FaTicketAlt /> Kho Voucher
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/wishlist" active={activeTab === 'wishlist' ? 1 : 0}>
              <FaHeart /> Sản Phẩm Yêu Thích
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/logout">
              <FaSignOutAlt /> Đăng Xuất
            </NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        {children}
      </Content>
    </ProfileContainer>
  );
};

export default UserProfile;