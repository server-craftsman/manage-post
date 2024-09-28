import React, { useEffect, useState } from 'react';
import { Card, Image, Typography, Spin, Button, Divider, Avatar, Alert } from 'antd';
import { IPost } from '../../../models/Posts';
import { formatDate } from '../../../utils/formatDate';
const { Title, Paragraph, Text } = Typography;
import { ArrowLeftOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import defaultAvatar from '../../../asset/default-avatar.png';
const PostDetail: React.FC = () => {
  const { getPostById } = useAuth();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    try {
      const fetchedPost = await getPostById(id);
      setPost(fetchedPost);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!post) {
    return <div style={{ textAlign: 'center', fontSize: '24px', color: '#555', marginTop: '50px' }}>Post not found</div>;
  }

  // const createdAt = new Date(post.createDate);
  const updatedAt = new Date(post.updateDate);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', 
      minHeight: '100vh', 
      padding: '60px 20px'
    }}>
      <Card 
        hoverable
        style={{ 
          maxWidth: '1000px', 
          margin: '0 auto',
          marginBottom: '40px', 
          textAlign: 'left', 
          border: 'none',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <Image 
          src={post.postImage} 
          alt={post.title} 
          style={{ 
            marginBottom: '30px', 
            width: '100%', 
            height: '500px', 
            objectFit: 'cover', 
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }} 
        />
        <Title level={1} style={{ 
          marginBottom: '20px', 
          fontFamily: 'Playfair Display, serif', 
          fontSize: '48px',
          color: '#333',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          {post.title}
        </Title>
        {post.userId && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'linear-gradient(45deg, #B8860B, #DAA520)',
            padding: '10px 20px',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              src={defaultAvatar}
              style={{ 
                marginRight: '15px',
                border: '2px solid #FFD700',
                backgroundColor: '#FFFFFF'
              }} 
            />
            <Text strong style={{ 
              fontSize: '16px', 
              color: '#FFFFFF', 
              fontFamily: 'Playfair Display, serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Author ID: {post.userId || 'Anonymous Connoisseur'}
            </Text>
          </div>
        )}
        <Paragraph style={{ 
          marginBottom: '30px', 
          whiteSpace: 'pre-wrap', 
          fontFamily: 'Merriweather, serif',
          fontSize: '18px',
          lineHeight: '1.8',
          color: '#444'
        }}>
          {post.description}
        </Paragraph>
        <Divider style={{ margin: '30px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            <EditOutlined style={{ marginRight: '5px' }} />
            Last updated: {formatDate(updatedAt)}
          </Text>
          <Link to="/">
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined />} 
              size="large"
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                backgroundColor: '#fda085', 
                borderColor: '#fda085', 
                borderRadius: '30px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '0 25px'
              }}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default PostDetail;
