import React, { useState, useEffect } from 'react';
import { IPost } from '../../models/Posts';
import { getAllPosts} from '../../services/posts';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ManageBlogs: React.FC = () => {
  // Removed the unused 'user' variable
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllPosts();
        setPosts(response);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);



  const handleViewDetails = (postId: string) => {
    navigate(`/admin/post-detail/${postId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Blogs</h1>
      <Table dataSource={posts} rowKey="id" className="min-w-full bg-white">
        <Table.Column title="ID" dataIndex="id" key="id" className="py-2 px-4 border-b" />
        <Table.Column title="Title" dataIndex="title" key="title" className="py-2 px-4 border-b" />
        <Table.Column title="Author" dataIndex="userId" key="userId" className="py-2 px-4 border-b" />
        <Table.Column title="Created At" dataIndex="createDate" key="createDate" className="py-2 px-4 border-b" render={(text) => new Date(text).toLocaleDateString()} />
        <Table.Column
          title="Actions"
          key="actions"
          className="py-2 px-4 border-b"
          render={( post: IPost) => (
            <>
              
              <Button type="default" onClick={() => handleViewDetails(post.id.toString())}>View Details</Button>
            </>
          )}
        />
      </Table>
    </div>
  );
};

export default ManageBlogs;