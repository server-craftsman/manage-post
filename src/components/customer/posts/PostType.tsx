import React from 'react';
import { IPost } from '../../../models/Posts';
import { formatDate } from '../../../utils/formatDate'; // Import the formatDate function

interface PostTypeProps {
  post: IPost;
}

const PostType: React.FC<PostTypeProps> = ({ post }) => {
  // Kiểm tra xem createdAt và updatedAt có phải là đối tượng Date không
  const createdAt = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);
  const updatedAt = post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt);

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <img src={post.postImage} alt={post.title} />
      <p>Status: {post.status}</p>
      <p>Created At: {formatDate(createdAt)}</p> 
      <p>Updated At: {formatDate(updatedAt)}</p>
    </div>
  );
}

export default PostType;
