import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #eaeaea;

  th {
    padding: 12px 16px;
    color: #6b7280;
    font-weight: 600;
    white-space: nowrap;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #eaeaea;
  }

  td {
    padding: 12px 16px;
    color: #374151;
    white-space: nowrap;
  }
`;

const SkeletonCell = styled.div`
  height: 16px;
  width: ${props => props.width || '100px'};
  border-radius: 4px;
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonBadge = styled(SkeletonCell)`
  height: 24px;
  width: 80px;
  border-radius: 100px;
`;

const OrderSkeleton = ({ rows = 5 }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Khách hàng</th>
            <th>SĐT</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Tổng tiền</th>
            <th>Shipping</th>
            <th>Trả trước</th>
            <th></th>
          </tr>
        </TableHead>
        <TableBody>
          {Array(rows).fill().map((_, index) => (
            <tr key={index}>
              <td><SkeletonCell width="150px" /></td>
              <td><SkeletonCell width="120px" /></td>
              <td><SkeletonCell width="100px" /></td>
              <td><SkeletonCell width="180px" /></td>
              <td><SkeletonCell width="200px" /></td>
              <td><SkeletonCell width="80px" /></td>
              <td><SkeletonBadge /></td>
              <td><SkeletonBadge /></td>
              <td><SkeletonCell width="20px" /></td>
            </tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderSkeleton; 