import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IPost } from '../../../models/Posts';
import * as postService from '../../../services/posts';
import { List, Typography, Image, Spin, Alert, Select, DatePicker, Avatar, Button, Modal, Form, Input, Upload, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { Dayjs } from 'dayjs';
import 'moment/locale/vi';
import Compressor from 'compressorjs';
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
  const [postImage, setPostImage] = useState<File | null>(null);
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
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to delete post');
      console.error('Failed to delete post', err);
    }
  };

  const handleStatusChange = async (postId: string, status: string) => {
    try {
      const postToUpdate = posts.find(post => post.id === postId);
      if (postToUpdate) {
        const updatedPost = { ...postToUpdate, status, updateDate: new Date() };
        await postService.updatePost(updatedPost);
        setPosts(posts.map(post => (post.id === postId ? updatedPost : post)));
      }
    } catch (err) {
      setError('Failed to update post status');
      console.error('Failed to update post status', err);
    }
  };

  const handleModalOk = async (values: any) => {
    if (currentPost) {
      try {
        const updatedPost = { ...currentPost, ...values, updateDate: new Date() };
        if (postImage) {
          const compressedImage = await new Promise<File>((resolve, reject) => {
            new Compressor(postImage, {
              quality: 0.6,
              success: (file: File) => resolve(file),
              error: reject,
            });
          });
          updatedPost.postImage = URL.createObjectURL(compressedImage);
        }
        await postService.updatePost(updatedPost);
        setPosts(posts.map(post => (post.id === currentPost.id ? updatedPost : post)));
        setIsModalVisible(false);
        setCurrentPost(null);
        setPostImage(null);
        setFileList([]);
      } catch (err) {
        setError('Failed to update post');
        console.error('Failed to update post', err);
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
    if (info.file.status === 'done') {
      setPostImage(info.file.originFileObj);
    }
    setFileList(info.fileList);
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
            <Option value="all">All</Option>
            <Option value="published">Published</Option>
            <Option value="draft">Draft</Option>
            <Option value="private">Private</Option>
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
                  <Option value="published" style={{ color: 'green' }}>Published</Option>
                  <Option value="draft" style={{ color: 'red' }}>Draft</Option>
                  <Option value="private" style={{ color: 'orange' }}>Private</Option>
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
                    <Text type="secondary">Status: {post.status === 'published' ? <><CheckCircleOutlined style={{ color: 'green' }} /> Published</> : post.status === 'draft' ? <><CloseCircleOutlined style={{ color: 'red' }} /> Draft</> : <><SyncOutlined style={{ color: 'orange' }} /> Private</>}</Text>
                    <br />
                    <Text type="secondary">Created At: {moment(post.createDate).format('DD/MM/YYYY')}</Text>
                    <br />
                    <Text type="secondary">Updated At: {moment(post.updateDate).format('DD/MM/YYYY')}</Text>
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
          >
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
                setPostImage(file);
                return false;
              }}
              onChange={handleImageChange}
              fileList={fileList} // Use fileList instead of value
              disabled={!!postImage} // Disable upload button after image is uploaded
            >
              {!postImage ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <UploadOutlined style={{ fontSize: '24px', color: '#000000' }} />
                  <div style={{ marginTop: 8, color: '#000000' }}>Upload</div>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', borderRadius: '15px' }}>
                  <img src={URL.createObjectURL(postImage)} alt="post" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Button
                    type="link"
                    onClick={() => {
                      setPostImage(null);
                      setFileList([]);
                    }}
                    style={{ color: '#fff', fontSize: 20, position: 'absolute', top: 0, right: 0 }}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
              )}
            </Upload>
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
