import { Button, Table } from "antd"
import { useEffect, useState } from "react"

import { getAllUsers } from "../../services/auth";

import { Link } from "react-router-dom";

const ManageUsers = () => {
  const [dataSource, setDataSource] = useState([]);


  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Link to={`/admin/detail/${id}`}>
        <Button type="primary">View Detail</Button>
        </Link>
      )
    }

  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers(); 
        setDataSource(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={dataSource}/>

    </div>
  )
}

export default ManageUsers
