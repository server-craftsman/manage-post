import React, { useCallback } from "react";
import { Button, Table } from "antd";
import { Link } from "react-router-dom";
import { IUser } from "../../models/Users";

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
      />
    </div>
  );
};

export default React.memo(ManageUser);
