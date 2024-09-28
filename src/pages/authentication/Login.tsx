import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion'; // Import framer-motion
import { Form, Input, Button, Alert, Typography, Row, Col, message } from 'antd';

const { Title } = Typography;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const user = await login(values.email, values.password);
      if (user == null || !user.role) {
        throw new Error('Invalid user or role');
      }
      message.success('Login successful!');
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'customer') {
        navigate('/'); 
      } else {
        throw new Error('Unauthorized role');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <Row className="min-h-screen">
        {/* Left side - Logo */}
        <Col span={12} className="bg-indigo-600 flex items-center justify-center">
          <Link to="/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-48 h-48">
              <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
              <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
            </svg>
          </Link>
        </Col>

        {/* Right side - Login Form */}
        <Col span={12} className="bg-white flex items-center justify-center">
          <div className="w-full max-w-md p-8">
            <Title level={1} className="text-center text-gray-800">Welcome Back</Title>
            {error && (
              <div className="mb-4">
                <Alert message={error} type="error" showIcon />
              </div>
            )}
            <Form onFinish={handleSubmit} className="space-y-6">
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your Email!' }]}
              >
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full"
                    loading={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </div>
              </Form.Item>
              <Form.Item>
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  Don't have an account? 
                  <Link to="/register" style={{ fontSize: '18px', fontWeight: '600', color: '#d4af37', textDecoration: 'none' }}>
                    <span style={{ textDecoration: 'underline', marginLeft: '8px' }}>Register here</span>
                  </Link>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Login;