import React, { createContext, useState, useContext, useEffect } from 'react';
import { IUser } from '../models/Users';
import { IPost } from '../models/Posts';
import * as authService from '../services/auth';
import * as postService from '../services/posts';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<IUser>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, avatar: File, role: string, createDate: Date, updateDate: Date) => Promise<void>;
  updateUser: (userData: IUser) => Promise<void>;
  error?: string;
  posts: IPost[];
  getPostById: (id: string) => Promise<IPost>;
  createPost: (post: IPost, postImage?: File) => Promise<void>;
  updatePost: (post: IPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  setPosts: (posts: IPost[]) => void;
  getUserById: (id: string) => Promise<IUser>;
  getPostCountByUserId: (userId: string) => Promise<number>;
  createUser: (userData: IUser) => Promise<IUser | null>;
  checkEmailExists: (email: string) => Promise<boolean>;
  checkOldEmail: (email: string) => Promise<boolean>;
  checkOldPassword: (password: string) => Promise<boolean>;
  updateUserProfile: (userId: string, userData: Partial<IUser>) => Promise<IUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await postService.getAllPosts();
        if (user) {
          const userPosts = fetchedPosts.filter(post => post.userId === user.id);
          setPosts(userPosts);
        }
      } catch (error) {
        console.error('Failed to fetch posts', error);
        setError('Failed to fetch posts');
      }
    };
    fetchPosts();
  }, [user]);

  const login = async (email: string, password: string): Promise<IUser> => {
    try {
      const user = await authService.login(email, password);
      if (user.role !== 'admin' && user.role !== 'customer') {
        throw new Error('Only admin and customer users can log in');
      }
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      setError(null);
      return user;
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'An error occurred during login');
      } else if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      setError('Failed to log out');
    }
  };

  const register = async (name: string, email: string, password: string, avatar: File, role: string, createDate: Date, updateDate: Date) => {
    try {
      const emailExists = await authService.checkEmailExists(email);
      if (emailExists) {
        throw new Error('Email already exists. Please use another email.');
      }
      const newUser = await authService.register(name, email, password, avatar, role, createDate, updateDate);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setError(null);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'An error occurred during registration');
      } else {
        if (err instanceof Error) {
          setError(err.message || 'An unexpected error occurred');
        } else {
          setError('An unexpected error occurred');
        }
      }
      throw err;
    }
  };

  const createUser = async (userData: IUser): Promise<IUser | null> => {
    try {
      const emailExists = await authService.checkEmailExists(userData.email);
      if (emailExists) {
        throw new Error('Email already exists. Please use another email.');
      }
      const newUser = await authService.createUser(userData);
      return newUser; // Return the new user
    } catch (error) {
      console.error('Failed to create user', error);
      setError('Failed to create user');
      return null; // Return null on error
    }
  };

  const getPostById = async (id: string): Promise<IPost> => {
    const post = await postService.getPostById(id);
    return post;
  };

  const createPost = async (post: IPost, postImage?: File) => {
    if (!user) {
      throw new Error('You must be logged in to create a post');
    }
    try {
      const newPost = await postService.createPost(post, postImage);
      setPosts([...posts, newPost]);
      localStorage.setItem('posts', JSON.stringify([...posts, newPost]));
      setError(null);
    } catch (error) {
      const err = error as any;
      if (err.message === 'Service is currently unavailable. Please try again later.') {
        setError('Service is currently unavailable. Please try again later.');
      } else {
        setError('Failed to create post');
      }
      console.error('Failed to create post', error);
      throw error;
    }
  };

  const updateUser = async (userData: IUser) => {
    try {
      const updatedUser = await authService.updateUser(userData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update user', error);
      setError('Failed to update user');
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

  const getUserById = async (id: string): Promise<IUser> => {
    try {
      const user = await authService.getUserById(id);
      return user;
    } catch (error) {
      console.error('Failed to fetch user', error);
      throw error;
    }
  };

  const getPostCountByUserId = async (userId: string) => {
    try {
      const postCount = await postService.getPostCountByUserId(userId);
      return postCount;
    } catch (error) {
      console.error('Failed to fetch post count by user', error);
      throw error;
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    const emailExists = await authService.checkEmailExists(email);
    return emailExists;
  };

  const updateUserProfile = async (id: string, userData: Partial<IUser>): Promise<IUser> => {
    try {
      const updatedUser = await authService.updateUserProfile(id, userData);
      if (user && user.id === id) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user profile', error);
      setError('Failed to update user profile');
      throw error;
    }
  };

  const checkOldEmail = async (email: string): Promise<boolean> => {
    const emailExists = await authService.checkOldEmail(email);
    return emailExists;
  };

  const checkOldPassword = async (password: string): Promise<boolean> => {
    const passwordExists = await authService.checkOldPassword(password);
    return passwordExists;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, error: error ?? undefined, posts, getPostById, createPost, updatePost, deletePost, setPosts, getPostCountByUserId, createUser, checkEmailExists, getUserById, updateUserProfile, checkOldEmail, checkOldPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};