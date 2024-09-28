import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IPost } from '../../../models/Posts';
import * as postService from '../../../services/posts';

const HistoryPost: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user) {
        try {
          const userPosts = await postService.getPostsByUserId(user.id as string);
          console.log(userPosts);   
          setPosts(userPosts);
        } catch (err) {
          setError('Failed to fetch user posts');
          console.error('Failed to fetch user posts', err);
        }
      }
    };

    fetchUserPosts();
  }, [user]);

  if (!user) {
    return <div>Please log in to see your post history.</div>;
  }

  return (
    <div>
      <h2>{user.name}'s Post History</h2>
    <h3>Phạm Thắm</h3>
      {error && <p>{error}</p>}
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              {/* <p>{post.createDate}</p>
              <p>{post.updateDate}</p> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPost;
