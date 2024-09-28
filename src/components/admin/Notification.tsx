import React, { useEffect, useState } from 'react';
import { IPost } from '../../models/Posts';
import { List, Typography, Spin, Alert, DatePicker, Select, Avatar } from 'antd';
import { BellOutlined } from '@ant-design/icons';
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
    return <Spin size="large" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ padding: '20px', backgroundColor: '#f0f2f5', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Avatar icon={<BellOutlined />} size={64} style={{ backgroundColor: '#1890ff' }} />
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>Notifications</Title>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <RangePicker onChange={(dates) => handleDateChange(dates as [Dayjs, Dayjs] | null)} style={{ borderRadius: '10px', borderColor: '#1890ff' }} />
            <Select defaultValue="all" onChange={handleFilterChange} style={{ width: 120, borderRadius: '10px', borderColor: '#1890ff' }}>
              <Option value="all">All</Option>
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
              <Option value="private">Private</Option>
            </Select>
          </div>
        </div>
        {error && <Alert message={error} type="error" showIcon style={{ borderRadius: '10px' }} />}
        {filteredNotifications.length === 0 ? (
          <Alert message="No notifications found." type="info" showIcon style={{ borderRadius: '10px' }} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={filteredNotifications}
            renderItem={notification => (
              <List.Item
                style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}
              >
                <List.Item.Meta
                  title={<Title level={4} style={{ marginBottom: '0', color: '#1890ff' }}>{notification.title}</Title>}
                  description={
                    <>
                      <Text>{notification.description}</Text>
                      <br />
                      <Text type="secondary">Type: {notification.status}</Text>
                      <br />
                      <Text type="secondary">Created At: {moment(notification.createDate).format('DD/MM/YYYY HH:mm:ss')}</Text>
                    </>
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