import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IPost } from '../../models/Posts';
import { getPostById, deletePost } from '../../services/posts';
import { Button, Spin, Alert } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(id!);
        setPost(response);
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
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!post) {
    return <Alert message="Error" description="Post not found" type="error" showIcon />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Title: {post.title}</h1>
      <p className="mb-4"><strong>Author:</strong> {post.userId}</p>
      <img src={post.postImage} alt={post.title} className="mb-4" />
      <p className="mb-4"><strong>Status:</strong> {post.status}</p>
      <p className="mb-4"><strong>Created At:</strong> {new Date(post.createDate).toLocaleDateString()}</p>
      <p className="mb-4"><strong>Updated At:</strong> {new Date(post.updateDate).toLocaleDateString()}</p>
      <p className="mb-8">{post.description}</p>
      
      <Link to="/admin/manage-post">
        <Button type="default" style={{ backgroundColor: "#0000FF", borderColor: "#0000FF", marginRight: "10px", color: "#fff", fontWeight: "bold", padding: "10px 20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} icon={<ArrowLeftOutlined />}>Back to Posts</Button>
      </Link>
      <Link to={`/admin/manage-post`}>
      <Button type="primary" danger onClick={() => handleDelete(post.id.toString())} style={{ backgroundColor: "#FF0000", borderColor: "#FF0000", color: "#fff", fontWeight: "bold", padding: "10px 20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} icon={<DeleteOutlined />}>Delete</Button>
      </Link>
    </div>
  );
};

export default PostDetail;
