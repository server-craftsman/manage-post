import React from 'react';
import { Layout, Menu } from 'antd';
import {
  NotificationOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  OrderedListOutlined,
  FundOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Sider } = Layout;
import { useAuth } from '../../context/AuthContext';
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Sider width={250} style={{ background: '#ffffff', borderRight: '1px solid #d9d9d9' }}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <SettingOutlined style={{ fontSize: '120px', marginBottom: '10px', color: '#000000' }} />
        <h2 style={{ color: '#000000', fontWeight: 'bold' }}>Admin Panel</h2>
      </div>
      <Menu
        mode="vertical"
        defaultSelectedKeys={['1']}
        style={{ background: '#ffffff', color: '#000000', borderRight: 0 }}
      >
        
        <Menu.Item key="2" icon={<FundOutlined style={{ color: '#000000' }} />}>
          Overview
        </Menu.Item>
        <Menu.Item key="3" icon={<TeamOutlined style={{ color: '#000000' }} />}>
          Users
        </Menu.Item>
        <Menu.Item key="4" icon={<OrderedListOutlined style={{ color: '#000000' }} />}>
          Posts
        </Menu.Item>
        <Menu.Item key="5" icon={<NotificationOutlined style={{ color: '#000000' }} />}>
          Notifications
        </Menu.Item>
        <Menu.Item key="7" icon={<LogoutOutlined style={{ color: '#000000' }} />}>
          <span onClick={handleLogout}>Logout</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Navbar;
