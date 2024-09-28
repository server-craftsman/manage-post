import { Avatar, Button, Card, Popconfirm, Spin, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, deleteUser } from '../../services/auth';
import { IUser } from '../../models/Users';
import { IPost } from '../../models/Posts';
import { ArrowLeftOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import * as postService from '../../services/posts';
import SearchPost from './SearchPost';
import dayjs, { Dayjs } from 'dayjs';
const { Title, Text } = Typography;

const UserDetail = () => {
    const [dataSource, setDataSource] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userPosts, setUserPosts] = useState<IPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<IPost[]>([]);
    const navigate = useNavigate();
    let { id } = useParams();
    const [searchText, setSearchText] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            try {
                const user = await getUserById(id!);
                setDataSource(user);
                const allPosts = await postService.getAllPosts();
                const userPosts = allPosts.filter(post => post.userId === user.id);
                setUserPosts(userPosts);
                setFilteredPosts(userPosts);
            } catch (error) {
                console.error('Failed to fetch user or posts', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndPosts();
    }, [id]);

    useEffect(() => {
        const filtered = userPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                                  post.description.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = selectedStatus === "" || post.status === selectedStatus;
            const matchesDateRange = (!selectedStartDate || dayjs(post.createDate).isSameOrAfter(selectedStartDate, 'day')) &&
                                     (!selectedEndDate || dayjs(post.createDate).isSameOrBefore(selectedEndDate, 'day'));
            return matchesSearch && matchesStatus && matchesDateRange;
        });
        setFilteredPosts(filtered);
    }, [searchText, selectedStatus, selectedStartDate, selectedEndDate, userPosts]);

    const handleDeleteUser = async (id: string) => {
        console.log("user", id);
        try {
            await deleteUser(id);
            message.success('User deleted successfully');
            if (dataSource) {
                setDataSource(null);
            }
            navigate('/admin/manage-users');
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Text type={status === 'active' ? 'success' : 'danger'}>{status}</Text>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (date: string) => <Text>{new Date(date).toLocaleDateString()}</Text>,
        },
        {
            title: 'Post Image',
            dataIndex: 'postImage',
            key: 'postImage',
            render: (image: string) => <Avatar src={image} alt="post" style={{ width: '100px', height: '100px' }} />,
        }
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!dataSource) {
        return <div style={{ textAlign: 'center', padding: '50px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Title level={2}>User not found</Title>
        </div>;
    }

    return (
        <div style={{ padding: '40px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    margin: '0 auto',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    borderRadius: '30px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    marginBottom: '40px',
                    transition: 'all 0.3s ease',
                }}
                hoverable
                cover={
                    <div style={{ 
                        background: 'linear-gradient(45deg, #001529, #003366)', 
                        padding: '60px', 
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle, transparent 20%, #001529 80%)',
                            opacity: 0.7
                        }}></div>
                        <Avatar size={200} icon={<UserOutlined />} src={dataSource.avatar} style={{ border: '5px solid white' }} />
                        <Title level={2} style={{ color: '#fff', marginTop: '30px', fontSize: '36px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{dataSource.name}</Title>
                    </div>
                }
            >
                <Card.Meta
                    description={
                        <div style={{ padding: '30px', fontSize: '18px', lineHeight: '2' }}>
                            <Text strong>ID:</Text> <Text>{dataSource.id}</Text><br/>
                            <Text strong>Role:</Text> <Text>{dataSource.role}</Text><br/>
                            <Text strong>Name:</Text> <Text>{dataSource.name}</Text><br/>
                            <Text strong>Email:</Text> <Text>{dataSource.email}</Text><br/>
                            <Text strong>Created At:</Text> <Text>{new Date(dataSource.createDate).toLocaleDateString()}</Text><br/>
                            <Text strong>Updated At:</Text> <Text>{new Date(dataSource.updateDate).toLocaleDateString()}</Text><br/>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                                <Button type="default" icon={<ArrowLeftOutlined />} 
                                    style={{ 
                                        background: 'linear-gradient(45deg, #2196F3, #21CBF3)', 
                                        borderColor: '#2196F3', 
                                        color: '#fff', 
                                        fontWeight: 'bold', 
                                        padding: '10px 20px', 
                                        borderRadius: '50px', 
                                        boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }} 
                                    onClick={() => navigate('/admin/manage-users')}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    Back to Users
                                </Button>
                                <Popconfirm
                                    title="Delete the user"
                                    description="Are you sure to delete this user?"
                                    onConfirm={() => handleDeleteUser(id!)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger type="primary" icon={<DeleteOutlined />} 
                                        style={{ 
                                            background: 'linear-gradient(45deg, #FF416C, #FF4B2B)', 
                                            borderColor: '#FF416C', 
                                            color: '#fff', 
                                            fontWeight: 'bold', 
                                            padding: '10px 20px', 
                                            borderRadius: '50px', 
                                            boxShadow: '0 4px 15px rgba(255, 65, 108, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        Delete
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    }
                />
            </Card>
            <Card
                title={<Title level={3} style={{margin: 0}}>{`User Posts (${filteredPosts.length})`}</Title>}
                style={{
                    width: '100%',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    borderRadius: '30px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                }}
                styles={{
                    header: {
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        color: 'white',
                        borderBottom: 'none'
                    },
                    body: {
                        padding: '30px'
                    }
                }}
            >
                <SearchPost
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedStartDate={selectedStartDate}
                    setSelectedStartDate={setSelectedStartDate}
                    selectedEndDate={selectedEndDate}
                    setSelectedEndDate={setSelectedEndDate}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />
                <Table 
                    columns={columns} 
                    dataSource={filteredPosts} 
                    rowKey="id" 
                    pagination={{
                        pageSize: 3,
                        style: {marginTop: '20px'},
                        itemRender: (_, type, originalElement) => {
                            if (type === 'prev') {
                                return <Button type="primary" style={{backgroundColor: 'linear-gradient(45deg, #4CAF50, #8BC34A)', borderColor: '#4CAF50'}}>Previous</Button>;
                            }
                            if (type === 'next') {
                                return <Button type="primary" style={{backgroundColor: 'linear-gradient(45deg, #4CAF50, #8BC34A)', borderColor: '#4CAF50'}}>Next</Button>;
                            }
                            return originalElement;
                        },
                    }}
                />
            </Card>
        </div>
    )
}

export default UserDetail
