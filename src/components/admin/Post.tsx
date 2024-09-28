import React from 'react';
import { IPost } from '../../models/Posts';
import { Table, Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ManageBlogsProps {
  posts: IPost[];
  loading: boolean;
  error: string | null;
}

const ManageBlogs: React.FC<ManageBlogsProps> = ({ posts, loading, error }) => {
  const navigate = useNavigate();

  const handleViewDetails = (postId: string) => {
    navigate(`/admin/post-detail/${postId}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large">
          <div>Loading...</div>
        </Spin>
      </div>
    );
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
        <Table.Column title="Author ID" dataIndex="userId" key="userId" className="py-2 px-4 border-b" />
        <Table.Column title="Created At" dataIndex="createDate" key="createDate" className="py-2 px-4 border-b" render={(text) => new Date(text).toLocaleDateString()} />
        <Table.Column
          title="Actions"
          key="actions"
          className="py-2 px-4 border-b"
          render={(post: IPost) => (
            <Button
              type="default"
              onClick={() => handleViewDetails(post.id.toString())}
              style={{ backgroundColor: "#4B0082", borderColor: "#4B0082", color: "#fff", fontWeight: "bold", padding: "10px 20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
            >
              View Details
            </Button>
          )}
        />
      </Table>
    </div>
  );
};

export default ManageBlogs;