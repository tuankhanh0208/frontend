# Hướng dẫn khắc phục lỗi bcrypt trong môi trường ảo myven

## Vấn đề

Lỗi hiện tại trong hệ thống:
```
bcrypt: no backends available -- recommend you install one (e.g. 'pip install bcrypt')
```

Đây là lỗi phổ biến khi thư viện bcrypt không được cài đặt đúng cách hoặc không tương thích với phiên bản passlib đang sử dụng.

## Các bước khắc phục

### Phương pháp 1: Cài đặt bcrypt trong môi trường ảo

1. Mở Command Prompt (cmd) với quyền Administrator
2. Di chuyển đến thư mục backend:
   ```
   cd /d d:\workspace\Capstone-2-FMSuggestion-System\backend
   ```
3. Kích hoạt môi trường ảo myven:
   ```
   myven\Scripts\activate
   ```
4. Gỡ cài đặt bcrypt hiện tại (nếu có):
   ```
   pip uninstall -y bcrypt
   ```
5. Cài đặt bcrypt phiên bản 3.2.2 (phiên bản này tương thích tốt với passlib):
   ```
   pip install bcrypt==3.2.2
   ```

### Phương pháp 2: Cài đặt passlib với bcrypt

1. Kích hoạt môi trường ảo như trên
2. Cài đặt passlib với bcrypt:
   ```
   pip install -U passlib[bcrypt]
   ```

### Phương pháp 3: Cài đặt các phụ thuộc cụ thể

Nếu các phương pháp trên không hiệu quả, hãy thử cài đặt các phiên bản cụ thể:

```
pip uninstall -y bcrypt passlib
pip install passlib==1.7.4
pip install bcrypt==3.2.2
```

## Lưu ý quan trọng

- Đảm bảo bạn đang sử dụng môi trường ảo myven khi cài đặt các thư viện
- Sau khi cài đặt, khởi động lại server backend để áp dụng thay đổi
- Nếu vẫn gặp lỗi, kiểm tra xem có xung đột phiên bản Python không

## Kiểm tra cài đặt

Sau khi cài đặt, bạn có thể kiểm tra bằng cách chạy lệnh sau trong môi trường ảo:

```
python -c "import bcrypt; print(bcrypt.__version__)"
```

Nếu lệnh trên hiển thị phiên bản bcrypt mà không có lỗi, việc cài đặt đã thành công.