import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { IUser } from '../../models/Users';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion'; // Import framer-motion
import { Rule } from 'antd/lib/form'; // Import the Rule type from antd
const Register = () => {
  const { register, checkEmailExists, error } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (avatarFile) {
      setFileList([
        {
          uid: '-1',
          name: 'avatar',
          status: 'done',
          url: URL.createObjectURL(avatarFile),
        },
      ]);
    }
  }, [avatarFile]);

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
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        message.error('Email already exists. Please use another email.');
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

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setEmailError('Email already exists. Please use another email.');
      } else {
        setEmailError(null);
      }
    } catch (err) {
      setEmailError('Failed to check email');
    }
  };

  const handleAvatarChange = (info: any) => {
    const isImage = info.file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return;
    }
    const isLt1024GB = info.file.size / 1024 / 1024 / 1024 < 1024;
    if (!isLt1024GB) {
      message.error('Image must be smaller than 1024GB!');
      return;
    }
    setAvatarFile(info.file);
  };

  const getValidationRules = () => {
    return {
      name: [
        { required: true, message: 'Please input your Name!' },
        { min: 3, message: 'Name must be at least 3 characters long!' }
      ],
      email: [
        { required: true, message: 'Please input your Email!' },
        { type: 'email', message: 'Please enter a valid Email!' },
        { validator: async (_: any, value: string) => { // Explicitly type '_'
            if (value) {
              const emailExists = await checkEmailExists(value);
              if (emailExists) {
                return Promise.reject('Email already exists. Please use another email.');
              }
            }
            return Promise.resolve();
          }
        }
      ],
      password: [
        { required: true, message: 'Please input your Password!' },
        { min: 6, message: 'Password must be at least 6 characters long!' },
        { pattern: /^(?=.*[A-Z])(?=.*\d).{6,}$/, message: 'Password must contain at least one uppercase letter and one number!' }
      ],
      confirmPassword: [
        { required: true, message: 'Please confirm your Password!' },
        ({ getFieldValue }: { getFieldValue: (field: string) => string }) => ({
          validator(_: any, value: string) { // Explicitly type '_' and 'value'
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords do not match!'));
          },
        }),
      ],
      avatar: [
        { required: true, message: 'Please upload your Avatar!' }
      ]
    };
  };

  const validationRules = getValidationRules();

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
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
                rules={validationRules.name}
              >
                <Input placeholder="Name" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={validationRules.email as Rule[]}
                validateStatus={emailError ? 'error' : ''}
                help={emailError}
              >
                <Input placeholder="Email" onChange={handleEmailChange} />
              </Form.Item>

              <Form.Item
                name="password"
                rules={validationRules.password}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={validationRules.confirmPassword}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>

              <Form.Item
                name="avatar"
                rules={validationRules.avatar}
              >
                <div style={{ display: 'flex', justifyContent: 'left' }}>
                  <div style={{marginRight: '10px'}}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      beforeUpload={() => false}
                      onChange={handleAvatarChange}
                      fileList={fileList}
                      showUploadList={false}
                      style={{ width: '100%' }}
                    >
                      <Button style={{ width: '100%', height: '100%', borderRadius: '5px'}} icon={<UploadOutlined />}></Button>
                    </Upload>
                  </div>
                  {fileList.length > 0 && (
                    <div style={{marginBottom: '20px', marginLeft: '10px'}}>
                      <img
                        src={fileList[0].url}
                        alt="avatar"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }}
                      />
                      <Button
                        type="link"
                        onClick={() => {
                          setAvatarFile(null);
                          setFileList([]);
                        }}
                        style={{ display: 'block', marginTop: '10px' }}
                      >
                        <DeleteOutlined /> Remove
                      </Button>
                    </div>
                  )}
                </div>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Register
                </Button>
              </Form.Item>
              <Form.Item>
                <p style={{ fontSize: '18px', textAlign: 'center', color: '#4a5568' }}>
                  Already have an account? 
                  <Link to="/login" style={{ fontSize: '18px', fontWeight: '600', color: '#d4af37', textDecoration: 'none' }}>
                    <span style={{ textDecoration: 'underline', marginLeft: '8px' }}>Login here</span>
                  </Link>
                </p>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;