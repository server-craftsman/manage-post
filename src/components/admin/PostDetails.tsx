import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IPost } from '../../models/Posts';
import { getPostById, deletePost } from '../../services/posts';
import { Button, Spin, Alert, Typography, Image, Avatar } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { IUser } from '../../models/Users';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUserById } = useAuth();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (id) {
          const response = await getPostById(id);
          setPost(response);
          const userData = await getUserById(response.userId);
          setUser(userData);
        } else {
          setError('Invalid post ID');
        }
      } catch (err) {
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPost(null);
    } catch (err) {
      setError('Failed to delete post');
    }
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!post) {
    return <Alert message="Error" description="Post not found" type="error" showIcon />;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', backgroundColor: '#f8f8f8', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}>
      <Image
        src={post.postImage}
        alt={post.title}
        style={{
          marginBottom: '24px',
          width: '100%',
          height: 'auto',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
        }}
      />
      <Typography.Title level={1} style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px', color: '#1a1a1a', fontFamily: 'Playfair Display, serif' }}>
        {post.title}
      </Typography.Title>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <Avatar
          src={user?.avatar}
          size={60}
          style={{
            marginRight: '20px',
            border: '3px solid #D4AF37',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
          }}
        />
        <div>
          <Typography.Text strong style={{ fontSize: '20px', color: '#333', display: 'block' }}>
            {user?.name}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: '16px' }}>
            Author ID: {post.userId}
          </Typography.Text>
        </div>
      </div>
      <Typography.Paragraph style={{ marginBottom: '24px', fontSize: '18px' }}>
        <strong style={{ color: '#D4AF37' }}>Status:</strong> <span style={{ color: '#4a4a4a' }}>{post.status}</span>
      </Typography.Paragraph>
      <Typography.Paragraph style={{ marginBottom: '24px', fontSize: '18px' }}>
        <strong style={{ color: '#D4AF37' }}>Created:</strong> <span style={{ color: '#4a4a4a' }}>{new Date(post.createDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </Typography.Paragraph>
      <Typography.Paragraph style={{ marginBottom: '24px', fontSize: '18px' }}>
        <strong style={{ color: '#D4AF37' }}>Updated:</strong> <span style={{ color: '#4a4a4a' }}>{new Date(post.updateDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </Typography.Paragraph>
      <Typography.Paragraph style={{ marginBottom: '40px', fontSize: '20px', lineHeight: '1.8', color: '#333', fontFamily: 'Merriweather, serif' }}>
        {post.description}
      </Typography.Paragraph>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <Link to="/admin/manage-post">
          <Button
            type="default"
            style={{
              backgroundColor: "#3a3a3a",
              borderColor: "#3a3a3a",
              color: "#fff",
              fontWeight: "bold",
              padding: "12px 24px",
              borderRadius: "30px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              fontSize: "16px",
              transition: "all 0.3s ease"
            }}
            icon={<ArrowLeftOutlined />}
          >
            Back to Posts
          </Button>
        </Link>
        <Button
          type="primary"
          danger
          onClick={() => handleDelete(post.id)}
          style={{
            backgroundColor: "#D4AF37",
            borderColor: "#D4AF37",
            color: "#fff",
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "30px",
            boxShadow: "0 6px 12px rgba(212, 175, 55, 0.4)",
            fontSize: "16px",
            transition: "all 0.3s ease"
          }}
          icon={<DeleteOutlined />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default PostDetail;
