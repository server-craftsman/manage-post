import React from 'react';
import { Card, Image, Typography, Tag } from 'antd'; // Import Ant Design components
import { IPost } from '../../../models/Posts';
import { formatDate } from '../../../utils/formatDate';
import { Link } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface PostTypeProps {
  post: IPost;
}

const PostType: React.FC<PostTypeProps> = ({ post }) => {
  const createdAt = new Date(post.createDate);

  const cardStyle: React.CSSProperties = {
    width: '100%',
    height: '550px', // Fixed height
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    border: 'none',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
    display: 'flex',
    flexDirection: 'column',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
  };

  const contentStyle: React.CSSProperties = {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return '#52c41a';
      case 'draft':
        return '#faad14';
      case 'private':
        return '#f5222d';
      default:
        return '#d4af37';
    }
  };

  return (
    <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
      <Card
        hoverable
        style={cardStyle}
        cover={<Image src={post.postImage} alt={post.title} style={imageStyle} />}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        }}
      >
        <div style={contentStyle}>
          <div>
            <Tag color={getStatusColor(post.status)} style={{ marginBottom: '15px', borderRadius: '12px', padding: '2px 12px' }}>{post.status.toUpperCase()}</Tag>
            <Title level={4} style={{ marginBottom: 15, fontFamily: 'Playfair Display, serif', color: '#1a1a1a', fontSize: '22px', lineHeight: '1.3' }}>
              {post.title}
            </Title>
            <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 20, fontFamily: 'Poppins, sans-serif', color: '#4a4a4a', fontSize: '14px' }}>
              {post.description}
            </Paragraph>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '14px', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Author ID: {post.userId}</Text>
            <Text type="secondary" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}>
              <ClockCircleOutlined style={{ marginRight: 5 }} /> {formatDate(createdAt)}
            </Text>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default PostType;
