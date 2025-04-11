import { useState, useEffect } from 'react';
import authService from '../services/authService';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        setError('Không thể tải thông tin người dùng');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = async (updatedData) => {
    try {
      // Đảm bảo location được truyền đúng trong updateData
      // Gọi API cập nhật profile người dùng
      const updatedUserData = await authService.updateProfile(updatedData);
      setUser({ ...user, ...updatedUserData });
      return true;
    } catch (err) {
      setError('Không thể cập nhật thông tin người dùng');
      return false;
    }
  };

  const updateAvatar = async (avatarFile) => {
    try {
      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      // Gọi API update avatar
      const result = await authService.updateAvatar(formData);
      if (result && result.avatar_url) {
        // Cập nhật state với đường dẫn avatar mới
        setUser({ ...user, avatar_url: result.avatar_url });
        return true;
      }
      return false;
    } catch (err) {
      setError('Không thể cập nhật ảnh đại diện');
      return false;
    }
  };

  return { user, loading, error, updateUser, updateAvatar };
};

export default useUser;