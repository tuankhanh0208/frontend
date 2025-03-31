import React from 'react';
import styled from 'styled-components';
import AdminLayout from '../../layouts/AdminLayout';

const Container = styled.div`
  padding: 20px;
`;

const CategoryList = () => {
  return (
    <AdminLayout title="Category Management">
      <Container>
        <h2>Category Management</h2>
        <p>This page will display a list of categories and allow admins to manage them.</p>
      </Container>
    </AdminLayout>
  );
};

export default CategoryList;