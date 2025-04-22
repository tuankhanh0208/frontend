import { useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import { AuthContext } from '../context/AuthContext';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateAvatar: updateContextAvatar } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Legacy: Sử dụng authService cho tính tương thích
        // Trong tương lai sẽ được thay thế hoàn toàn bằng userService
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
      // Sử dụng userService mới
      const response = await userService.updateProfile(updatedData);
      const updatedUser = response.user; // Lấy dữ liệu user từ response
      
      if (updatedUser) {
        setUser(prevUser => ({ ...prevUser, ...updatedUser }));
      }
      return true;
    } catch (err) {
      setError('Không thể cập nhật thông tin người dùng');
      return false;
    }
  };

  const updateAvatar = async (avatarFile) => {
    try {
      // Sử dụng updateAvatar từ AuthContext để đảm bảo avatar được cập nhật
      // đồng bộ trong toàn bộ ứng dụng
      const result = await updateContextAvatar(avatarFile);
      
      if (result && result.avatar_url) {
        // Cập nhật state của hook
        setUser(prevUser => ({ ...prevUser, avatar_url: result.avatar_url }));
        return true;
      }
      return false;
    } catch (err) {
      setError('Không thể cập nhật ảnh đại diện');
      return false;
    }
  };

  const updateLocation = async (locationData) => {
    try {
      const result = await userService.updateLocation(locationData);
      if (result) {
        setUser(prevUser => ({ ...prevUser, location: locationData.address }));
        return true;
      }
      return false;
    } catch (err) {
      setError('Không thể cập nhật địa chỉ');
      return false;
    }
  };

  return { 
    user, 
    loading, 
    error, 
    updateUser, 
    updateAvatar,
    updateLocation 
  };
};

export default useUser;