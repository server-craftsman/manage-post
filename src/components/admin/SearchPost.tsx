import React from 'react';
import { Input, DatePicker, Select, Button, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

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
  handleReset: () => void;
}

const SearchPost: React.FC<SearchPostProps> = ({
  searchText,
  setSearchText,
  selectedStartDate,
  setSelectedStartDate,
  selectedEndDate,
  setSelectedEndDate,
  selectedStatus,
  setSelectedStatus,
  handleReset,
}) => {

    const currentDate = dayjs();
    const hundredYearsAgo = currentDate.subtract(100, 'year');

    const handleEndDateChange = (date: Dayjs | null) => {
        if (!selectedStartDate) {
          message.warning('Please select a Start Date first.');
          setSelectedEndDate(null); // Reset the end date if no start date is selected
          return;
        }
    
        if (date && date.isBefore(selectedStartDate, 'day')) {
          message.warning('End Date should be greater than or equal to Start Date');
          setSelectedEndDate(null); // Reset the end date if it's invalid
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
    <div className="mb-4">
      <Input
        placeholder="Search by Title or Description"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-2"
      />
      <div className="flex mb-2">
        <DatePicker
          value={selectedStartDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
          className="mr-2"
          disabledDate={disableStartDate} // Disable dates more than 100 years ago
        />
        <DatePicker
          value={selectedEndDate}
          onChange={handleEndDateChange} // Use the new handler here
          placeholder="End Date"
        />
      </div>
      <Select
        placeholder="Select status"
        value={selectedStatus}
        onChange={(value) => setSelectedStatus(value)}
        className="mb-2"
        style={{ width: 200 }}
      >
        <Option value="">All Statuses</Option>
        <Option value="published" style={{ color: 'green' }}>Published</Option>
        <Option value="draft" style={{ color: 'red' }}>Draft</Option>
        <Option value="private"style={{ color: 'orange' }}>Private</Option>
      </Select>
      <Button onClick={handleReset}>Reset Filters</Button>
    </div>
  );
};

export default SearchPost;
