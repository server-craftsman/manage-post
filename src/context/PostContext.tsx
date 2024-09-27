import React, { useState, useContext, useEffect } from 'react';
import { IPost } from '../models/Posts';
import { useAuth } from './AuthContext';
import * as postService from '../services/posts';
import { IUser } from '../models/Users';

interface PostContextType {
    posts: IPost[];
    createPost: (post: IPost, postImage?: File) => Promise<void>;
    updatePost: (post: IPost) => Promise<void>;
    deletePost: (id: string) => Promise<void>;
    setPosts: (posts: IPost[]) => void;
    user: IUser | null; // Add user to the context type
}

const PostContext = React.createContext<PostContextType | undefined>(undefined);

export const PostContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedPosts = await postService.fetchPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Failed to fetch posts', error);
            }
        };
        fetchPosts();
    }, []);

    const createPost = async (post: IPost, postImage?: File) => {
        if (!user) {
            throw new Error('You must be logged in to create a post');
        }
        try {
            const newPost = await postService.createPost(post, postImage);
            setPosts([...posts, newPost]);
        } catch (error) {
            console.error('Failed to create post', error);
            throw error;
        }
    };

    const updatePost = async (post: IPost) => {
        try {
            const updatedPost = await postService.updatePost(post);
            if (updatedPost !== undefined && updatedPost !== null) {
                setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
            } else {
                console.error('Failed to update post: updatePost returned void');
            }
        } catch (error) {
            console.error('Failed to update post', error);
            throw error;
        }
    };

    const deletePost = async (id: string) => {
        try {
            await postService.deletePost(id);
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete post', error);
            throw error;
        }
    };

    return (
        <PostContext.Provider value={{ posts, createPost, updatePost, deletePost, setPosts, user }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePost = () => {
    const context = useContext(PostContext);
    if (context === undefined) {
        throw new Error('usePost must be used within a PostContextProvider');
    }
    return context;
};

export default PostContextProvider;
