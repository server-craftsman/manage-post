import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../services/auth';
import { getAllPosts } from '../../services/posts';
import { IUser } from '../../models/Users';
import { IPost } from '../../models/Posts';
import { Card, Statistic, Row, Col } from 'antd';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/unauthorized');
    } else {
      fetchData(); 
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [users, posts] = await Promise.all([getAllUsers(), getAllPosts()]);
      setUsers(users);
      setPosts(posts);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  const data = {
    labels: ['Users', 'Posts'],
    datasets: [
      {
        label: 'Statistics',
        data: [users.length, posts.length],
        backgroundColor: ['#1890ff', '#52c41a'],
      },
    ],
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f2f5' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic title="Total Users" value={users.length} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Total Posts" value={posts.length} />
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: '30px' }}>
        <Card>
          <Bar data={data} />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;