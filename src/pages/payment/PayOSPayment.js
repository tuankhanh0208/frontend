import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import PaymentQRCode from '../../components/PaymentQRCode';
import payosService from '../../services/payosService';

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 28px;
  text-align: center;
`;

const PaymentInfo = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PaymentMethod = styled.div`
  background-color: #f5f5f5;
  padding: 12px 20px;
  border-radius: 30px;
  font-weight: 500;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
`;

const PaymentLogo = styled.img`
  height: 24px;
  margin-right: 10px;
`;

const PaymentDetails = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OrderSummary = styled.div`
  flex: 1;
  min-width: 300px;
  margin-right: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const QRCodeSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const SummaryTitle = styled.h3`
  margin-bottom: 15px;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
  
  &.total {
    font-weight: bold;
    font-size: 18px;
    border-top: 1px solid #eee;
    padding-top: 15px;
    margin-top: 10px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  font-size: 14px;
  
  &:hover {
    color: #333;
  }
`;

const ErrorMessage = styled.div`
  background-color: #FFEBEE;
  color: #C62828;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoMessage = styled.div`
  background-color: #E3F2FD;
  color: #1565C0;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PayOSPayment = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { orderCode } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy thông tin đơn hàng từ state hoặc từ URL
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                // Nếu không có orderCode trong URL, sử dụng từ location state
                const code = orderCode || location.state?.orderCode;

                if (!code) {
                    setError('Không tìm thấy mã đơn hàng');
                    setLoading(false);
                    return;
                }

                // Kiểm tra trạng thái đơn hàng
                const response = await payosService.checkStatus(code);
                console.log('Thông tin đơn hàng:', response);

                // Nếu có lỗi trong response
                if (response.error) {
                    console.warn('Warning:', response.error);
                }

                // Nếu đã thanh toán xong, chuyển hướng đến trang thành công
                if (response.status === 'completed' || response.status === 'success') {
                    navigate(`/payment/success?orderCode=${code}&status=success`);
                    return;
                }

                setOrderDetails({
                    orderCode: code,
                    amount: response.amount || location.state?.amount || 0,
                    status: response.status || 'pending',
                    createdAt: response.created_at || new Date().toISOString(),
                    fallback: response.fallback || false
                });

            } catch (err) {
                console.error('Error fetching order details:', err);
                // Không hiển thị lỗi ngay, vẫn cố gắng hiển thị thông tin đơn hàng nếu có

                // Nếu có thông tin từ location state, vẫn hiển thị
                if (location.state?.orderCode && location.state?.amount) {
                    setOrderDetails({
                        orderCode: location.state.orderCode,
                        amount: location.state.amount,
                        status: 'pending',
                        createdAt: new Date().toISOString()
                    });
                } else {
                    setError('Có lỗi xảy ra khi lấy thông tin đơn hàng. Vui lòng thử lại sau.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderCode, location.state, navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Container>
                <Title>Đang tải thông tin thanh toán...</Title>
            </Container>
        );
    }

    if (error && !orderDetails) {
        return (
            <Container>
                <BackButton onClick={handleBack}><FaArrowLeft /> Quay lại</BackButton>
                <Title>Không thể tải thông tin thanh toán</Title>
                <ErrorMessage>
                    <FaExclamationTriangle />
                    {error}
                </ErrorMessage>
            </Container>
        );
    }

    return (
        <Container>
            <BackButton onClick={handleBack}><FaArrowLeft /> Quay lại</BackButton>
            <Title>Thanh toán đơn hàng</Title>

            <PaymentInfo>
                <PaymentMethod>
                    <PaymentLogo src="https://payos.vn/assets/images/logo.svg" alt="PayOS Logo" />
                    Thanh toán qua PayOS
                </PaymentMethod>
            </PaymentInfo>

            {error && (
                <ErrorMessage>
                    <FaExclamationTriangle />
                    {error}
                </ErrorMessage>
            )}

            {orderDetails?.fallback && (
                <InfoMessage>
                    <FaExclamationTriangle />
                    Đang sử dụng QR code thay thế. Quý khách có thể chuyển khoản trực tiếp theo thông tin hiển thị.
                </InfoMessage>
            )}

            <PaymentDetails>
                <OrderSummary>
                    <SummaryTitle>Thông tin đơn hàng</SummaryTitle>
                    <DetailItem>
                        <span>Mã đơn hàng:</span>
                        <span>{orderDetails?.orderCode}</span>
                    </DetailItem>
                    <DetailItem>
                        <span>Ngày tạo:</span>
                        <span>{new Date(orderDetails?.createdAt).toLocaleString('vi-VN')}</span>
                    </DetailItem>
                    <DetailItem>
                        <span>Trạng thái:</span>
                        <span>{orderDetails?.status === 'completed' ? 'Đã thanh toán' : 'Chờ thanh toán'}</span>
                    </DetailItem>
                    <DetailItem className="total">
                        <span>Tổng tiền:</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails?.amount || 0)}</span>
                    </DetailItem>
                </OrderSummary>

                <QRCodeSection>
                    {orderDetails && (
                        <PaymentQRCode
                            orderCode={orderDetails.orderCode}
                            amount={orderDetails.amount}
                        />
                    )}
                </QRCodeSection>
            </PaymentDetails>
        </Container>
    );
};

export default PayOSPayment; 