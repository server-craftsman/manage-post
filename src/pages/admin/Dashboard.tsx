import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../services/auth';
import { getAllPosts } from '../../services/posts';
import { IUser } from '../../models/Users';
import { IPost } from '../../models/Posts';
import { Card, Statistic, Row, Col, Typography, Alert, Spin } from 'antd';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const { Title } = Typography;

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]); 
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Spin tip="Loading..." style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  }

  const barData = {
    labels: ['Users', 'Posts'],
    datasets: [
      {
        label: 'Statistics',
        data: [users.length, posts.length],
        backgroundColor: ['#1890ff', '#52c41a'],
      },
    ],
  };

  const pieData = {
    labels: ['Users', 'Posts'],
    datasets: [
      {
        label: 'Statistics',
        data: [users.length, posts.length],
        backgroundColor: ['#1890ff', '#52c41a'],
      },
    ],
  };

  const lineData = {
    labels: ['Users', 'Posts'],
    datasets: [
      {
        label: 'Statistics',
        data: [users.length, posts.length],
        borderColor: '#1890ff',
        fill: false,
      },
    ],
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f2f5', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px', color: '#001529' }}>Admin Dashboard</Title>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} />}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Statistic title="Total Users" value={users.length} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Statistic title="Total Posts" value={posts.length} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
       
        <Col xs={24}>
          <Card style={{ height: '300px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Bar data={barData} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card style={{ height: '500px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Pie data={pieData} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card style={{ height: '550px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Line data={lineData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;