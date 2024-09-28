import React, { useEffect, useState } from 'react';
import { Spin, Alert, Row, Col, Typography } from 'antd';
import { IPost } from '../../../models/Posts';
import PostType from './PostType';
import { fetchPosts } from '../../../services/posts';
import PaginationComponent from './PaginationComponent';

const { Title } = Typography;

interface PostListProps {
  posts?: IPost[];
}

const PostList: React.FC<PostListProps> = ({ posts: initialPosts = [] }) => {
  const [posts, setLocalPosts] = useState<IPost[]>(initialPosts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(3);
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        const publishedPosts = fetchedPosts.filter(post => post.status === 'published');
        setLocalPosts(publishedPosts
          .map(post => ({
            ...post,
          }))
          .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon style={{ maxWidth: '600px', margin: '40px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />;
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', minHeight: '100vh', padding: '60px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
        <Title level={1} style={{ fontFamily: 'Playfair Display, serif', textAlign: 'center', marginBottom: '50px', fontSize: '52px', fontWeight: 'bold', color: '#333', textShadow: '2px 2px 4px rgba(0,0,0,0.1)', letterSpacing: '1px' }}>
          Explore Our Exquisite Blog Posts
        </Title>
        <Row gutter={[32, 32]}>
          {currentPosts.map(post => (
            <Col key={post.id} xs={24} sm={24} md={8} lg={8}>
              <div style={{ height: '570px', marginBottom: '1px' }}> {/* Adjusted height */}
                <PostType post={post} />
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        <PaginationComponent
          currentPage={currentPage}
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default PostList;
