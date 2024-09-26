import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Input, Dropdown, Menu } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { IPost } from '../../models/Posts';
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder: string;
  searchResults: IPost[];
  onResultClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder, searchResults, onResultClick }) => {
  const [query, setQuery] = useState('');
  const previousQuery = useRef(query);

  const debouncedSearch = useCallback(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query !== previousQuery.current) {
        onSearch(query);
        previousQuery.current = query;
      }
    }, 300); // Adjust the delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  useEffect(() => {
    return debouncedSearch();
  }, [query, debouncedSearch]);

  const filteredResults = useMemo(() => {
    return query.trim() ? searchResults : [];
  }, [query, searchResults]);

  const menuItems = filteredResults.map((post) => ({
    key: post.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <img src={post.postImage} alt={post.title} style={{ width: '35px', height: '35px', marginRight: '8px' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '8px' }}>
          <Link to={`/posts/${post.id}`} onClick={onResultClick} style={{ fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
            {post.title}
          </Link>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{post.description.substring(0, 50)}...</p>
        </div>
        <Link to={`/posts/${post.id}`} onClick={onResultClick}>
          <button style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#1890ff', color: '#fff', border: 'none', cursor: 'pointer' }}>
            View Details
          </button>
        </Link>
      </div>
    ),
    style: { display: 'flex', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #e0e0e0' }
  }));

  return (
    <Dropdown menu={{ items: menuItems }} open={filteredResults.length > 0}>
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