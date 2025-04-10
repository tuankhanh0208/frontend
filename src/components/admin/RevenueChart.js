import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
`;

const NoDataMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
  font-style: italic;
`;

/**
 * Component biểu đồ doanh thu
 * @param {Object} props - Props
 * @param {Array} props.revenueData - Dữ liệu doanh thu
 * @param {string} props.timeRange - Khoảng thời gian (daily, weekly, monthly, yearly)
 * @param {boolean} props.loading - Đang tải dữ liệu
 */
const RevenueChart = ({ revenueData = [], timeRange = 'monthly', loading = false }) => {
  // Kiểm tra nếu không có dữ liệu
  if (!loading && (!revenueData || revenueData.length === 0)) {
    return <NoDataMessage>Không có dữ liệu doanh thu để hiển thị</NoDataMessage>;
  }

  // Cấu hình nhãn theo timeRange
  const timeRangeLabels = {
    daily: 'Ngày',
    weekly: 'Tuần',
    monthly: 'Tháng',
    yearly: 'Năm'
  };

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: revenueData.map(item => item.period),
    datasets: [
      {
        label: 'Doanh thu',
        data: revenueData.map(item => item.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        fill: false
      },
      {
        label: 'Số đơn hàng',
        data: revenueData.map(item => item.orders_count),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
        yAxisID: 'y1',
        type: 'line'
      }
    ]
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Doanh thu (VNĐ)'
        },
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value);
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Số đơn hàng'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Tổng quan doanh thu theo ${timeRangeLabels[timeRange] || timeRange}`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 0) {
              // Format doanh thu
              label += new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0
              }).format(context.parsed.y);
            } else {
              // Format số đơn hàng
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <ChartContainer>
      {loading && <LoadingOverlay>Đang tải dữ liệu...</LoadingOverlay>}
      <Line data={chartData} options={options} height={300} />
    </ChartContainer>
  );
};

export default RevenueChart; 