import React from 'react';
import { Input, DatePicker, Select, message, Row, Col } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

interface SearchPostProps {
  searchText: string;
  setSearchText: (value: string) => void;
  selectedStartDate: Dayjs | null;
  setSelectedStartDate: (date: Dayjs | null) => void;
  selectedEndDate: Dayjs | null;
  setSelectedEndDate: (date: Dayjs | null) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}

const SearchPost: React.FC<SearchPostProps> = ({
  searchText,
  setSearchText,
  selectedStartDate,
  setSelectedStartDate,
  selectedEndDate,
  setSelectedEndDate,
  selectedStatus,
  setSelectedStatus
}) => {
  const currentDate = dayjs();
  const hundredYearsAgo = currentDate.subtract(100, 'year');

  const handleEndDateChange = (date: Dayjs | null) => {
    if (!selectedStartDate) {
      message.warning('Please select a Start Date first.');
      setSelectedEndDate(null);
      return;
    }

    if (date && date.isBefore(selectedStartDate, 'day')) {
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
    return date.isBefore(hundredYearsAgo, 'day');
  };

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    }}>
      <Input
        placeholder="Search by Title or Description"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        prefix={<SearchOutlined />}
        style={{
          marginBottom: '16px',
          height: '48px',
          borderRadius: '8px',
          fontSize: '16px'
        }}
      />
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={12}>
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
        <Col span={12}>
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
      <Select
        placeholder="Select status"
        value={selectedStatus}
        onChange={(value) => setSelectedStatus(value)}
        style={{
          width: '100%',
          height: '48px',
          borderRadius: '8px',
          fontSize: '16px'
        }}
      >
        <Option value="">All</Option>
        <Option value="published">
          <span style={{ color: 'green' }}>Published</span>
        </Option>
        <Option value="draft">
          <span style={{ color: 'red' }}>Draft</span>
        </Option>
        <Option value="private">
          <span style={{ color: 'orange' }}>Private</span>
        </Option>
      </Select>
    </div>
  );
};

export default SearchPost;
