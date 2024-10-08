import React from 'react';
import { Layout, Menu, Badge } from 'antd';
import {
  NotificationOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  OrderedListOutlined,
  FundOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
const { Sider } = Layout;
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const SidebarAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { newNotificationsCount, resetNewNotificationsCount } = useNotification();

  const handleLogout = async () => {
    await logout();
  };

  const handleNotificationClick = useCallback(() => {
    resetNewNotificationsCount();
    navigate('/admin/notification');
  }, [resetNewNotificationsCount, navigate]);

  const menuItems = [
    {
      key: '2',
      icon: <FundOutlined style={{ color: '#000000' }} />,
      label: 'Overview',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      key: '3',
      icon: <TeamOutlined style={{ color: '#000000' }} />,
      label: <Link to="/admin/manage-users">Manage Users</Link>,
    },
    {
      key: '4',
      icon: <OrderedListOutlined style={{ color: '#000000' }} />,
      label: <Link to="/admin/manage-post">Manage Posts</Link>,
    },
    {
      key: '5',
      icon: (
        <Badge count={newNotificationsCount} offset={[10, 0]}>
          <NotificationOutlined style={{ color: '#000000' }} />
        </Badge>
      ),
      label: <span onClick={handleNotificationClick}>Notification</span>,
    },
    {
      key: '6',
      icon: <UserOutlined style={{ color: '#000000' }} />,
      label: <Link to="/admin/manage-profile">Manage Profile</Link>,
    },
    {
      key: '7',
      icon: <LogoutOutlined style={{ color: '#000000' }} />,
      label: (
        <span onClick={handleLogout}>
          <Link to="/login">Logout</Link>
        </span>
      ),
    },
  ];

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
        items={menuItems}
      />
    </Sider>
  );
};

export default SidebarAdmin;
