import React, { useContext } from 'react';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';
import MainLayout from '../../layouts/MainLayout';
import { AuthContext } from '../../context/AuthContext';
import UserProfile from '../../components/user/UserProfile/UserProfile';
import ProfileForm from '../../components/user/ProfileForm/ProfileForm';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ProfileTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
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

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  
  // Mock user data for development
  const mockUser = {
    fullName: 'Văn Nam Đặng',
    email: 'vannamdang93@gmail.com',
    phone: '0123456789',
    gender: 'male',
    birthDate: '1993-01-01'
  };
  
  // Use mock data if currentUser is not available
  const userData = currentUser || mockUser;
  
  return (
    <MainLayout>
      <ProfileContainer>
        <ProfileTitle>Tài khoản của tôi</ProfileTitle>
        
        <UserProfile activeTab="profile">
          <CardHeader>
            <h2><FaUser /> Hồ Sơ Của Tôi</h2>
          </CardHeader>
          <CardBody>
            <ProfileForm user={userData} />
          </CardBody>
        </UserProfile>
      </ProfileContainer>
    </MainLayout>
  );
};

export default Profile;