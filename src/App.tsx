import { createBrowserRouter, RouterProvider } from 'react-router-dom';
 import React from 'react'
 import AdminLayout from './layout/admin/AdminLayout';
 import CustomerLayout from './layout/customer/CustomerLayout';
 import Home from './pages/customers/Home';
 import Login from './pages/Login';
 import Dashboard from './pages/admin/Dashboard';
 import { AuthProvider } from './context/AuthContext';
 const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <CustomerLayout />,
      children: [
        {
          index: true,
          element: <Home />,
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
      ],
    },
  ])
   return (
       <AuthProvider>
         <RouterProvider router={router} />
       </AuthProvider>
   )
 }
 
 export default App