import { Avatar, Button, Card, Popconfirm, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, deleteUser } from '../../services/auth';
import { IUser } from '../../models/Users';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';

const UserDetail = () => {
    const [dataSource, setDataSource] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    let { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserById(id!);
                setDataSource(user);
            } catch (error) {
                console.error('Failed to fetch user', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleDeleteUser = async (id: string) => {
        console.log("user", id);
        await deleteUser(id);
        navigate('/admin/manage-users');
        if (dataSource) {
            setDataSource(null);
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!dataSource) {
        return <div>User not found</div>;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '550px',
                    boxShadow: '0 15px 30px 0 rgba(0, 0, 0, 0.3)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                }}
                cover={
                    <div style={{ backgroundColor: '#001529', padding: '40px', textAlign: 'center' }}>
                        <Avatar size={150} src={dataSource.avatar} />
                        <h2 style={{ color: '#fff', marginTop: '20px', fontSize: '28px', fontWeight: 'bold' }}>{dataSource.name}</h2>
                    </div>
                }
            >
                <Card.Meta
                    description={
                        <div style={{ padding: '20px', fontSize: '16px', lineHeight: '1.6' }}>
                            <p><strong>ID:</strong> {dataSource.id}</p>
                            <p><strong>Role:</strong> {dataSource.role}</p>
                            <p><strong>Name:</strong> {dataSource.name}</p>
                            <p><strong>Email:</strong> {dataSource.email}</p>
                            <p><strong>Create At:</strong> {new Date(dataSource.createDate).toLocaleDateString()}</p>
                            <p><strong>Update At:</strong> {new Date(dataSource.updateDate).toLocaleDateString()}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <Link to={`/admin/manage-users`}>
                                    <Button type="default" icon={<ArrowLeftOutlined />} style={{ backgroundColor: "#0000FF", borderColor: "#0000FF", marginRight: "10px", color: "#fff", fontWeight: "bold", padding: "10px 20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>Back to Users</Button>
                                </Link>
                                <Popconfirm
                                    title="Delete the user"
                                    description="Are you sure to delete this user?"
                                    onConfirm={() => handleDeleteUser(id!)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger type="primary" icon={<DeleteOutlined />} style={{ backgroundColor: "#FF0000", borderColor: "#FF0000", color: "#fff", fontWeight: "bold", padding: "10px 20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>Delete</Button>
                                </Popconfirm>
                            </div>
                        </div>
                    }
                />
            </Card>
        </div>
    )
}

export default UserDetail
