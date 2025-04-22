import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEdit, FaCamera, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import useUser from '../../../hooks/useUser';

const Container = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h2`
  margin: 0 0 20px;
  padding-bottom: 15px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #0A4D7C;
  transition: all 0.3s ease;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    font-size: 60px;
    color: #ddd;
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
  
  svg {
    color: white;
    font-size: 24px;
  }
`;

const AvatarInfo = styled.div`
  margin-left: 20px;
  
  p {
    margin: 0 0 5px;
    font-size: 14px;
    color: #666;
  }
  
  button {
    background-color: #0A4D7C;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #073d62;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #0A4D7C;
    box-shadow: 0 0 0 2px rgba(10, 77, 124, 0.1);
  }
  
  &:disabled {
    background-color: #f9f9f9;
    cursor: not-allowed;
  }
`;

const FieldWithEdit = styled.div`
  position: relative;
`;

const EditIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #0A4D7C;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#ee4d2d' : '#f5f5f5'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;
  
  &:hover {
    background-color: ${props => props.primary ? '#d73211' : '#e8e8e8'};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  animation: fadeIn 0.5s ease-in-out;
`;

const ErrorMessage = styled.div`
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  animation: fadeIn 0.5s ease-in-out;
`;

const FileInput = styled.input`
  display: none;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    animation: ${spin} 0.8s infinite linear;
    margin-bottom: 5px;
  }
`;

const UserProfileInfo = () => {
  const { user, loading, error, updateUser, updateAvatar } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: '',
    location: ''
  });
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  React.useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || '',
        location: user.location || ''
      });
    }
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditToggle = () => {
    if (editMode) {
      // Nếu đang ở chế độ chỉnh sửa, reset lại form
      setFormData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || '',
        location: user.location || ''
      });
    }
    setEditMode(!editMode);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      // Chỉ cập nhật các trường có thể chỉnh sửa
      const updateData = {
        email: formData.email,
        full_name: formData.full_name,
        location: formData.location
      };
      
      const success = await updateUser(updateData);
      
      if (success) {
        setSuccessMessage('Cập nhật thông tin thành công!');
        setSuccess(true);
        setEditMode(false);
        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      setErrorMessage('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    }
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Kiểm tra định dạng file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Định dạng file không hợp lệ. Vui lòng chọn ảnh JPG, PNG, GIF hoặc WebP.');
      return;
    }
    
    // Kiểm tra kích thước file (tối đa 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 2MB.');
      return;
    }
    
    try {
      setErrorMessage('');
      setUploading(true);
      const result = await updateAvatar(file);
      
      if (result) {
        setSuccessMessage('Cập nhật ảnh đại diện thành công!');
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      setErrorMessage('Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
    } finally {
      setUploading(false);
    }
  };
  
  if (loading) {
    return <div>Đang tải...</div>;
  }
  
  return (
    <Container>
      <Title>Thông tin tài khoản</Title>
      
      {success && successMessage && (
        <SuccessMessage>
          {successMessage}
        </SuccessMessage>
      )}
      
      {errorMessage && (
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      )}
      
      <AvatarSection>
        <Avatar>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Ảnh đại diện" />
          ) : (
            <FaUser />
          )}
          <AvatarOverlay onClick={handleAvatarClick}>
            {uploading ? (
              <LoadingSpinner>
                <span style={{ color: 'white', fontSize: '14px' }}>Đang tải...</span>
              </LoadingSpinner>
            ) : (
              <FaCamera />
            )}
          </AvatarOverlay>
        </Avatar>
        <AvatarInfo>
          <p>Cập nhật hình ảnh đại diện của bạn</p>
          <p>Định dạng cho phép: JPG, PNG, GIF, WebP</p>
          <p>Kích thước tối đa: 2MB</p>
          <button onClick={handleAvatarClick} disabled={uploading}>
            {uploading ? 'Đang tải...' : 'Chọn ảnh'}
          </button>
        </AvatarInfo>
        <FileInput 
          type="file" 
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleAvatarChange}
        />
      </AvatarSection>
      
      <form onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup>
            <Label>Tên đăng nhập</Label>
            <Input 
              type="text"
              name="username"
              value={formData.username}
              disabled={true}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Vai trò</Label>
            <Input 
              type="text"
              name="role"
              value={formData.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
              disabled={true}
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <Label>Họ tên đầy đủ</Label>
            <FieldWithEdit>
              <Input 
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={!editMode}
              />
              {!editMode && (
                <EditIcon onClick={() => setEditMode(true)}>
                  <FaEdit />
                </EditIcon>
              )}
            </FieldWithEdit>
          </FormGroup>
          
          <FormGroup>
            <Label>Email</Label>
            <FieldWithEdit>
              <Input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!editMode}
              />
              {!editMode && (
                <EditIcon onClick={() => setEditMode(true)}>
                  <FaEdit />
                </EditIcon>
              )}
            </FieldWithEdit>
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label>
            <FaMapMarkerAlt style={{ marginRight: '5px' }} />
            Địa chỉ
          </Label>
          <FieldWithEdit>
            <Input 
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={!editMode}
              placeholder="Nhập địa chỉ của bạn"
            />
            {!editMode && (
              <EditIcon onClick={() => setEditMode(true)}>
                <FaEdit />
              </EditIcon>
            )}
          </FieldWithEdit>
        </FormGroup>
        
        {editMode && (
          <ButtonSection>
            <Button type="button" onClick={handleEditToggle}>
              Hủy
            </Button>
            <Button type="submit" primary>
              Lưu Thay Đổi
            </Button>
          </ButtonSection>
        )}
      </form>
    </Container>
  );
};

export default UserProfileInfo; 