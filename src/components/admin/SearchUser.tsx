import { Input, Row, Col, Radio } from "antd";
import { useState } from "react";

interface SearchUserProps {
  searchText: string;
  setSearchText: (value: string) => void;
  handleSearch: (value: string, role: string) => void;
  selectedRole: string; // Add selectedRole
  setSelectedRole: (value: string) => void; // Add setSelectedRole
}

const SearchUser = ({
  searchText,
  setSearchText,
  handleSearch,
}: SearchUserProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Define styles
  const radioGroupStyle = { display: "flex" };
  const radioContainerStyle: React.CSSProperties = { display: "flex", alignItems: "center", marginRight: "16px" };
  
  const radioStyle = (isSelected: boolean, role: string) => ({
    borderRadius: "0.375rem", // Tailwind's rounded-md
    padding: "0.5rem", // Tailwind's p-2
    border: `1px solid ${isSelected ? (role === 'admin' ? 'pink' : role === 'customer' ? 'red' : 'blue') : 'black'}`,
  });

  const textStyle = (isSelected: boolean, color: string) => ({
    color: isSelected ? color : 'black',
  });

  return (
    <Row style={{ marginBottom: "20px" }} gutter={16}>
      <Col span={12}>
        <Input
          placeholder="Search by Name or Email"
          value={searchText}
          onChange={(e) => {
            const value = e.target.value;
            setSearchText(value);
            handleSearch(value, selectedRole);
          }}
          allowClear
        />
      </Col>
      <Col span={12}>
        <Radio.Group
          onChange={(e) => {
            const role = e.target.value;
            setSelectedRole(role);
            handleSearch(searchText, role);
          }}
          value={selectedRole}
          style={radioGroupStyle}
        >
          <div style={radioContainerStyle}>
            <Radio value="" style={radioStyle(selectedRole === '', '')}>
              <span style={textStyle(selectedRole === '', 'blue')}>All Roles</span>
            </Radio>
          </div>
          <div style={radioContainerStyle}>
            <Radio value="admin" style={radioStyle(selectedRole === 'admin', 'admin')}>
              <span style={textStyle(selectedRole === 'admin', 'pink')}>Admin</span>
            </Radio>
          </div>
          <div style={radioContainerStyle}>
            <Radio value="customer" style={radioStyle(selectedRole === 'customer', 'customer')}>
              <span style={textStyle(selectedRole === 'customer', 'red')}>Customer</span>
            </Radio>
          </div>
        </Radio.Group>
      </Col>
    </Row>
  );
};

export default SearchUser;
