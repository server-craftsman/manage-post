import React, { useState } from "react";
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, Upload, message } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { IUser } from "../../../models/Users";
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { HomeOutlined } from '@ant-design/icons';
import Compressor from 'compressorjs'; // Import Compressor.js

const CustomerProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const navigate = useNavigate();
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

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('updateDate', new Date().toISOString());

        const updatedData: IUser = {
          ...user,
          ...values,
          avatar: URL.createObjectURL(avatarFile),
          updateDate: new Date().toISOString(), // Update the date to current time
        };

        try {
          await updateUser(updatedData);
          setIsModalVisible(false);
          form.resetFields(); // Reset form fields after updating profile
          message.success('Profile updated successfully!');
        } catch (error) {
          if (error instanceof Error && error.message === 'Payload Too Large') {
            message.error('Avatar file is too large. Please upload a smaller file.');
          } else {
            message.error('Failed to update profile.');
          }
        }
      } else {
        const updatedData: IUser = {
          ...user,
          ...values,
          updateDate: new Date().toISOString(), // Update the date to current time
        };
        await updateUser(updatedData);
        setIsModalVisible(false);
        form.resetFields(); // Reset form fields after updating profile
        message.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error("Failed to validate form:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      // Assuming your updateUser function can take the updated user object
      await updateUser({ ...user, password: values.newPassword }); // Update the password in the user object
      setIsPasswordModalVisible(false);
      passwordForm.resetFields(); // Reset password form fields after password change
      message.success('Password changed successfully!');
    } catch (error) {
      console.error("Failed to validate password form:", error);
    }
  };

  // Validation function for confirming passwords
  const confirmPasswordValidator = (getFieldValue: (name: string) => any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }
      return Promise.reject("The two passwords that you entered do not match!");
    },
  });

  const handleAvatarChange = (info: any) => {
    const isImage = info.file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return;
    }
    const isLt1024GB = info.file.size / 1024 / 1024 / 1024 < 1024;
    if (!isLt1024GB) {
      message.error('Image must be smaller than 1024GB!');
      return;
    }
    new Compressor(info.file, {
      quality: 0.5, // Adjust the quality as needed
      success: (compressedFile) => {
        setAvatarFile(compressedFile as File); // Set the compressed file to state
        setFileList([compressedFile]); // Update fileList state
      },
      error: () => {
        message.error('Failed to compress image. Please try again.');
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card style={{ width: "100%", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <div className="flex items-center mb-4">
          <Avatar
            src={
              typeof user.avatar === "string"
                ? user.avatar
                : "default-avatar.png"
            }
            size={80}
            style={{ border: "2px solid #1890ff" }}
          />
          <h2 className="ml-4" style={{ fontSize: "24px", fontWeight: "bold" }}>{user.name}</h2>
        </div>
        <Descriptions bordered column={1} layout="vertical" style={{ backgroundColor: "#f9f9f9", borderRadius: "10px", padding: "20px", border: "1px solid #f0f0f0" }}>
          <Descriptions.Item label="Email" style={{ fontSize: "16px", fontWeight: "500", marginBottom: "10px" }}>{user.email}</Descriptions.Item>
          <Descriptions.Item label="Role" style={{ fontSize: "16px", fontWeight: "500", marginBottom: "10px" }}>{user.role}</Descriptions.Item>
        </Descriptions>

        <div className="flex justify-between items-center mt-8">
          <Button
            type="default"
            style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "#f0f0f0", borderColor: "#d9d9d9", color: "#000" }}
            onClick={() => navigate('/')}
            icon={<HomeOutlined />}
          >
            Back To Home
          </Button>
          <div className="flex space-x-4">
            <Button
              type="primary"
              style={{ padding: "8px 16px", borderRadius: "8px" }}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
            <Button
              type="default"
              style={{ padding: "8px 16px", borderRadius: "8px" }}
              onClick={() => setIsPasswordModalVisible(true)}
            >
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
        centered
        bodyStyle={{ padding: "20px" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input your name!" },
              { min: 3, message: 'Name must be at least 3 characters long!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Upload Avatar"
            name="avatar"
            rules={[{ required: true, message: 'Please upload your Avatar!' }]}
          >
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              <div style={{marginRight: '10px'}}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  beforeUpload={() => false}
                  onChange={handleAvatarChange}
                  fileList={fileList}
                  showUploadList={false}
                  style={{ width: '100%' }}
                >
                  <Button style={{ width: '100%', height: '100%', borderRadius: '5px'}} icon={<UploadOutlined />}></Button>
                </Upload>
              </div>
            {fileList.length > 0 && (
              <div style={{marginBottom: '20px', marginLeft: '10px'}}>
                <img
                  src={URL.createObjectURL(fileList[0])}
                  alt="avatar"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }}
                />
                <Button
                  type="link"
                  onClick={() => setFileList([])}
                  style={{ display: 'block', marginTop: '10px' }}
                >
                  Remove
                </Button>
              </div>
            )}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModalVisible}
        onOk={handlePasswordChange}
        onCancel={() => setIsPasswordModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
        centered
        bodyStyle={{ padding: "20px" }}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 6, message: "Password must be at least 6 characters." },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              confirmPasswordValidator(passwordForm.getFieldValue), // Use the validator correctly
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerProfile;
