import { IPost } from '../models/Posts';
const API_URL = '/posts';
import axiosInstance from '../axiosConfig';
import axios from 'axios';

export const fetchPosts = async (): Promise<IPost[]> => {
  const response = await axiosInstance.get<IPost[]>(API_URL);
  if (!response.data) {
    throw new Error('Failed to fetch posts');
  }
  return response.data;
};

export const getPostById = async (id: string): Promise<IPost> => {
  const response = await axiosInstance.get<IPost>(`${API_URL}/${id}`);
  if (!response.data) {
    throw new Error('Failed to fetch post');
  }
  return response.data;
};

export const getAllPosts = async (): Promise<IPost[]> => {
  const response = await axiosInstance.get<IPost[]>(API_URL);
  if (!response.data) {
    throw new Error('Failed to fetch posts');
  }
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Failed to delete post');
  }
};

export const createPost = async (post: IPost, postImage?: File): Promise<IPost> => {
  try {
    const reader = new FileReader();
    const postImageBase64 = await new Promise<string>((resolve, reject) => {
      if (postImage) {
        reader.readAsDataURL(postImage);
      } else {
        reject(new Error("postImage is undefined"));
      }
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

    const postData = {
      ...post,
      postImage: postImageBase64,
      createDate: post.createDate.toISOString(),
      updateDate: post.updateDate.toISOString(),
    };
    

    const response = await axiosInstance.post<IPost>(API_URL, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 503) {
        throw new Error('Service is currently unavailable. Please try again later.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('Failed to create post');
  }
};

export const updatePost = async (post: IPost): Promise<IPost> => {
  const response = await axiosInstance.put<IPost>(`${API_URL}/${post.id}`, post);
  if (!response.data) {
    throw new Error('Failed to update post');
  }
  return response.data;
};

export const getPostsByUserId = async (userId: string): Promise<IPost[]> => {
  const response = await axiosInstance.get<IPost[]>(`${API_URL}/user/${userId}`);
  if (!response.data) {
    throw new Error('Failed to fetch posts by user');
  }
  return response.data;
};

export const getPostsByCategory = async (category: string): Promise<IPost[]> => {
  const response = await axiosInstance.get<IPost[]>(`${API_URL}/category/${category}`);
  if (!response.data) {
    throw new Error('Failed to fetch posts by category');
  }
  return response.data;
};

export const getPostsByCategoryAndUserId = async (category: string, userId: string): Promise<IPost[]> => {
  const response = await axiosInstance.get<IPost[]>(`${API_URL}/category/${category}/user/${userId}`);
  if (!response.data) {
    throw new Error('Failed to fetch posts by category and user');
  }
  return response.data;
};