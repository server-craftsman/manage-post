import { Button, Table, Spin, Alert } from "antd";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/auth";
import { Link } from "react-router-dom";

const ManageUsers = () => {
  const [dataSource, setDataSource] = useState([]);
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
      key: "id",
      render: (id: string) => (
        <Link to={`/admin/detail/${id}`}>
          <Button type="primary" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}>View Detail</Button>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        setDataSource(users as any);
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
