import React, { useEffect, useState } from 'react';
import { Spin, Alert, Row, Col, Button, Modal, Form, Input, Upload, message, Dropdown } from 'antd';
import { IPost } from '../../../models/Posts';
import PostType from './PostType';
import { fetchPosts } from '../../../services/posts';
import PaginationComponent from './PaginationComponent';
import { useAuth } from '../../../context/AuthContext';
import { UploadOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';

interface PostListProps {
  posts?: IPost[];
}

const PostList: React.FC<PostListProps> = ({ posts: initialPosts = [] }) => {
  const { user, deletePost, updatePost, setPosts } = useAuth();
  const [posts, setLocalPosts] = useState<IPost[]>(initialPosts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(3);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editForm] = Form.useForm();
  const [postImage, setPostImage] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        const publishedPosts = fetchedPosts.filter(post => post.status === 'published');
        setLocalPosts(publishedPosts.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()));
      } catch (err) {
        setError(err as string);
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

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setLocalPosts(posts.filter(post => post.id !== postId));
      setIsDeleteModalVisible(false);
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const handleEdit = async (values: any) => {
    try {
      if (selectedPostId) {
        const updatedPost: IPost = {
          ...values,
          id: selectedPostId,
          updateDate: new Date(),
        };

        const postImageUrl = postImage ? postImage : '';
        await updatePost({ ...updatedPost, postImage: postImageUrl });
        setLocalPosts(posts.map(post => (post.id === selectedPostId ? updatedPost : post)));
        setPosts(posts.map(post => (post.id === selectedPostId ? updatedPost : post)));
        setIsEditModalVisible(false);
        setSelectedPostId(null);
        setPostImage(null);
        message.success('Post updated successfully');
      }
    } catch (err) {
      message.error('Failed to update post. Please try again later.');
    }
  };

  const showDeleteModal = (postId: string) => {
    setSelectedPostId(postId);
    setIsDeleteModalVisible(true);
  };

  const showEditModal = (post: IPost) => {
    setSelectedPostId(post.id);
    editForm.setFieldsValue(post);
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
    setIsEditModalVisible(false);
    setSelectedPostId(null);
    setPostImage(null);
  };

  const handleImageChange = (info: any) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = () => {
        setPostImage(reader.result as string);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const getMenuItems = (post: IPost) => [
    {
      key: 'edit',
      label: 'Edit',
      onClick: () => showEditModal(post),
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: () => showDeleteModal(post.id),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <>
      <Row gutter={[32, 32]} style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <Col span={24}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', marginBottom: '40px', fontSize: '36px', fontWeight: 'bold', color: '#000' }}>Explore Our Blog Posts</h2>
        </Col>
        {currentPosts.map(post => (
          <Col key={post.id} span={8}>
            <PostType post={post} />
            {user && user.id === post.userId && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Dropdown
                  menu={{
                    items: getMenuItems(post),
                  }}
                >
                  <Button type="link" icon={<MoreOutlined />} style={{ color: '#000', position: 'absolute', top: 0, right: 10, fontSize: 24, backgroundColor: '#fff', borderRadius: '50%' }} />
                </Dropdown>
              </div>
            )}
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
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={() => handleDelete(selectedPostId!)}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
      <Modal
        title="Edit Post"
        open={isEditModalVisible}
        onOk={() => editForm.submit()}
        onCancel={handleCancel}
        okText="Save"
      >
        <Form form={editForm} onFinish={handleEdit} layout="vertical">
          <Form.Item label="Post Image" required style={{ width: '100%' }}>
            <Upload
              name="postImage"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={(file) => {
                if (!file.type.startsWith('image/')) {
                  message.error('You can only upload image files!');
                  return Upload.LIST_IGNORE;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  setPostImage(reader.result as string);
                };
                reader.readAsDataURL(file);
                return false;
              }}
              onChange={handleImageChange}
              disabled={!!postImage}
            >
              {!postImage ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <UploadOutlined style={{ fontSize: '24px', color: '#000' }} />
                  <div style={{ marginTop: 8, color: '#000' }}>Upload</div>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', borderRadius: '15px' }}>
                  <img src={postImage} alt="post" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Button
                    type="link"
                    onClick={() => setPostImage(null)}
                    style={{ color: '#fff', fontSize: 20, position: 'absolute', top: 0, right: 0 }}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PostList;
