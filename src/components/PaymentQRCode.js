import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { FaSync, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import payosService from '../services/payosService';
import { PAYOS_CONFIG } from '../config';
import { QRCodeCanvas } from 'qrcode.react';

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
`;

const QRTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
`;

const QRImageContainer = styled.div`
  width: 200px;
  height: 200px;
  margin: 16px 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  padding: 8px;
  border-radius: 8px;
  overflow: hidden;
`;

const QRImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  display: block;
`;

const QRInfo = styled.div`
  text-align: center;
  margin: 16px 0;
  width: 100%;
`;

const QRStatus = styled.div`
  font-size: 16px;
  padding: 8px;
  border-radius: 6px;
  margin-top: 12px;
  text-align: center;
  
  &.pending {
    background-color: #FFF9C4;
    color: #F57F17;
  }
  
  &.success {
    background-color: #E8F5E9;
    color: #2E7D32;
  }
  
  &.error {
    background-color: #FFEBEE;
    color: #C62828;
  }
  
  &.fallback {
    background-color: #E8EAF6;
    color: #3949AB;
  }
`;

const Amount = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin: 8px 0;
  color: #333;
`;

const RefreshButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  border-radius: 30px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 12px;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  svg {
    animation: ${props => props.loading ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Instructions = styled.div`
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  width: 100%;
`;

const StatusIcon = styled.div`
  margin-right: 8px;
  display: inline-block;
  
  &.success {
    color: #2E7D32;
  }
  
  &.error {
    color: #C62828;
  }
  
  &.info {
    color: #1565C0;
  }
`;

const PaymentQRCode = ({ orderCode, amount }) => {
    const [qrData, setQrData] = useState(null);
    const [qrUrl, setQrUrl] = useState('');
    const [qrText, setQrText] = useState('');
    const [status, setStatus] = useState('pending');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [useFallbackQR, setUseFallbackQR] = useState(false);
    const payosContainerRef = useRef(null);
    const [retryCount, setRetryCount] = useState(0);

    // Fallback: Tạo mã QR VietQR khi không lấy được từ PayOS
    const generateFallbackQR = () => {
        // Tạo URL VietQR dạng: https://img.vietqr.io/image/{bankID}-{accountNo}-{template}.png
        const fallbackQRUrl = `https://img.vietqr.io/image/BIDV-21410000482645-compact2.png?amount=${amount}&addInfo=Thanh toan don hang ${orderCode}&accountName=NGUYEN VAN A`;
        setQrUrl(fallbackQRUrl);
        setUseFallbackQR(true);
    };

    const fetchQRCode = async () => {
        try {
            setLoading(true);
            const response = await payosService.getPaymentQRCode(orderCode);
            console.log('QR code response:', response);

            if (response.status === 'completed') {
                setStatus('success');
                setMessage('Thanh toán đã hoàn tất');
            } else {
                setStatus('pending');
                setMessage('Đang chờ thanh toán');

                // Kiểm tra xem có phải đang sử dụng QR fallback không
                if (response.fallback) {
                    setUseFallbackQR(true);
                    if (response.error) {
                        console.warn('PayOS QR fallback warning:', response.error);
                    }
                } else {
                    setUseFallbackQR(false);
                }

                // Nếu có mã QR từ backend
                if (response.qr_code) {
                    setQrData(response.qr_code);
                } else if (response.qr_code_url) {
                    setQrUrl(response.qr_code_url);
                } else if (response.qr_text) {
                    // Nếu có text QR từ PayOS
                    setQrText(response.qr_text);
                } else {
                    // Nếu không có gì, sử dụng fallback
                    generateFallbackQR();
                }
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching QR code:', err);

            // Chỉ hiển thị lỗi khi đã thử nhiều lần
            if (retryCount > 2) {
                setError(err.message || 'Có lỗi xảy ra khi lấy mã QR');
            }

            // Sử dụng fallback khi có lỗi
            generateFallbackQR();

            // Tăng số lần retry
            setRetryCount(prev => prev + 1);

            // Hiển thị lỗi nhưng vẫn tiếp tục với QR fallback
            setStatus('pending');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderCode) {
            fetchQRCode();

            // Tự động cập nhật trạng thái mỗi 10 giây
            const interval = setInterval(() => {
                if (status !== 'success') {
                    fetchQRCode();
                }
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [orderCode]);

    const handleRefresh = () => {
        fetchQRCode();
    };

    let statusDisplay;
    if (status === 'success') {
        statusDisplay = (
            <QRStatus className="success">
                <StatusIcon className="success"><FaCheckCircle /></StatusIcon>
                Thanh toán thành công
            </QRStatus>
        );
    } else if (error && retryCount > 2 && !useFallbackQR) {
        statusDisplay = (
            <QRStatus className="error">
                <StatusIcon className="error"><FaTimesCircle /></StatusIcon>
                {error}
            </QRStatus>
        );
    } else if (useFallbackQR) {
        statusDisplay = (
            <QRStatus className="fallback">
                <StatusIcon className="info"><FaInfoCircle /></StatusIcon>
                Đang sử dụng mã QR dự phòng
            </QRStatus>
        );
    } else {
        statusDisplay = (
            <QRStatus className="pending">
                Đang chờ thanh toán...
            </QRStatus>
        );
    }

    return (
        <QRContainer>
            <QRTitle>Quét mã QR để thanh toán</QRTitle>

            <QRInfo>
                <Amount>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</Amount>
                <div>Mã đơn hàng: {orderCode}</div>
            </QRInfo>

            <QRImageContainer>
                {loading ? (
                    <FaSync style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }} />
                ) : qrData ? (
                    <QRImage src={`data:image/png;base64,${qrData}`} alt="QR Payment Code" />
                ) : qrUrl ? (
                    <QRImage src={qrUrl} alt="QR Payment Code" />
                ) : qrText ? (
                    <QRCodeCanvas value={qrText} size={180} />
                ) : (
                    <div>Không có mã QR</div>
                )}
            </QRImageContainer>

            {statusDisplay}

            <RefreshButton onClick={handleRefresh} loading={loading ? 1 : 0}>
                <FaSync /> Làm mới trạng thái
            </RefreshButton>

            <Instructions>
                <p><strong>Hướng dẫn thanh toán:</strong></p>
                <ol>
                    <li>Mở ứng dụng ngân hàng hoặc ví điện tử trên điện thoại</li>
                    <li>Quét mã QR hoặc chọn chức năng thanh toán QR</li>
                    <li>Xác nhận thông tin thanh toán</li>
                    <li>Hoàn tất thanh toán theo hướng dẫn</li>
                </ol>
                <p>Trang sẽ tự động cập nhật khi thanh toán thành công.</p>
                {useFallbackQR && (
                    <p style={{ color: '#1565C0', marginTop: '10px' }}>
                        <strong>Lưu ý:</strong> Đang sử dụng mã QR dự phòng cho ngân hàng BIDV.
                        Nếu thanh toán thành công, vui lòng liên hệ với chúng tôi để xác nhận đơn hàng.
                    </p>
                )}
            </Instructions>

            {/* PayOS Container cho script */}
            <div ref={payosContainerRef} id="payos-container" style={{ display: 'none' }}></div>
        </QRContainer>
    );
};

export default PaymentQRCode; 