import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Image, Typography, Spin, Button } from 'antd';
import { IPost } from '../../../models/Posts';
import { formatDate } from '../../../utils/formatDate';
import { getPostById } from '../../../services/posts';
const { Title, Paragraph, Text } = Typography;
import { ArrowLeftOutlined } from '@ant-design/icons';
const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (id) { 
          const fetchedPost = await getPostById(id);
          setPost(fetchedPost);
        } else {
          throw new Error("Post ID is undefined");
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        navigate('/posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const style: React.CSSProperties = {
    width: '100%', marginBottom: 10, fontFamily: 'Poppins, sans-serif', textAlign: 'left'  
};

  if (loading) {
    return <Spin size="large" />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const createdAt = new Date(post.createDate);
  const updatedAt = new Date(post.updateDate);

  return (
    <Card hoverable={true} style={{ marginBottom: 10, textAlign: 'left', height: '100%', marginTop: '20px', border: '2px solid #e0e0e0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Image src={post.postImage} alt={post.title} style={{ marginBottom: 10, width: '100vw', height: '400px', objectFit: 'cover', borderRadius: '10px' }} />
      <Title level={2} style={{ width: '100%', marginBottom: 10, fontFamily: 'Merriweather, serif', textAlign: 'left' }}>{post.title}</Title>
      <Paragraph style={{ width: '100%', marginBottom: 10, whiteSpace: 'pre-wrap', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}>{post.description}</Paragraph>
      <Text type="secondary" style={style}>Status: {post.status}</Text>
      <br />
      <Text type="secondary" style={style}>Post By User: {post.userId}</Text>
      <br />
      <Text type="secondary" style={style}>Created At: {formatDate(createdAt)}</Text>
      <br />
      <Text type="secondary" style={style}>Updated At: {formatDate(updatedAt)}</Text>
      <br />
      <Link to="/">
        <Button type="primary" icon={<ArrowLeftOutlined />} style={{ marginTop: 20, fontFamily: 'Poppins, sans-serif', backgroundColor: '#1890ff', borderColor: '#1890ff', borderRadius: '5px' }}>Back to Posts</Button>
      </Link>
    </Card>
  );
}

export default PostDetail;
