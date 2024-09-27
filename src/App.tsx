import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import './axiosConfig';
import { AuthProvider } from './context/AuthContext';
const AdminLayout = lazy(() => import('./layout/admin/AdminLayout'));
const CustomerLayout = lazy(() => import('./layout/customer/CustomerLayout'));
const Home = lazy(() => import('./pages/customers/Home'));
const Login = lazy(() => import('./pages/authentication/Login'));
const Register = lazy(() => import('./pages/authentication/Register'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const PostDetail = lazy(() => import('./components/customer/posts/PostDetail'));
const PostList = lazy(() => import('./components/customer/posts/PostList'));
const Unauthorized = lazy(() => import('./pages/errors/Unauthorized'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const UserDetail = lazy(() => import('./components/admin/UserDetail'));
const ManagePost = lazy(() => import('./pages/admin/ManagePost'));
const PostDetails = lazy(() => import('./components/admin/PostDetails'));
const CustomerProfile = lazy(() => import('./components/customer/profile/CustomerProfile'));
const CreatePost = lazy(() => import('./components/customer/posts/CreatePost'));

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <CustomerLayout />,
      children: [
        {
          index: true,
          element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense>,
        },
        {
          path: 'posts/:id',
          element: <Suspense fallback={<div>Loading...</div>}><PostDetail /></Suspense>,
        },
        {
          path: 'posts',
          element: <Suspense fallback={<div>Loading...</div>}><PostList /></Suspense>,
        },
        {
          path: 'profile',
          element: <Suspense fallback={<div>Loading...</div>}><CustomerProfile /></Suspense>,
        },
        {
          path: 'create-post',
          element: <Suspense fallback={<div>Loading...</div>}><CreatePost /></Suspense>,
        }
      ],
    },
    {
      path: 'unauthorized',
      element: <Suspense fallback={<div>Loading...</div>}><Unauthorized /></Suspense>,
    },
    {
      path: 'login',
      element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense>,
    },
    {
      path: 'register',
      element: <Suspense fallback={<div>Loading...</div>}><Register /></Suspense>,
    },
    {
      path: 'admin',
      element: <Suspense fallback={<div>Loading...</div>}><AdminLayout /></Suspense>,
      children: [
        {
          path: 'dashboard',
          element: <Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>,
        },
        {
          path: 'manage-users',
          element: <Suspense fallback={<div>Loading...</div>}><ManageUsers /></Suspense>
        },
        {
          path: 'detail/:id',
          element: <Suspense fallback={<div>Loading...</div>}><UserDetail /></Suspense>,
        },
        {
          path: 'manage-post',
          element: <Suspense fallback={<div>Loading...</div>}><ManagePost /></Suspense>,
        },
        {
          path: 'post-detail/:id',
          element: <Suspense fallback={<div>Loading...</div>}><PostDetails /></Suspense>,
        }
      ],
    },
  ]);

  return (  
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Suspense>
  );
};

export default App;