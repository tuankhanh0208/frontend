// src/components/common/UserDropdown/UserDropdown.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaShoppingBag, FaSignOutAlt, FaChevronDown, FaCog } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';

const UserContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #0A4D7C;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 8px;
  font-size: 14px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 0.9rem;
  color: #333;
  
  svg {
    margin-left: 5px;
    font-size: 12px;
  }
  
  &:hover {
    color: #0A4D7C;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  z-index: 100;
  overflow: hidden;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all 0.3s ease;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
  
  svg {
    margin-right: 10px;
    color: #0A4D7C;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s;
  font-family: inherit;
  font-size: 1rem;
  
  svg {
    margin-right: 10px;
    color: #0A4D7C;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // Get first letter of username for avatar
  const getInitial = () => {
    if (currentUser && currentUser.username) {
      return currentUser.username.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle mouse enter and leave for dropdown
  const handleMouseEnter = () => {
    setIsOpen(true);
  };
  
  // Handle mouse leave to close dropdown
  const handleMouseLeave = () => {
    setIsOpen(false);
  };
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };
  
  return (
    <UserContainer ref={dropdownRef}>
      <div onClick={toggleDropdown} onMouseEnter={handleMouseEnter}>
        <UserAvatar>
          {getInitial()}
        </UserAvatar>
      </div>
      <UserInfo onClick={toggleDropdown} onMouseEnter={handleMouseEnter}>
        {currentUser?.username || 'User'}
        <FaChevronDown />
      </UserInfo>
      
      <DropdownMenu isOpen={isOpen} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <MenuItem to="/profile">
          <FaUser />
          Tài Khoản Của Tôi
        </MenuItem>
        <MenuItem to="/orders">
          <FaShoppingBag />
          Đơn Mua
        </MenuItem>
        {currentUser?.role === 'admin' && (
          <MenuItem to="/admin">
            <FaCog />
            Quản Lý
          </MenuItem>
        )}
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          Đăng Xuất
        </LogoutButton>
      </DropdownMenu>
    </UserContainer>
  );
};

export default UserDropdown;