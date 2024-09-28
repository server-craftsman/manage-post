import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IPost } from '../../../models/Posts';
import { v4 as uuidv4 } from 'uuid';
import Compressor from 'compressorjs'; // Import Compressor.js
import { Form, Input, Button, Upload, message, Row, Col, Typography, Alert } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion'; // Import framer-motion
import { useNavigate } from 'react-router-dom';
const { TextArea } = Input;
const { Title } = Typography;

const CreatePost: React.FC = () => {
  const { createPost, user } = useAuth();
  const [title, setTitle] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [status, setStatus] = useState('published'); // Add state for status
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    const newPost: IPost = {
      id: uuidv4(), // This will be set by the backend
      title,
      description,
      userId: user.id || '',
      status, // Use the selected status
      postImage: '',
      createDate: new Date(),
      updateDate: new Date(),
    };

    try {
      let compressedImage;
      if (postImage) {
        compressedImage = await new Promise<File>((resolve, reject) => {
          new Compressor(postImage, {
            quality: 0.6,
            success: (file: File) => resolve(file),
            error: reject,
          });
        });
      }

      await createPost(newPost, compressedImage || undefined);
      setTitle('');
      setDescription('');
      setPostImage(null);
      setStatus('published'); // Reset status to default
      setError(null);
      message.success('Post created successfully');
      navigate('/');
    } catch (err) {
      if (err instanceof Error && err.message.includes('Payload Too Large')) {
        setError('Post image is too large. Please upload a smaller image.');
      } else {
        setError('Failed to create post');
      }
    }
  };

  const handleImageChange = (info: any) => {
    if (info.file.status === 'done') {
      setPostImage(info.file.originFileObj);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <Row className="min-h-screen">
        <Col span={24} className="bg-white flex items-center justify-center">
          <div className="w-full max-w-lg p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <Title level={2} style={{ textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: '30px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                Create New Post
              </Title>
            </motion.div>
            {error && (
              <div className="mb-4">
                <Alert message={error} type="error" showIcon />
              </div>
            )}
            <Form onFinish={handleSubmit} layout="vertical">
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
                    setPostImage(file);
                    return false;
                  }}
                  onChange={handleImageChange}
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
                        onClick={() => setPostImage(null)}
                        style={{ color: '#fff', fontSize: 20, position: 'absolute', top: 0, right: 0 }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Form.Item label="Title" required>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ borderRadius: '10px', borderColor: '#000000' }}
                />
              </Form.Item>
              <Form.Item label="Description" required>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ borderRadius: '10px', borderColor: '#000000' }}
                />
              </Form.Item>
              <Form.Item label="Status" name="status">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button
                    type={status === 'published' ? 'primary' : 'default'}
                    onClick={() => setStatus('published')}
                    style={{
                      borderRadius: '10px',
                      borderColor: '#007bff',
                      backgroundColor: status === 'published' ? '#007bff' : '#ffffff',
                      color: status === 'published' ? '#ffffff' : '#007bff'
                    }}
                  >
                    Published
                  </Button>
                  <Button
                    type={status === 'draft' ? 'primary' : 'default'}
                    onClick={() => setStatus('draft')}
                    style={{
                      borderRadius: '10px',
                      borderColor: '#6c757d',
                      backgroundColor: status === 'draft' ? '#6c757d' : '#ffffff',
                      color: status === 'draft' ? '#ffffff' : '#6c757d'
                    }}
                  >
                    Private
                  </Button>
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!title || !description || !postImage}
                  style={{
                    backgroundColor: '#ff0000',
                    borderColor: '#ff0000',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    ...( (!title || !description || !postImage) && { backgroundColor: '#d9d9d9', borderColor: '#d9d9d9', color: '#8c8c8c' } )
                  }}
                  onMouseEnter={(e) => {
                    if (title && description && postImage) {
                      e.currentTarget.style.backgroundColor = '#cc0000';
                      e.currentTarget.style.borderColor = '#cc0000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (title && description && postImage) {
                      e.currentTarget.style.backgroundColor = '#ff0000';
                      e.currentTarget.style.borderColor = '#ff0000';
                    }
                  }}
                >
                  Create Post
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default CreatePost;
