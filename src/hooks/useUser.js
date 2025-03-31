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
      // Implement update user API call here
      setUser({ ...user, ...updatedData });
      return true;
    } catch (err) {
      setError('Không thể cập nhật thông tin người dùng');
      return false;
    }
  };

  return { user, loading, error, updateUser };
};

export default useUser;