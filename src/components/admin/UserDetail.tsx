import { Avatar, Button, Card, Popconfirm } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const UserDetail = () => {
    const [dataSuorce, setDataSource] = useState([]);
    const navigate = useNavigate();

    let {id} = useParams();
    useEffect(() => {
        axios.get(`https://66f4051b77b5e8897097eaef.mockapi.io/users/${id}`).then((res) => {
            setDataSource(res.data);
        })
    }, [id]);
      const handleDeleteUser = async(id) =>{
    console.log("user",id);
    await axios.delete(`https://66f4051b77b5e8897097eaef.mockapi.io/users/${id}`);
    navigate('/admin/users');
  const listAfterDelete = dataSource.filter((user) => user.id !== id);
  setDataSource(listAfterDelete);
  }
  return (
    <div>
      <h1>Detail</h1>
      <Card
        style={{
          minWidth: 300,
        }}
      >
        <Card.Meta
          avatar={<Avatar src={dataSuorce.avatar}/>}
          title="Card title"
          description={
            <>
              <p>Name: {dataSuorce.name}</p>
      <p>Email: {dataSuorce.email}</p>
      <p>ID: {dataSuorce.id}</p>
      <p>Create At: {dataSuorce.createDate}</p>
      <p>Update At: {dataSuorce.updateDate}</p>
            <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => handleDeleteUser(id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
            </>
          }
        />
      </Card>
      
     
    </div>
  )
}

export default UserDetail
