import { Avatar, Button, Card, Popconfirm } from 'antd';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, deleteUser } from '../../services/auth';
import { IUser } from '../../models/Users';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
const UserDetail = () => {
    const [dataSource, setDataSource] = useState<IUser | null>(null);
    const navigate = useNavigate();

    let { id } = useParams();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserById(id!);
                setDataSource(user);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchUser();
    }, [id]);

    const handleDeleteUser = async (id: string) => {
        console.log("user", id);
        await deleteUser(id);
        navigate('/admin/users');
        if (dataSource) {
            setDataSource(null);
        }
    }

    if (!dataSource) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#e0e0e0' }}>
            <Card
                style={{
                    width: 500,
                    boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.3)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                }}
                cover={
                    <div style={{ backgroundColor: '#001529', padding: '30px', textAlign: 'center' }}>
                        <Avatar size={120} src={dataSource.avatar} />
                        <h2 style={{ color: '#fff', marginTop: '15px', fontSize: '24px' }}>{dataSource.name}</h2>
                    </div>
                }
            >
                <Card.Meta
                    description={
                        <div style={{ padding: '30px', fontSize: '16px' }}>
                            <p><strong>Name:</strong> {dataSource.name}</p>
                            <p><strong>Email:</strong> {dataSource.email}</p>
                            <p><strong>ID:</strong> {dataSource.id}</p>
                            <p><strong>Create At:</strong> {new Date(dataSource.createDate).toLocaleDateString()}</p>
                            <p><strong>Update At:</strong> {new Date(dataSource.updateDate).toLocaleDateString()}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                            <Link to={`/admin/users`}>
                                <Button type="default" icon={<ArrowLeftOutlined />} style={{ marginTop: '20px', width: '100%', height: '45px', fontSize: '16px' }}>Back to Users</Button>
                            </Link>
                            <Popconfirm
                                title="Delete the user"
                                description="Are you sure to delete this user?"
                                onConfirm={() => handleDeleteUser(id!)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger type="primary" style={{ marginTop: '20px', width: '48%', height: '45px', fontSize: '16px' }}>Delete</Button>
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
