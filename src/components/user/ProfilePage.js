import React, { useState } from 'react';
import UserProfile from './UserProfile/UserProfile';
import UserProfileInfo from './ProfileForm/UserProfileInfo';
import OrderTab from './OrderTab/OrderTab';
import VoucherTab from './VoucherTab/VoucherTab';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <UserProfile activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === 'profile' && <UserProfileInfo />}
      {activeTab === 'orders' && <OrderTab />}
      {activeTab === 'vouchers' && <VoucherTab />}
    </UserProfile>
  );
};

export default ProfilePage; 