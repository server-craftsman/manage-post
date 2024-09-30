import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IUser } from '../../models/Users';
import { Form, Input, Upload, Button, Card, Avatar, Typography, message, Modal, Divider } from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined, LockOutlined, EditOutlined, KeyOutlined, CameraOutlined } from '@ant-design/icons';
import { Rule } from 'antd/es/form';
import Webcam from 'react-webcam';
const { Title, Text } = Typography;

const AdminProfile: React.FC = () => {
  const { user, updateUserProfile, checkEmailExists, checkOldEmail, checkOldPassword } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
      setAvatarUrl(user.avatar || '');
    }
  }, [user, form]);

  const handleSubmit = async (values: Partial<IUser>) => {
    if (!user) return;

    try {
      const updateData: Partial<IUser> = { ...values, avatar: avatarUrl };
      await updateUserProfile(user.id as string, updateData);
      setIsEditing(false);
      message.success('Profile updated successfully');
    } catch (err) {
      message.error('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (!user) return;

    if (values.newPassword !== values.confirmPassword) {
      message.error('New passwords do not match');
      return;
    }

    if (values.oldPassword === values.newPassword) {
      message.error('New password must be different from the old password');
      return;
    }

    try {
      const isOldPasswordCorrect = await checkOldPassword(values.oldPassword);
      if (!isOldPasswordCorrect) {
        message.error('Old password is incorrect');
        return;
      }

      await updateUserProfile(
        user.id as string,
        { password: values.newPassword }
      );
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
      message.success('Password updated successfully');
    } catch (err) {
      message.error('Failed to update password. Please try again.');
    }
  };

  const handleEmailChange = async (values: { oldEmail: string; newEmail: string; confirmNewEmail: string }) => {
    if (!user) return;

    if (values.newEmail !== values.confirmNewEmail) {
      message.error('New emails do not match');
      return;
    }

    try {
      const isOldEmailCorrect = await checkOldEmail(values.oldEmail);
      if (!isOldEmailCorrect) {
        message.error('Old email is incorrect');
        return;
      }

      if (values.newEmail === user.email) {
        message.error('New email must be different from the old email');
        return;
      }

      const emailExists = await checkEmailExists(values.newEmail);
      if (emailExists) {
        message.error('Email already exists');
        return;
      }

      await updateUserProfile(
        user.id as string,
        { email: values.newEmail }
      );
      setIsEmailModalVisible(false);
      emailForm.resetFields();
      message.success('Email updated successfully');
    } catch (err) {
      message.error('Failed to update email. Please try again.');
    }
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setAvatarUrl(imageSrc);
      setIsCameraModalVisible(false);
    }
  };

  const validateName = [
    { required: true, message: 'Please input your name!' }
  ];

  const validateEmail = [
    { required: true, message: 'Please input your email!' },
    { type: 'email', message: 'Please enter a valid email!' }
  ];

  const validateOldPassword = [
    { required: true, message: 'Please input your old password!' }
  ];

  const validateNewPassword = [
    { required: true, message: 'Please input your new password!' },
    { min: 6, message: 'Password must be at least 6 characters long!' },
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue('oldPassword') !== value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('New password must be different from the old password!'));
      },
    }),
  ];

  const validateConfirmPassword = [
    { required: true, message: 'Please confirm your new password!' },
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue('newPassword') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('The two passwords do not match!'));
      },
    }),
  ];

  const validateOldEmail = [
    { required: true, message: 'Please input your old email!' },
    { type: 'email', message: 'Please enter a valid email!' }
  ];

  const validateNewEmail = [
    { required: true, message: 'Please input your new email!' },
    { type: 'email', message: 'Please enter a valid email!' },
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (value === getFieldValue('oldEmail')) {
          return Promise.reject(new Error('New email must be different from the old email!'));
        }
        return Promise.resolve();
      },
    }),
    {
      validator: async (_: any, value: string) => {
        if (value) {
          const exists = await checkEmailExists(value);
          if (exists) {
            return Promise.reject(new Error('This email is already in use!'));
          }
        }
        return Promise.resolve();
      },
    },
  ];

  const validateConfirmNewEmail = [
    { required: true, message: 'Please confirm your new email!' },
    { type: 'email', message: 'Please enter a valid email!' },
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue('newEmail') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('The two emails do not match!'));
      },
    }),
  ];

  if (!user) return <Text>Please log in to view your profile.</Text>;

  return (
    <Card
      className="admin-profile"
      style={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        borderRadius: '15px',
        padding: '30px'
      }}
    >
      <Title level={2} style={{ textAlign: 'center', marginBottom: 30, color: '#1890ff' }}>Admin Profile</Title>
      {isEditing ? (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="avatar" style={{ textAlign: 'center' }}>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              onChange={handleAvatarChange}
            >
              {avatarUrl ? (
                <Avatar src={avatarUrl} size={102} />
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '1px dashed #d9d9d9'
                }}>
                  <UploadOutlined style={{ fontSize: '24px' }} />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <Button onClick={() => setIsCameraModalVisible(true)} size="large" icon={<CameraOutlined />}>Use Camera</Button>
          </Form.Item>
          <Form.Item
            name="name"
            rules={validateName as Rule[]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" size="large" />
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Form.Item
              name="email"
              rules={validateEmail as Rule[]}
              style={{ flex: 1, marginRight: '16px', marginBottom: 0 }}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" size="large" readOnly />
            </Form.Item>
            <Button onClick={() => setIsEmailModalVisible(true)} size="large" icon={<MailOutlined />}>Change Email</Button>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ marginRight: 8 }}>
              Save Changes
            </Button>
            <Button onClick={() => setIsEditing(false)} size="large" style={{ marginRight: 8 }}>Cancel</Button>
          </Form.Item>
        </Form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Avatar src={user.avatar} size={150} icon={<UserOutlined />} style={{ marginBottom: 20, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
          <Title level={3} style={{ marginBottom: 5 }}>{user.name}</Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>{user.email}</Text>
          <Divider style={{ margin: '20px 0' }} />
          <div style={{ marginTop: 30 }}>
            <Button type="primary" onClick={() => setIsEditing(true)} style={{ marginRight: 16 }} size="large" icon={<EditOutlined />}>
              Edit Profile
            </Button>
            <Button onClick={() => setIsPasswordModalVisible(true)} style={{ marginRight: 16 }} size="large" icon={<KeyOutlined />}>
              Change Password
            </Button>
          </div>
        </div>
      )}

      <Modal
        title={<Title level={4}>Change Password</Title>}
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={passwordForm} onFinish={handlePasswordChange} layout="vertical">
          <Form.Item
            name="oldPassword"
            rules={validateOldPassword}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Old Password" size="large" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={validateNewPassword}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="New Password" size="large" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={validateConfirmPassword}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={4}>Change Email</Title>}
        open={isEmailModalVisible}
        onCancel={() => setIsEmailModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={emailForm} onFinish={handleEmailChange} layout="vertical">
          <Form.Item
            name="oldEmail"
            rules={validateOldEmail as Rule[]}
          >
            <Input prefix={<MailOutlined />} placeholder="Old Email" size="large" />
          </Form.Item>
          <Form.Item
            name="newEmail"
            rules={validateNewEmail as Rule[]}
          >
            <Input prefix={<MailOutlined />} placeholder="New Email" size="large" />
          </Form.Item>
          <Form.Item
            name="confirmNewEmail"
            rules={validateConfirmNewEmail as Rule[]}
          >
            <Input prefix={<MailOutlined />} placeholder="Confirm New Email" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Change Email
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={4}>Capture Image</Title>}
        open={isCameraModalVisible}
        onCancel={() => setIsCameraModalVisible(false)}
        footer={null}
        centered
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
        />
        <Button type="primary" onClick={handleCapture} size="large" block>
          Capture
        </Button>
      </Modal>
    </Card>
  );
};

export default AdminProfile;
