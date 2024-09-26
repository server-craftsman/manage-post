import React, { useEffect, useState } from 'react';
import { Spin, Alert, Row, Col } from 'antd'; // Import Ant Design components
import { IPost } from '../../../models/Posts';
import PostType from './PostType';
import { fetchPosts } from '../../../services/posts';

interface PostListProps {
  posts?: IPost[]; // Make posts optional
}

const PostList: React.FC<PostListProps> = ({ posts: initialPosts = [] }) => {
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts.filter(post => post.status === 'published'));
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <h2 style={{ fontFamily: 'pop, serif', textAlign: 'center', marginBottom: '20px', fontSize: '36px', fontWeight: 'bold', color: '#d4af37', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Posts</h2>
      </Col>
      {posts.map(post => (
        <Col key={post.id} span={8}>
          <PostType post={post} />
        </Col>
      ))}
    </Row>
  );
}

export default PostList;
