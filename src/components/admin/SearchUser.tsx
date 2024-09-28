import { Input, Row, Col, Radio } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { motion } from "framer-motion";

const { Group: RadioGroup, Button: RadioButton } = Radio;

interface SearchUserProps {
  searchText: string;
  setSearchText: (value: string) => void;
  handleSearch: (value: string, role: string) => void;
  selectedRole: string;
  setSelectedRole: (value: string) => void;
}

const SearchUser = ({
  searchText,
  setSearchText,
  handleSearch,
  selectedRole,
  setSelectedRole,
}: SearchUserProps) => {

  return (
    <Row
      style={{
        marginBottom: "16px",
        padding: "10px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}
      gutter={16}
    >
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
          prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
          style={{
            borderRadius: "8px",
            padding: "10px",
            border: "1px solid #d9d9d9",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}
        />
      </Col>
      <Col span={12}>
        <RadioGroup
          value={selectedRole}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedRole(value);
            handleSearch(searchText, value);
          }}
          style={{ width: "100%", display: "flex", justifyContent: "space-around" }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ position: "relative" }}
          >
            <RadioButton value="">
              All Roles   
            </RadioButton>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ position: "relative" }}
          >
            <RadioButton value="admin">
              Admin
             
            </RadioButton>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ position: "relative" }}
          >
            <RadioButton value="customer">
              Customer           
            </RadioButton>
          </motion.div>
        </RadioGroup>
      </Col>
    </Row>
  );
};

export default SearchUser;
