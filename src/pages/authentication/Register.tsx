import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { IUser } from '../../models/Users';
import { v4 as uuidv4 } from 'uuid';
import Compressor from 'compressorjs'; // Import Compressor.js

const Register = () => {
  const { register, error } = useAuth(); // Include error from useAuth
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const navigate = useNavigate(); // Use navigate hook from react-router-dom

  const onFinish = async (values: { name: string; username: string; email: string; password: string; confirmPassword: string }) => {
    try {
      const { name, email, password, confirmPassword } = values;
      if (password !== confirmPassword) {
        message.error('Passwords do not match.');
        return;
      }
      if (!avatarBase64) {
        message.error('Please upload your Avatar!');
        return;
      }
      const user: IUser = {
        id: uuidv4(), // Apply uuid library to generate id
        name,
        email,
        password,
        avatar: avatarBase64,
        role: 'customer',
        createDate: new Date(),
        updateDate: new Date()
      };
      const avatarFile = new File([user.avatar], "avatar.jpg", { type: "image/jpeg" });
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
          <h2 className="text-center text-2xl font-bold mb-6">Register</h2>
          {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}
          <Form
            name="register"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            className="space-y-6"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your Name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your Password!' }]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item
              name="avatar"
              rules={[{ required: true, message: 'Please upload your Avatar!' }]}
            >
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 1024 * 1024 * 1024 * 1024) {
                      message.error('Avatar image is too large. Please upload a smaller image.');
                      return;
                    }
                    new Compressor(file, {
                      quality: 0.6, // Adjust the quality as needed
                      success: (compressedFile) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64String = reader.result as string;
                          setAvatarBase64(base64String); // Set the base64 string to state
                        };
                        reader.readAsDataURL(compressedFile);
                      },
                      error: (err) => {
                        message.error('Failed to compress image. Please try again.');
                      },
                    });
                  }
                }}
              />
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