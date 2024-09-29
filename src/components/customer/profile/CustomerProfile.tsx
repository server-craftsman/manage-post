import React, { useState, useEffect } from "react";
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, Upload, message } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { IUser } from "../../../models/Users";
import { UploadOutlined, DeleteOutlined, EditOutlined, UserOutlined, MailOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { Rule } from 'antd/es/form';

const CustomerProfile: React.FC = () => {
  const { user, updateUser, checkEmailExists, checkOldEmail, checkOldPassword } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isModalVisible && user && user.avatar) {
      setFileList([
        {
          uid: '-1',
          name: 'avatar',
          status: 'done',
          url: typeof user.avatar === "string" ? user.avatar : undefined,
        },
      ]);
    }
  }, [isModalVisible, user]);

  useEffect(() => {
    if (avatarFile) {
      setFileList([
        {
          uid: '-1',
          name: 'avatar',
          status: 'done',
          url: URL.createObjectURL(avatarFile),
        },
      ]);
    }
  }, [avatarFile]);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleEdit = () => {
    form.setFieldsValue({
      name: user.name,
      avatar: user.avatar,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (avatarFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target && e.target.result) {
            const base64String = e.target.result as string;
            const updatedData: IUser = {
              ...user,
              ...values,
              avatar: base64String,
              updateDate: new Date().toISOString(),
            };

            try {
              await updateUser(updatedData);
              setIsModalVisible(false);
              form.resetFields();
              message.success('Profile updated successfully!');
            } catch (error) {
              message.error('Failed to update profile.');
            }
          }
        };
        reader.readAsDataURL(avatarFile);
      } else {
        const updatedData: IUser = {
          ...user,
          ...values,
          updateDate: new Date().toISOString(),
        };
        await updateUser(updatedData);
        setIsModalVisible(false);
        form.resetFields();
        message.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error("Failed to validate form:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (values.currentPassword !== user.password) {
        message.error('Current password is incorrect.');
        return;
      }
      await updateUser({ ...user, password: values.newPassword });
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
      message.success('Password changed successfully!');
    } catch (error) {
      console.error("Failed to validate password form:", error);
    }
  };

  const handleEmailChange = async () => {
    try {
      const values = await emailForm.validateFields();
      if (values.currentEmail !== user.email) {
        message.error('Current email is incorrect.');
        return;
      }
      if (values.newEmail === user.email) {
        message.error('New email must be different from the current email.');
        return;
      }
      const emailExists = await checkEmailExists(values.newEmail);
      if (emailExists) {
        message.error('This email is already in use.');
        return;
      }
      await updateUser({ ...user, email: values.newEmail });
      setIsEmailModalVisible(false);
      emailForm.resetFields();
      message.success('Email changed successfully!');
    } catch (error) {
      console.error("Failed to validate email form:", error);
    }
  };

  const confirmPasswordValidator = (getFieldValue: (name: string) => any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }
      return Promise.reject("The two passwords that you entered do not match!");
    },
  });

  const confirmEmailValidator = (getFieldValue: (name: string) => any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("newEmail") === value) {
        return Promise.resolve();
      }
      return Promise.reject("The two emails that you entered do not match!");
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
    setAvatarFile(info.file);
  };

  const getValidationRules = (field: string) => {
    switch (field) {
      case 'name':
        return [
          { required: true, message: "Please input your name!" },
          { min: 3, message: 'Name must be at least 3 characters long!' }
        ];
      case 'email':
        return [
          { required: true, type: "email", message: "Please input a valid email!" },
          { validator: checkOldEmail }
        ];
      case 'avatar':
        return [
          { required: true, message: 'Please upload your Avatar!' }
        ];
      case 'currentPassword':
        return [
          { required: true, message: "Please input your current password!" },
          { validator: checkOldPassword }
        ];
      case 'newPassword':
        return [
          { required: true, message: "Please input your new password!" },
          { min: 6, message: "Password must be at least 6 characters." },
          { pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, message: "Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character." }
        ];
      case 'confirmPassword':
        return [
          { required: true, message: "Please confirm your new password!" },
          confirmPasswordValidator(passwordForm.getFieldValue)
        ];
      case 'currentEmail':
        return [
          { required: true, type: "email", message: "Please input your current email!" }
        ];
      case 'newEmail':
        return [
          { required: true, type: "email", message: "Please input a valid new email!" }
        ];
      case 'confirmEmail':
        return [
          { required: true, type: "email", message: "Please confirm your new email!" },
          confirmEmailValidator(emailForm.getFieldValue)
        ];
      default:
        return [];
    }
  };

  const renderProfileContent = () => (
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
          <Descriptions.Item label="Email" style={{ fontSize: "16px", fontWeight: "500", marginBottom: "10px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{user.email}</span>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => setIsEmailModalVisible(true)}
              >
                Change Email
              </Button>
            </div>
          </Descriptions.Item>
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
              icon={<EditOutlined />}
            >
              Edit Profile
            </Button>
            <Button
              type="default"
              style={{ padding: "8px 16px", borderRadius: "8px" }}
              onClick={() => setIsPasswordModalVisible(true)}
              icon={<LockOutlined />}
            >
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        title={<><EditOutlined /> Edit Profile</>}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
        centered
        style={{ padding: "20px" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={<><UserOutlined /> Name</>}
            name="name"
            rules={getValidationRules('name') as Rule[]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label={<><UploadOutlined /> Upload Avatar</>}
            name="avatar"
            rules={getValidationRules('avatar') as Rule[]}
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
                    src={fileList[0].url}
                    alt="avatar"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }}
                  />
                  <Button
                    type="link"
                    onClick={() => {
                      setAvatarFile(null);
                      setFileList([]);
                    }}
                    style={{ display: 'block', marginTop: '10px' }}
                  >
                    <DeleteOutlined /> Remove
                  </Button>
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title={<> Change Password</>}
        open={isPasswordModalVisible}
        onOk={handlePasswordChange}
        onCancel={() => setIsPasswordModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
        centered
        style={{ padding: "20px" }}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            label={<>Current Password</>}
            name="currentPassword"
            rules={getValidationRules('currentPassword') as Rule[]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            label={<>New Password</>}
            name="newPassword"
            rules={getValidationRules('newPassword') as Rule[]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            label={<>Confirm New Password</>}
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={getValidationRules('confirmPassword') as Rule[]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Email Modal */}
      <Modal
        title={<> Change Email</>}
        open={isEmailModalVisible}
        onOk={handleEmailChange}
        onCancel={() => setIsEmailModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
        centered
        style={{ padding: "20px" }}
      >
        <Form 
          form={emailForm} 
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ('newEmail' in changedValues) {
              const newEmail = changedValues.newEmail;
              if (newEmail === user.email) {
                message.error('New email must be different from the current email.');
                emailForm.setFields([
                  {
                    name: 'newEmail',
                    errors: ['New email must be different from the current email.'],
                  },
                ]);
              } else {
                checkEmailExists(newEmail).then(exists => {
                  if (exists) {
                    message.error('This email is already in use.');
                    emailForm.setFields([
                      {
                        name: 'newEmail',
                        errors: ['This email is already in use.'],
                      },
                    ]);
                  }
                });
              }
            }
          }}
        >
          <Form.Item
            label={<>Current Email</>}
            name="currentEmail"
            rules={getValidationRules('currentEmail') as Rule[]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            label={<>New Email</>}
            name="newEmail"
            rules={getValidationRules('newEmail') as Rule[]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            label={<>Confirm New Email</>}
            name="confirmEmail"
            dependencies={["newEmail"]}
            rules={getValidationRules('confirmEmail') as Rule[]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  return renderProfileContent();
};

export default CustomerProfile;