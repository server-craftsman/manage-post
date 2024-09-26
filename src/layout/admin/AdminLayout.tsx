import { Outlet } from "react-router-dom";
import { Layout, Typography } from 'antd';
import { useAuth } from "../../context/AuthContext";
import Navbar from "./SidebarAdmin";

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const { user } = useAuth();
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navbar />
      <Layout>
        <Header style={{ background: '#1a1a1a', padding: '0 30px', borderBottom: '2px solid #ffd700', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={user?.avatar} alt="User Avatar" style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '15px', border: '2px solid #ffd700' }} />
            <Title level={2} style={{ color: '#ffd700', margin: 0, fontWeight: 'bold' }}>
              Welcome, {user?.name}
            </Title>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#ffffff', minHeight: 360, borderRadius: '8px' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
