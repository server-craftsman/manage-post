import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/customer/Searchbar';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Button, Dropdown, Layout } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined, HistoryOutlined } from '@ant-design/icons';
import { IPost } from '../../models/Posts';
import { fetchPosts } from '../../services/posts';
import type { MenuProps } from 'antd';
const { Header } = Layout;

const CustomHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<IPost[]>([]);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Filter search results from allPosts
    const results = allPosts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()));
    setSearchResults(results);
  };

  const handleResultClick = () => {
    setSearchResults([]);
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const results = await fetchPosts();
        setAllPosts(results);
      } catch (error) {
        console.error('Failed to fetch all posts:', error);
      }
    };

    fetchAllPosts();
  }, []);

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: <Link to="/history">History Post</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Log out',
      onClick: handleLogout,
    },
  ];

  return (
    <Header style={{ backgroundColor: 'white', boxShadow: '0 2px 8px #f0f1f2' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', marginRight: '8px', color: '#1890ff' }}>
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
          </svg>
          <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#000' }}>Blogs App</span>
        </Link>
        <SearchBar onSearch={handleSearch} placeholder="Search..." searchResults={searchResults} onResultClick={handleResultClick} />
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ marginRight: '16px' }}>Home</Link>
          {/* <Dropdown menu={(
            <Menu>
              <Menu.Item key="product1">Product 1</Menu.Item>
              <Menu.Item key="product2">Product 2</Menu.Item>
            </Menu>
          )}>
            <Button type="link" ref={dropdownRef}>
              Products <DownOutlined />
            </Button>
          </Dropdown>
          <Dropdown menu={(
            <Menu>
              <Menu.Item key="resource1">Resource 1</Menu.Item>
              <Menu.Item key="resource2">Resource 2</Menu.Item>
            </Menu>
          )}>
            <Button type="link" ref={dropdownRef}>
              Resources <DownOutlined />
            </Button>
          </Dropdown> */}
          <Link to="/create-post" style={{ marginLeft: '16px' }}>
            <Button type="link" icon={<EditOutlined />}>Write</Button>
          </Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar src={typeof user.avatar === 'string' ? user.avatar : 'default-avatar.png'} size={40} style={{ marginRight: '8px' }} />
                <span style={{ fontWeight: 'bold', color: '#000' }}>{user.name}</span>
              </div>
            </Dropdown>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/login" style={{ marginRight: '16px' }}>Log in</Link>
              <Link to="/register">
                <Button type="primary">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Header>
  );
};

export default CustomHeader;