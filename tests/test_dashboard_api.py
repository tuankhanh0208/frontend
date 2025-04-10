"""
File test cho API dashboard quản trị
"""
from fastapi.testclient import TestClient
import pytest
import os
import sys

# Thêm đường dẫn để import app từ thư mục cha
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.app.main import app

client = TestClient(app)

def test_dashboard_stats_unauthorized():
    """Test truy cập API thống kê dashboard khi chưa xác thực"""
    response = client.get("/api/admin/dashboard/stats")
    assert response.status_code == 401

def test_recent_orders_unauthorized():
    """Test truy cập API đơn hàng gần đây khi chưa xác thực"""
    response = client.get("/api/admin/dashboard/recent-orders")
    assert response.status_code == 401

def test_revenue_overview_unauthorized():
    """Test truy cập API tổng quan doanh thu khi chưa xác thực"""
    response = client.get("/api/admin/dashboard/revenue-overview")
    assert response.status_code == 401

# Các fixture và test xác thực cần token admin thực tế
# Có thể thêm sau khi triển khai hệ thống xác thực test

@pytest.fixture
def admin_token():
    """
    Fixture để tạo admin token giả lập cho mục đích test
    Trong môi trường thực tế, cần tạo token thật từ hệ thống xác thực
    """
    # Tạo token giả để test - không dùng trong thực tế
    # Trong triển khai thực tế, cần đăng nhập và lấy token thật
    return "admin_token_for_testing"

# Test cần bỏ ghi chú khi có token admin thực tế
"""
def test_dashboard_stats_authorized(admin_token):
    response = client.get(
        "/api/admin/dashboard/stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_orders" in data
    assert "total_revenue" in data
    assert "total_customers" in data
    assert "total_products" in data

def test_recent_orders_authorized(admin_token):
    response = client.get(
        "/api/admin/dashboard/recent-orders",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "orders" in data
    
def test_revenue_overview_authorized(admin_token):
    response = client.get(
        "/api/admin/dashboard/revenue-overview?time_range=monthly",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "time_range" in data
    assert "data" in data
"""

if __name__ == "__main__":
    pytest.main(["-v", "test_dashboard_api.py"]) 