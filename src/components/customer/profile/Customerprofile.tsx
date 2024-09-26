import { useState } from 'react';
import { Card, Descriptions, Avatar, Button, Modal, Form, Input } from 'antd';
import { useAuth } from '../../../context/AuthContext';
import { IUser  } from '../../../models/Users';

const Customerprofile = () => {
    const { user, updateUser } = useAuth(); // Assuming you have an updateUser function in your context
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleEdit = () => {
    form.setFieldsValue({ 
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedData: IUser = {
        ...user,
        ...values,
        updateDate: new Date().toISOString(), // Update the date to current time
      };
      await updateUser(updatedData);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to validate form:', error);
    }
  };

   // Format the date strings
  return (
    <div className="container mx-auto px-4 py-8">
      <Card style={{ width: '100%' }}>
        <div className="flex items-center mb-4">
          <Avatar src={typeof user.avatar === 'string' ? user.avatar : 'default-avatar.png'} size={64} />
          <h2 className="ml-4">{user.name}</h2>
        </div>
        <Descriptions bordered>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
          {/* Add more fields as necessary */}
        </Descriptions>
        <Button type="primary" style={{ marginTop: '16px' }} onClick={handleEdit}>
          Edit Profile
        </Button>
      </Card>
      
      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Avatar URL" name="avatar">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customerprofile
