import { Input, Row, Col, Radio, DatePicker, message } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { motion } from "framer-motion";
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Group: RadioGroup, Button: RadioButton } = Radio;

interface SearchUserProps {
  searchText: string;
  setSearchText: (value: string) => void;
  handleSearch: (value: string, role: string) => void;
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  selectedStartDate: Dayjs | null;
  setSelectedStartDate: (date: Dayjs | null) => void;
  selectedEndDate: Dayjs | null;
  setSelectedEndDate: (date: Dayjs | null) => void;
}

const SearchUser = ({
  searchText,
  setSearchText,
  handleSearch,
  selectedRole,
  setSelectedRole,
  selectedStartDate,
  setSelectedStartDate,
  selectedEndDate,
  setSelectedEndDate,
}: SearchUserProps) => {

  const currentDate = dayjs();
  const hundredYearsAgo = currentDate.subtract(100, 'year');

  const handleEndDateChange = (date: Dayjs | null) => {
    if (!selectedStartDate) {
      message.warning('Please select a Start Date first.');
      setSelectedEndDate(null);
      return;
    }

    if (date && date.isBefore(selectedStartDate)) {
      message.warning('End Date should be greater than or equal to Start Date');
      setSelectedEndDate(null);
    } else {
      setSelectedEndDate(date);
    }
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date && date.isAfter(currentDate)) {
      message.warning('Start Date cannot be in the future.');
      setSelectedStartDate(null);
    } else {
      setSelectedStartDate(date);
    }
  };

  const disableStartDate = (date: Dayjs) => {
    return date.isBefore(hundredYearsAgo);
  };

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
      <Col span={12} style={{ marginTop: '16px' }}>
          <DatePicker
            value={selectedStartDate}
            onChange={handleStartDateChange}
            placeholder="Start Date"
            disabledDate={disableStartDate}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </Col>
        <Col span={12} style={{ marginTop: '16px' }}>
          <DatePicker
            value={selectedEndDate}
            onChange={handleEndDateChange}
            placeholder="End Date"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </Col>
    </Row>
  );
};

export default SearchUser;
