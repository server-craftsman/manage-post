import React, { useEffect, useState } from 'react';
import { IPost } from '../../../models/Posts';
import PostType from './PostType';
import { fetchPosts } from '../../../services/posts';

interface PostListProps {
  posts?: IPost[]; // Make posts optional
}

const PostList: React.FC<PostListProps> = ({ posts: initialPosts = [] }) => {
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {posts.map(post => (
        <PostType key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;
