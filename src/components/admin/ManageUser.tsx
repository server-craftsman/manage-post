import { Button, Table, Spin, Alert } from "antd";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/auth";
import { Link } from "react-router-dom";
import { IUser } from "../../models/Users";

const ManageUsers = () => {
  const [dataSource, setDataSource] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      render: (id: string) => (
        <Link to={`/admin/detail/${id}`} key={id}>
          <Button type="primary" style={{ backgroundColor: "#4B0082", borderColor: "#4B0082", color: "#fff", fontWeight: "bold", padding: "10px 20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>View Detail</Button>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        setDataSource(users.map(user => ({ ...user, key: user.id })));
      } catch (error) {
        setError(`Error fetching users: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Table columns={columns} dataSource={dataSource} className="styled-table" />
    </div>
  );
};

export default ManageUsers;
