import React, { useState } from "react";
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, Upload, message } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { IUser } from "../../../models/Users";
import { UploadOutlined } from '@ant-design/icons';

const CustomerProfile: React.FC = () => {
  const { user, updateUser } = useAuth(); // Assuming you have an updateUser function in your context
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
    if (info.file.status === 'done') {
      setAvatarFile(info.file.originFileObj);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card style={{ width: "100%" }}>
        <div className="flex items-center mb-4">
          <Avatar
            src={
              typeof user.avatar === "string"
                ? user.avatar
                : "default-avatar.png"
            }
            size={64}
          />
          <h2 className="ml-4">{user.name}</h2>
        </div>
        <Descriptions bordered>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
          <Descriptions.Item label="Password">
            {user.password}
          </Descriptions.Item>
        </Descriptions>
        <Button
          type="primary"
          style={{ marginTop: "16px" }}
          onClick={handleEdit}
        >
          Edit Profile
        </Button>
        <Button
          type="default"
          style={{ marginTop: "16px", marginLeft: "8px" }}
          onClick={() => setIsPasswordModalVisible(true)}
        >
          Change Password
        </Button>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
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
          {/* <Form.Item label="Avatar URL" name="avatar">
            <Input />
          </Form.Item> */}
          <Form.Item label="Upload Avatar">
            <Upload
              name="avatar"
              listType="picture"
              beforeUpload={() => false}
              onChange={handleAvatarChange}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModalVisible}
        onOk={handlePasswordChange}
        onCancel={() => setIsPasswordModalVisible(false)}
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