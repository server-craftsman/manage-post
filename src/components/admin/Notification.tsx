import React, { useEffect, useState } from 'react';
import { IPost } from '../../models/Posts';
import { List, Typography, Spin, Alert, DatePicker, Select, Avatar, Tag } from 'antd';
import { BellOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Dayjs } from 'dayjs';
import 'moment/locale/vi';
import { motion } from 'framer-motion';
import { getAllPosts } from '../../services/posts';
moment.locale('vi');

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const allNotifications = await getAllPosts();
        setNotifications(allNotifications.sort((a, b) => moment(b.createDate).valueOf() - moment(a.createDate).valueOf()));
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
    if (dates) {
      const [start, end] = dates;
      setDateRange([moment(start.toDate()), moment(end.toDate())]);
    } else {
      setDateRange(null);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter !== 'all' && notification.status !== filter) {
      return false;
    }
    if (dateRange) {
      const notificationCreateDate = moment(notification.createDate);
      if (!notificationCreateDate.isSameOrAfter(dateRange[0], 'day') || !notificationCreateDate.isSameOrBefore(dateRange[1], 'day')) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', padding: '30px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', border: '1px solid #e8e8e8' }}>
            <Avatar icon={<BellOutlined />} size={80} style={{ backgroundColor: '#1890ff', boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)' }} />
            <Title level={2} style={{ margin: 0, color: '#1890ff', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>Notifications</Title>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', border: '1px solid #e8e8e8' }}>
            <RangePicker onChange={(dates) => handleDateChange(dates as [Dayjs, Dayjs] | null)} style={{ borderRadius: '10px', borderColor: '#1890ff', boxShadow: '0 2px 8px rgba(24, 144, 255, 0.15)' }} />
            <Select defaultValue="all" onChange={handleFilterChange} style={{ width: 150, borderRadius: '10px', borderColor: '#1890ff', boxShadow: '0 2px 8px rgba(24, 144, 255, 0.15)' }}>
              <Option value="all">All</Option>
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
              <Option value="private">Private</Option>
            </Select>
          </div>
        </div>
        {error && <Alert message={error} type="error" showIcon style={{ borderRadius: '10px', marginBottom: '20px' }} />}
        {filteredNotifications.length === 0 ? (
          <Alert message="No notifications found." type="info" showIcon style={{ borderRadius: '10px' }} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={filteredNotifications}
            renderItem={notification => (
              <List.Item
                style={{ padding: '30px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', marginBottom: '30px', border: '1px solid #e8e8e8', transition: 'all 0.3s ease' }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={notification.postImage || 'https://via.placeholder.com/150'}
                      alt="Post Image"
                      style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                    />
                  }
                  title={<Text strong style={{ fontSize: '22px', color: '#1890ff', textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>{notification.title}</Text>}
                  description={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Text style={{ fontSize: '16px', color: '#333' }}>{notification.description}</Text>
                      <Tag color={notification.status === 'published' ? 'green' : notification.status === 'draft' ? 'orange' : 'blue'} style={{ alignSelf: 'flex-start', padding: '5px 10px', borderRadius: '15px' }}>
                        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: '14px' }}>
                        <ClockCircleOutlined style={{ marginRight: '5px' }} />
                        Created At: {moment(notification.createDate).format('DD/MM/YYYY HH:mm:ss')}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Notification;