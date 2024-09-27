import { useState } from 'react';
import { Form, Input, Button, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { IUser } from '../../models/Users';
import { v4 as uuidv4 } from 'uuid';
import Compressor from 'compressorjs'; // Import Compressor.js

const Register = () => {
  const { register, error } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const navigate = useNavigate();

  const onFinish = async (values: { name: string; username: string; email: string; password: string; confirmPassword: string }) => {
    try {
      const { name, email, password, confirmPassword } = values;
      if (password !== confirmPassword) {
        message.error('Passwords do not match.');
        return;
      }
      if (!avatarFile) {
        message.error('Please upload your Avatar!');
        return;
      }
      const user: IUser = {
        id: uuidv4(), // Apply uuid library to generate id
        name,
        email,
        password,
        avatar: '', // Avatar will be handled separately
        role: 'customer',
        createDate: new Date(),
        updateDate: new Date()
      };
      await register(user.name, user.email, user.password, avatarFile, user.role, user.createDate, user.updateDate);
      message.success('Registration successful!');
      navigate('/login'); // Navigate to login page after successful registration
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Payload Too Large')) {
          message.error('Avatar image is too large. Please upload a smaller image.');
        } else {
          message.error(err.message);
        }
      } else {
        message.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Logo Spinner */}
      <div className="w-1/2 bg-indigo-600 flex items-center justify-center">
        <Link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-48 h-48 animate-spin">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
          </svg>
        </Link>
      </div>

      {/* Right side - Register Form */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h2 className="text-center text-2xl font-bold mb-6">Register Your Account</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Form
            name="register"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            className="space-y-6"
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Please input your Name!' },
                { min: 3, message: 'Name must be at least 3 characters long!' }
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid Email!' }
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
                { min: 6, message: 'Password must be at least 6 characters long!' }
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: 'Please confirm your Password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item
              name="avatar"
              rules={[{ required: true, message: 'Please upload your Avatar!' }]}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                fileList={fileList}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('You can only upload image files!');
                    return Upload.LIST_IGNORE;
                  }
                  const isLt1024GB = file.size / 1024 / 1024 / 1024 < 1024;
                  if (!isLt1024GB) {
                    message.error('Image must be smaller than 1024GB!');
                    return Upload.LIST_IGNORE;
                  }
                  new Compressor(file, {
                    quality: 0.5, // Adjust the quality as needed
                    success: (compressedFile) => {
                      setAvatarFile(compressedFile as File); // Set the compressed file to state
                      setFileList([compressedFile]); // Update fileList state
                    },
                    error: () => {
                      message.error('Failed to compress image. Please try again.');
                    },
                  });
                  return false;
                }}
              >
                {avatarFile ? (
                  <img src={URL.createObjectURL(avatarFile)} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;