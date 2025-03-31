// src/pages/admin/CategoryList.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const CategoryList = () => {
  return (
    <Container>
      <h2>Category Management</h2>
      <p>This page will display a list of categories and allow admins to manage them.</p>
    </Container>
  );
};

export default CategoryList;