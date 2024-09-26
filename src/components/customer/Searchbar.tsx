import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Input, Dropdown, Menu } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { IPost } from '../../models/Posts';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder: string;
  searchResults: IPost[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder, searchResults }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(query);
    }, 300); // Adjust the delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);
  const filteredResults = useMemo(() => {
    return query.trim() ? searchResults : [];
  }, [query, searchResults]);

  const menu = (
    <Menu>
      {filteredResults.map((post) => (
        <Menu.Item key={post.id}>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} visible={filteredResults.length > 0}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        prefix={<SearchOutlined />}
        style={{ 
          width: '300px', 
          borderRadius: '24px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
          border: '1px solid #d9d9d9' 
        }}
      />
    </Dropdown>
  );
};

export default SearchBar;