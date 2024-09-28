import { useEffect, useState } from "react";
import { IUser } from "../../models/Users";
import { getAllUsers } from "../../services/auth";
import { Spin, Alert } from "antd";
import SearchUser from "../../components/admin/SearchUser"; // Import SearchUser
import ManageUser from "../../components/admin/ManageUser"; // Import ManageUser

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
       <SearchUser
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />
      <ManageUser filteredData={filteredData} />
    </div>
  );
}

export default ManageUsers;
