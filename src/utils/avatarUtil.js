/**
 * Hàm tiện ích tải ảnh đại diện từ các dịch vụ như Gravatar, UI Avatars
 * @param {object} user - Thông tin người dùng
 * @param {number} index - Chỉ số để chọn màu nền
 * @returns {string} URL ảnh đại diện
 */
export const getAvatarUrl = (user, index = 0) => {
  // Nếu người dùng có avatar_url, ưu tiên sử dụng
  if (user && user.avatar_url) {
    return user.avatar_url;
  }
  
  // Nếu chỉ truyền name dưới dạng string
  if (typeof user === 'string') {
    const name = user;
    return generateInitialsAvatar(name, index);
  }
  
  // Nếu truyền đối tượng user nhưng không có avatar_url
  if (user && user.name) {
    return generateInitialsAvatar(user.name, index);
  } else if (user && user.full_name) {
    return generateInitialsAvatar(user.full_name, index);
  } else if (user && user.username) {
    return generateInitialsAvatar(user.username, index);
  }
  
  // Trường hợp không có thông tin gì
  return generateInitialsAvatar("User", index);
};

/**
 * Tạo avatar từ chữ cái đầu của tên
 * @param {string} name - Tên người dùng
 * @param {number} index - Chỉ số để chọn màu nền
 * @returns {string} URL ảnh đại diện
 */
const generateInitialsAvatar = (name, index = 0) => {
  const colors = [
    '4CAF50', '2196F3', '9C27B0', 'F44336', 'FF9800',
    '795548', '607D8B', 'E91E63', '3F51B5', '009688'
  ];
  
  const backgroundColor = colors[index % colors.length];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=fff&size=200`;
};

export default getAvatarUrl; 