import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEllipsisV, FaEye, FaPen, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #f9fafb;
    }
  }

  td {
    padding: 12px 16px;
    color: #374151;
    white-space: nowrap;
  }
`;

const ActionCell = styled.td`
  position: relative;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

const ActionMenu = styled(motion.div)`
  position: absolute;
  right: 24px;
  top: 50%;
  z-index: 10;
  width: 180px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const ActionItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #374151;
  
  svg {
    margin-right: 10px;
    font-size: 14px;
  }
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  &.delete {
    color: #ef4444;
    
    &:hover {
      background-color: #fef2f2;
    }
  }
`;

const ShippingBadge = styled.span`
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  
  &.standard {
    background-color: #e2e8f0;
    color: #475569;
  }
  
  &.fast {
    background-color: #dcfce7;
    color: #166534;
  }
`;

const PaymentBadge = styled.span`
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  
  &.paid {
    background-color: #dcfce7;
    color: #166534;
  }
  
  &.unpaid {
    background-color: #fef2f2;
    color: #b91c1c;
  }
`;

const OrderTable = ({ orders, onView, onEdit, onDelete }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (orderId) => {
    setActiveMenu(activeMenu === orderId ? null : orderId);
  };

  const handleAction = (action, order) => {
    setActiveMenu(null);
    if (action === 'view') onView(order);
    if (action === 'edit') onEdit(order);
    if (action === 'delete') onDelete(order);
  };

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
          {orders.map((order) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <td>{order.product_name}</td>
              <td>{order.customer_name}</td>
              <td>{order.phone_number}</td>
              <td>{order.email}</td>
              <td>{order.address}</td>
              <td>{order.total_amount.toLocaleString('vi-VN')} đ</td>
              <td>
                <ShippingBadge className={order.shipping_method === 'Nhanh' ? 'fast' : 'standard'}>
                  {order.shipping_method}
                </ShippingBadge>
              </td>
              <td>
                <PaymentBadge className={order.is_prepaid ? 'paid' : 'unpaid'}>
                  {order.is_prepaid ? 'Yes' : 'No'}
                </PaymentBadge>
              </td>
              <ActionCell>
                <ActionButton onClick={() => toggleMenu(order.id)}>
                  <FaEllipsisV />
                </ActionButton>
                <AnimatePresence>
                  {activeMenu === order.id && (
                    <ActionMenu
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ActionItem onClick={() => handleAction('view', order)}>
                        <FaEye /> Xem chi tiết
                      </ActionItem>
                      <ActionItem onClick={() => handleAction('edit', order)}>
                        <FaPen /> Cập nhật
                      </ActionItem>
                      <ActionItem className="delete" onClick={() => handleAction('delete', order)}>
                        <FaTrash /> Xóa
                      </ActionItem>
                    </ActionMenu>
                  )}
                </AnimatePresence>
              </ActionCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable; 