import React from 'react';
import { Card, Image, Typography } from 'antd'; // Import Ant Design components
import { IPost } from '../../../models/Posts';
import { formatDate } from '../../../utils/formatDate';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

interface PostTypeProps {
  post: IPost;
}

const PostType: React.FC<PostTypeProps> = ({ post }) => {
  const createdAt = new Date(post.createDate);
  const updatedAt = new Date(post.updateDate);

  const cardStyle: React.CSSProperties = {
    marginBottom: '10px',
    textAlign: 'left',
    height: '100%',
    borderRadius: '10px',
    transition: 'transform 0.3s',
  };

  const imageStyle: React.CSSProperties = {
    marginBottom: '10px',
    width: '100vw',
    height: '200px',
    objectFit: 'cover',
  };

  return (
    <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
      <Card hoverable style={cardStyle} onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
        <Image src={post.postImage} alt={post.title} style={imageStyle} />
        <Title level={4} style={{ width: '100%', marginBottom: 10 }}>{post.title}</Title>
        <Paragraph ellipsis={{ rows: 2 }} style={{ width: '100%', marginBottom: 10 }}>{post.description}</Paragraph>
        <Text type="secondary" style={{ width: '100%', marginBottom: 10 }}>Status: {post.status}</Text>
        <br />
        <Text type="secondary" style={{ width: '100%', marginBottom: 10 }}>Post By User: {post.userId}</Text>
        <br />
        <Text type="secondary" style={{ width: '100%', marginBottom: 10 }}>Created At: {formatDate(createdAt)}</Text>
        <br />
        <Text type="secondary" style={{ width: '100%', marginBottom: 10 }}>Updated At: {formatDate(updatedAt)}</Text>
      </Card>
    </Link>
  );
}

export default PostType;
