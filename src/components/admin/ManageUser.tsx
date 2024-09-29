import React, { useCallback } from "react";
import { Avatar, Button, Table } from "antd";
import { Link } from "react-router-dom";
import { IUser } from "../../models/Users";
import { formatDateForTable } from "../../utils/formatDate";
import { ClockCircleOutlined } from '@ant-design/icons';

interface ManageUserProps {
  filteredData: IUser[]; // Accept the filtered data from ManageUsers
}

const ManageUser: React.FC<ManageUserProps> = ({ filteredData }) => {
  const renderAction = useCallback((id: string) => (
    <Link to={`/admin/detail/${id}`} key={id}>
      <Button 
        type="primary" 
        style={{ 
          backgroundColor: "#4B0082", 
          borderColor: "#4B0082", 
          color: "#fff", 
          fontWeight: "bold", 
          padding: "10px 20px", 
          borderRadius: "10px", 
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" 
        }}
      >
        View Detail
      </Button>
    </Link>
  ), []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => (
        <Avatar src={avatar} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
      render: (createDate: string) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          {formatDateForTable(createDate)}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: renderAction,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        className="styled-table" 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default React.memo(ManageUser);
