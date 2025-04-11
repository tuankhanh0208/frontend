/**
 * Hàm tiện ích tải ảnh đại diện từ các dịch vụ như Gravatar, UI Avatars
 */
export const getAvatarUrl = (name, index = 0) => {
  // Sử dụng dịch vụ UI Avatars để tạo ảnh đại diện từ chữ cái đầu của tên
  const colors = [
    '4CAF50', '2196F3', '9C27B0', 'F44336', 'FF9800',
    '795548', '607D8B', 'E91E63', '3F51B5', '009688'
  ];
  
  const backgroundColor = colors[index % colors.length];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=fff&size=200`;
};

export default getAvatarUrl; 