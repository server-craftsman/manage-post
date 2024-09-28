import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal, Button, Input, Select, Upload, message, Typography, Form, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IUser } from '../../models/Users';
import { Rule } from 'antd/lib/form'; // Import the Rule type from antd
const { Option } = Select;
const { Title, Text } = Typography;

interface RegisterUserProps {
  addUser: (newUser: IUser) => void;
}

const RegisterUser: React.FC<RegisterUserProps> = ({ addUser }) => {
  const { createUser, checkEmailExists } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [role, setRole] = useState('customer');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!avatar) {
      setError('Avatar is required');
      return;
    }
    setLoading(true);
    try {
      const newUser: IUser | null = await createUser({ name, email, password, avatar, role, createDate: new Date(), updateDate: new Date() });
      if (newUser) {
        addUser(newUser);
        setIsModalOpen(false);
        message.success('User created successfully');
      } else {
        message.error('Failed to create user');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create user');
      }
      setLoading(false);
    }
  };

  const handleAvatarChange = (info: any) => {
    const isImage = info.file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return;
    }
    const isLt2M = info.file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string); // Set base64 string
    };
    reader.onerror = () => {
      message.error('Failed to read avatar file');
    };
    reader.readAsDataURL(info.file); // Use info.file directly
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
    if (email) {
      try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          setError('Email already exists. Please use another email.');
        } else {
          setError(null);
        }
      } catch (err) {
        setError('Failed to check email');
      }
    }
  };

  const getValidationRules = () => {
    return {
      name: [
        { required: true, message: 'Please input your name!' },
        { min: 3, message: 'Name must be at least 3 characters long' }
      ],
      email: [
        { required: true, message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' },
        { validator: checkEmailExists, message: 'Email already exists' }
      ],
      password: [
        { required: true, message: 'Please input your password!' },
        { min: 6, message: 'Password must be at least 6 characters long' },
        { pattern: /^(?=.*[A-Z])(?=.*\d).{6,}$/, message: 'Password must contain at least one uppercase letter and one number' }
      ],
      role: [
        { required: true, message: 'Please select a role!' }
      ],
      avatar: [
        { required: true, message: 'Please upload an avatar!' }
      ]
    };
  };

  const validationRules = getValidationRules();

  return (
    <div style={{ padding: '10px' }}>
      <Button 
        type="primary" 
        onClick={() => setIsModalOpen(true)} 
        style={{ 
          marginBottom: '10px', 
          backgroundColor: '#4B0082', 
          borderColor: '#4B0082', 
          color: '#fff', 
          fontWeight: 'bold', 
          padding: '10px 20px', 
          borderRadius: '10px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' 
        }}
      >
        Create Account
      </Button>
      <Modal
        title={<Title level={3} style={{ textAlign: 'center' }}>Create Account</Title>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        {error && <Text type="danger" style={{ marginBottom: '20px', display: 'block' }}>{error}</Text>}
        <Form layout="vertical" onFinish={handleRegister}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={validationRules.name}
              >
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={validationRules.email as Rule[]}
              >
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={validationRules.password}
              >
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={validationRules.role}
              >
                <Select
                  value={role}
                  onChange={(value) => setRole(value)}
                >
                  <Option value="customer">Customer</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Avatar"
            name="avatar"
            rules={validationRules.avatar}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              beforeUpload={() => false}
              onChange={handleAvatarChange}
              showUploadList={false}
            >
              {avatar ? (
                <img src={avatar} alt="avatar" style={{ width: '100%' }} />
              ) : (
                <UploadOutlined />
              )}
            </Upload>
          </Form.Item>
          <Row justify="end">
            <Button key="back" onClick={() => setIsModalOpen(false)} style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button key="submit" type="primary" loading={loading} htmlType="submit">
              Create
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default RegisterUser;