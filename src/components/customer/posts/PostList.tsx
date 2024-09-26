import React, { useEffect, useState } from 'react';
import { Spin, Alert, Row, Col } from 'antd'; // Removed Pagination component
import { IPost } from '../../../models/Posts';
import PostType from './PostType';
import { fetchPosts } from '../../../services/posts';
import PaginationComponent from './PaginationComponent';

interface PostListProps {
  posts?: IPost[]; // Make posts optional
}

const PostList: React.FC<PostListProps> = ({ posts: initialPosts = [] }) => {
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // State for current page
  const [postsPerPage] = useState<number>(3); // State for posts per page, changed to 3

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

  // Calculate the posts to display on the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <>
      <Row gutter={[32, 32]} style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <Col span={24}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', marginBottom: '40px', fontSize: '48px', fontWeight: 'bold', color: '#000', textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)' }}>Explore Our Blog Posts</h2>
        </Col>
        {currentPosts.map(post => (
          <Col key={post.id} span={8}>
            <PostType post={post} />
          </Col>
        ))}
      </Row>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <PaginationComponent
          currentPage={currentPage}
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}

export default PostList;
