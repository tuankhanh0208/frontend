import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../layouts/AdminLayout';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }
  
  if (!currentUser || currentUser.role !== 'admin') {
    // Redirect unauthorized users to home
    return <Navigate to="/" replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminRoute;