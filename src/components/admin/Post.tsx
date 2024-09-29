import React from 'react';
import { IPost } from '../../models/Posts';
import { Table, Button, Spin, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'green';
      case 'draft':
        return 'red';
      case 'private':
        return 'yellow';
      default:
        return 'default';
    }
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
    if (description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Blogs</h1>

      <Table dataSource={posts} rowKey="id" className="min-w-full bg-white">
        <Table.Column title="ID" dataIndex="id" key="id" className="py-2 px-4 border-b" />
        <Table.Column title="Title" dataIndex="title" key="title" className="py-2 px-4 border-b" />
        <Table.Column title="Author ID" dataIndex="userId" key="userId" className="py-2 px-4 border-b" />
        <Table.Column 
          title="Description" 
          dataIndex="description" 
          key="description" 
          className="py-2 px-4 border-b"
          render={(description: string) => truncateDescription(description)}
        />
        <Table.Column 
          title="Status" 
          dataIndex="status" 
          key="status" 
          className="py-2 px-4 border-b"
          render={(status: string) => (
            <Tag color={getStatusColor(status)} key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column title="Created At" dataIndex="createDate" key="createDate" className="py-2 px-5 border-b" render={(text) => formatDate(new Date(text))} />
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