# Khắc phục lỗi bcrypt WARNING trong backend

Lỗi hiện tại:
```
WARNING - (trapped) error reading bcrypt version
Traceback (most recent call last):
  File "D:\workspace\Capstone-2-FMSuggestion-System\backend\myven\Lib\site-packages\passlib\handlers\bcrypt.py", line 620, in _load_backend_mixin
    version = _bcrypt.__about__.__version__
              ^^^^^^^^^^^^^^^^^
AttributeError: module 'bcrypt' has no attribute '__about__'
```

## Nguyên nhân
Phiên bản mới của thư viện bcrypt không còn sử dụng `__about__` attribute để lưu trữ version, nhưng passlib vẫn đang cố truy cập.

## Cách khắc phục
1. Cập nhật passlib lên phiên bản mới nhất:
```
pip install --upgrade passlib
```

2. Nếu cách trên không giải quyết, có thể cần downgrade bcrypt về phiên bản cũ hơn tương thích với passlib:
```
pip install bcrypt==3.2.2
```

3. Hoặc bạn có thể cài đặt các phụ thuộc cụ thể:
```
pip install -U passlib[bcrypt]
```

Lưu ý: Đây chỉ là cảnh báo không ảnh hưởng đến chức năng xác thực, nhưng nên được xử lý để tránh log bị tràn. 