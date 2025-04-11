import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEdit, FaCamera } from 'react-icons/fa';
import useUser from '../../../hooks/useUser';

const FormContainer = styled.div`
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 16px;
    color: #666;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #eee;
  transition: all 0.3s ease;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

const AvatarInput = styled.input`
  display: none;
`;

const AvatarInfo = styled.div`
  margin-left: 20px;
  
  p {
    margin: 0 0 5px;
    font-size: 14px;
    color: #666;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 1}, 1fr);
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 0;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 5px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: 8px;
  }
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  background-color: #ee4d2d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  margin-top: 10px;
  
  &:hover {
    background-color: #d73211;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
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

const ProfileForm = () => {
  const [success, setSuccess] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState('');
  const { user, loading, updateUser, updateAvatar } = useUser();
  const fileInputRef = useRef(null);
  
  // Form validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string().required('Họ tên là bắt buộc'),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    phone: Yup.string().required('Số điện thoại là bắt buộc'),
    gender: Yup.string().required('Giới tính là bắt buộc'),
    birthDate: Yup.date().required('Ngày sinh là bắt buộc')
  });
  
  // Initial values
  const initialValues = {
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || 'male',
    birthDate: user?.birth_date || ''
  };
  
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const success = await updateUser({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        birth_date: values.birthDate
      });
      
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setAvatarMessage('Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh JPEG hoặc PNG.');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarMessage('Kích thước ảnh quá lớn. Giới hạn 2MB.');
      return;
    }
    
    try {
      setAvatarMessage('Đang tải lên...');
      const success = await updateAvatar(file);
      
      if (success) {
        setAvatarMessage('Cập nhật ảnh đại diện thành công!');
        setTimeout(() => {
          setAvatarMessage('');
        }, 3000);
      } else {
        setAvatarMessage('Không thể cập nhật ảnh đại diện.');
      }
    } catch (error) {
      console.error('Avatar update failed:', error);
      setAvatarMessage('Không thể cập nhật ảnh đại diện.');
    }
  };
  
  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Determine avatar URL
  const avatarUrl = user?.avatar_url || 'https://via.placeholder.com/100';

  return (
    <FormContainer>
      {success && (
        <SuccessMessage>
          Thông tin của bạn đã được cập nhật thành công.
        </SuccessMessage>
      )}
      
      {avatarMessage && (
        <SuccessMessage style={{ color: avatarMessage.includes('thành công') ? '#4CAF50' : '#d32f2f' }}>
          {avatarMessage}
        </SuccessMessage>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <AvatarSection>
              <Avatar>
                <img src={avatarUrl} alt="User Avatar" />
                <AvatarOverlay onClick={handleAvatarClick}>
                  <FaCamera />
                </AvatarOverlay>
                <AvatarInput 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/jpeg, image/png"
                  onChange={handleAvatarChange}
                />
              </Avatar>
              <AvatarInfo>
                <p>Chọn Ảnh</p>
                <p>Định dạng file: .JPEG, .PNG</p>
                <p>Kích thước tối đa: 2MB</p>
              </AvatarInfo>
            </AvatarSection>
            
            <FormHeader>
              <h3>Tên đăng nhập</h3>
              <span>{user?.username || 'vannamdang93'}</span>
            </FormHeader>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="fullName">Họ Và Tên</Label>
                <Input type="text" id="fullName" name="fullName" placeholder="Nhập họ và tên" />
                <ErrorMessage name="fullName" component={ErrorText} />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" placeholder="Nhập email" />
                <ErrorMessage name="email" component={ErrorText} />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="phone">Số Điện Thoại</Label>
                <Input type="text" id="phone" name="phone" placeholder="Nhập số điện thoại" />
                <ErrorMessage name="phone" component={ErrorText} />
              </FormGroup>
            </FormRow>
            
            <FormRow cols={2}>
              <FormGroup>
                <Label>Giới Tính</Label>
                <RadioGroup>
                  <RadioLabel>
                    <Field type="radio" name="gender" value="male" />
                    Nam
                  </RadioLabel>
                  <RadioLabel>
                    <Field type="radio" name="gender" value="female" />
                    Nữ
                  </RadioLabel>
                  <RadioLabel>
                    <Field type="radio" name="gender" value="other" />
                    Khác
                  </RadioLabel>
                </RadioGroup>
                <ErrorMessage name="gender" component={ErrorText} />
              </FormGroup>
              
              {/* <FormGroup>
                <Label htmlFor="birthDate">Ngày Sinh</Label>
                <Input type="date" id="birthDate" name="birthDate" />
                <ErrorMessage name="birthDate" component={ErrorText} />
              </FormGroup> */}
            </FormRow>
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default ProfileForm;