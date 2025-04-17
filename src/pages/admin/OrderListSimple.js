import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AdminLayout from '../../layouts/AdminLayout';
import orderApi from '../../mock/orderData';

const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
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

const OrderListSimple = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrders();
        setOrders(response.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
      <Container>
        <Header>
          <div>
            <Title>Đơn hàng (Đơn giản)</Title>
          </div>
        </Header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                </tr>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.product_name}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.total_amount} đ</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      </Container>
  );
};

export default OrderListSimple; 