import { useEffect, useState } from "react";
import { IUser } from "../../models/Users";
import { getAllUsers } from "../../services/auth";
import { Spin, Alert, Row, Col } from "antd";
import SearchUser from "../../components/admin/SearchUser"; // Import SearchUser
import ManageUser from "../../components/admin/ManageUser"; // Import ManageUser
import RegisterUser from "../../components/admin/CreateUser";

const ManageUsers = () => {
  const [dataSource, setDataSource] = useState<IUser[]>([]);
  const [filteredData, setFilteredData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        setDataSource(users.map((user) => ({ ...user, key: user.id })));
        setFilteredData(users.map((user) => ({ ...user, key: user.id })));
      } catch (error) {
        setError(`Error fetching users: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search logic
  const handleSearch = (value: string, role: string) => {
    setSearchText(value);
    setSelectedRole(role);
    
    const filtered = dataSource.filter((user) =>
      (user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())) &&
      (role ? user.role === role : true) // Filter by role if selected
    );
    setFilteredData(filtered);
  };

  // Callback to add a new user to the list
  const addUser = (newUser: IUser) => {
    setDataSource((prev) => [...prev, { ...newUser, key: newUser.id }]);
    setFilteredData((prev) => [...prev, { ...newUser, key: newUser.id }]);
  };

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
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <SearchUser
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        </Col>
        <Col span={24}>
          <RegisterUser addUser={addUser} />
        </Col>
        <Col span={24}>
          <ManageUser filteredData={filteredData} />
        </Col>
       
      </Row>
    </div>
  );
}

export default ManageUsers;
