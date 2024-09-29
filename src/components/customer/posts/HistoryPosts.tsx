import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IPost } from '../../../models/Posts';
import * as postService from '../../../services/posts';
import { List, Typography, Image, Spin, Alert, Select, DatePicker, Avatar, Button, Modal, Form, Input, Upload, message, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { Dayjs } from 'dayjs';
import { formatDate } from '../../../utils/formatDate';
import 'moment/locale/vi';
import { motion } from 'framer-motion';
moment.locale('vi');

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const HistoryPost: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<IPost | null>(null);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user) {
        try {
          const allPosts = await postService.getAllPosts();
          const userPosts = allPosts.filter(post => post.userId === user.id);
          setPosts(userPosts);
        } catch (err) {
          setError('Failed to fetch user posts');
          console.error('Failed to fetch user posts', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
    if (dates) {
      const [start, end] = dates;
      setDateRange([moment(start.toDate()), moment(end.toDate())] as [Moment, Moment]);
    } else {
      setDateRange(null);
    }
  };

  const handleEditPost = (post: IPost) => {
    setCurrentPost(post);
    setIsModalVisible(true);
    setFileList(post.postImage ? [{ uid: '-1', name: 'image.png', status: 'done', url: post.postImage }] : []);
    message.info('Editing post...');
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      message.success('Post deleted successfully');
    } catch (err) {
      setError('Failed to delete post');
      console.error('Failed to delete post', err);
      message.error('Failed to delete post');
    }
  };

  const handleStatusChange = async (postId: string, status: string) => {
    try {
      const postToUpdate = posts.find(post => post.id === postId);
      if (postToUpdate) {
        const updatedPost = { ...postToUpdate, status, updateDate: new Date() };
        await postService.updatePost(updatedPost);
        setPosts(posts.map(post => (post.id === postId ? updatedPost : post)));
        message.success(`Post status updated to ${status}`);
      }
    } catch (err) {
      setError('Failed to update post status');
      console.error('Failed to update post status', err);
      message.error('Failed to update post status');
    }
  };

  const handleModalOk = async (values: any) => {
    if (currentPost) {
      try {
        const updatedPost = { ...currentPost, ...values, updateDate: new Date() };
        if (postImage) {
          updatedPost.postImage = postImage;
        } else if (fileList.length === 0) {
          updatedPost.postImage = null;
        }
        await postService.updatePost(updatedPost);
        setPosts(posts.map(post => (post.id === currentPost.id ? updatedPost : post)));
        setIsModalVisible(false);
        setCurrentPost(null);
        setPostImage(null);
        setFileList([]);
        message.success('Post updated successfully');
      } catch (err) {
        setError('Failed to update post');
        console.error('Failed to update post', err);
        message.error('Failed to update post');
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentPost(null);
    setPostImage(null);
    setFileList([]);
  };

  const handleImageChange = (info: any) => {
    const isImage = info.file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return;
    }
    const isLt1024MB = info.file.size / 1024 / 1024 < 1024;
    if (!isLt1024MB) {
      message.error('Image must be smaller than 1024MB!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPostImage(e.target?.result as string);
      setFileList([
        {
          uid: '-1',
          name: 'image',
          status: 'done',
          url: e.target?.result as string,
        },
      ]);
    };
    reader.readAsDataURL(info.file);
  };

  const handleRemoveImage = () => {
    setPostImage(null);
    setFileList([]);
  };

  const filteredPosts = posts.filter(post => {
    if (filter !== 'all' && post.status !== filter) {
      return false;
    }
    if (dateRange) {
      const postCreateDate = moment(post.createDate);
      if (!postCreateDate.isSameOrAfter(dateRange[0], 'day') || !postCreateDate.isSameOrBefore(dateRange[1], 'day')) {
        return false;
      }
    }
    return true;
  });

  if (!user) {
    return <Alert message="Please log in to see your post history." type="warning" showIcon />;
  }

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Avatar src={user.avatar} alt={user.name} size={64} style={{ border: '2px solid #1890ff' }} />
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>{user.name}'s Post History</Title>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <RangePicker onChange={(dates) => handleDateChange(dates as [Dayjs, Dayjs] | null)} style={{ borderRadius: '10px', borderColor: '#1890ff' }} />
          <Select defaultValue="all" onChange={handleFilterChange} style={{ width: 120, borderRadius: '10px', borderColor: '#1890ff' }}>
            <Option value="all">
              <Tag color="blue">All</Tag>
            </Option>
            <Option value="published">
              <Tag color="green">Published</Tag>
            </Option>
            <Option value="draft">
              <Tag color="orange">Draft</Tag>
            </Option>
            <Option value="private">
              <Tag color="red">Private</Tag>
            </Option>
          </Select>
        </div>
      </div>
      {error && <Alert message={error} type="error" showIcon style={{ borderRadius: '10px' }} />}
      {filteredPosts.length === 0 ? (
        <Alert message="No posts found." type="info" showIcon style={{ borderRadius: '10px' }} />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={filteredPosts}
          renderItem={post => (
            <List.Item
              actions={[
                <Button icon={<EditOutlined />} onClick={() => handleEditPost(post)} style={{ borderRadius: '10px', borderColor: '#1890ff', color: '#1890ff' }}>Edit</Button>,
                <Button icon={<DeleteOutlined />} onClick={() => handleDeletePost(post.id)} style={{ borderRadius: '10px', borderColor: '#ff4d4f', color: '#ff4d4f' }}>Delete</Button>,
                <Select
                  defaultValue={post.status}
                  onChange={(value) => handleStatusChange(post.id, value)}
                  style={{
                    width: 150,
                    borderRadius: '10px',
                    borderColor: '#1890ff',
                    backgroundColor: '#f0f2f5',
                    color: '#1890ff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                  dropdownStyle={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Option value="published">
                    <Tag color="green">Published</Tag>
                  </Option>
                  <Option value="draft">
                    <Tag color="orange">Draft</Tag>
                  </Option>
                  <Option value="private">
                    <Tag color="red">Private</Tag>
                  </Option>
                </Select>
              ]}
              style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}
            >
              <List.Item.Meta
                avatar={<Image src={post.postImage} alt={post.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} />}
                title={<Text strong style={{ fontSize: '18px', color: '#1890ff' }}>{post.title}</Text>}
                description={
                  <>
                    <Text>{post.description}</Text>
                    <br />
                    <Text type="secondary">Status: {
                      post.status === 'published' ? <Tag color="green"><CheckCircleOutlined /> Published</Tag> :
                      post.status === 'draft' ? <Tag color="orange"><CloseCircleOutlined /> Draft</Tag> :
                      <Tag color="red"><SyncOutlined /> Private</Tag>
                    }</Text>
                    <br />
                    <Text type="secondary">Created At: {formatDate(new Date(post.createDate))}</Text>
                    <br />
                    <Text type="secondary">Updated At: {formatDate(new Date(post.updateDate))}</Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
      <Modal
        title="Edit Post"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        style={{ borderRadius: '15px', overflow: 'hidden' }}
      >
        <Form
          initialValues={currentPost || {}}
          onFinish={handleModalOk}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input style={{ borderRadius: '10px', borderColor: '#1890ff' }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea style={{ borderRadius: '10px', borderColor: '#1890ff' }} />
          </Form.Item>
          <Form.Item
            name="postImage"
            label="Post Image"
            rules={[{ required: true, message: 'Please upload an image for the post!' }]}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Upload
                name="postImage"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleImageChange}
                fileList={fileList}
              >
                {fileList.length > 0 ? (
                  <img 
                    src={fileList[0].url}
                    alt="post" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              {fileList.length > 0 && (
                <Button
                  type="link"
                  onClick={handleRemoveImage}
                  style={{ marginLeft: '10px' }}
                >
                  <DeleteOutlined /> Remove
                </Button>
              )}
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ borderRadius: '10px', backgroundColor: '#1890ff', borderColor: '#1890ff' }}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </motion.div>
  );
};

export default HistoryPost;