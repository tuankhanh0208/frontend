// src/components/common/Breadcrumb/Breadcrumb.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BreadcrumbContainer = styled.div`
  display: flex;
  padding: 10px 0;
  margin: 0 auto;
  max-width: 1200px;
`;

const BreadcrumbList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 14px;
  
  a {
    color: #666;
    text-decoration: none;
    
    &:hover {
      color: #4CAF50;
      text-decoration: underline;
    }
  }
  
  &::after {
    content: '›';
    margin: 0 8px;
    color: #999;
  }
  
  &:last-child {
    &::after {
      display: none;
    }
    
    a {
      color: #333;
      font-weight: 500;
      pointer-events: none;
    }
  }
`;

const HomeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 5px;
`;

const Breadcrumb = ({ items }) => {
  return (
    <BreadcrumbContainer>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            <Link to={item.url}>
              {index === 0 && (
                <HomeIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
                  </svg>
                </HomeIcon>
              )}
              {item.label}
            </Link>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;