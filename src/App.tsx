import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import AdminLayout from './layout/admin/AdminLayout';
import CustomerLayout from './layout/customer/CustomerLayout';
import Home from './pages/customers/Home';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';
import PostDetail from './components/customer/posts/PostDetail';
import PostList from './components/customer/posts/PostList';

import ManageUsers from './pages/admin/ManageUsers';
import UserDetail from './components/admin/UserDetail';

import CustomerProfile from './components/customer/profile/Customerprofile';
import ManagePost from './pages/admin/ManagePost';
import PostDetails from './components/admin/PostDetails';
// Set up axios interceptor
axios.interceptors.request.use(
  config => {
    // Add any request interceptors here
    console.log('Request Interceptor', config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    // Add any response interceptors here
    console.log('Response Interceptor', response);
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <CustomerLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: '/posts/:id',
          element: <PostDetail />,
        },
        {
          path: '/posts',
          element: <PostList />,
        },
        {
          path: '/profile',
          element: <CustomerProfile />,
        }
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'users',
          element: <ManageUsers/>
        },
        {
          path: 'detail/:id',
          element: <UserDetail />,
        },
        {
          path: 'manage-post',
          element: <ManagePost />,
        },
        {
          path: 'post-detail/:id',
          element: <PostDetails />,
        }
      ],
    },

  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;