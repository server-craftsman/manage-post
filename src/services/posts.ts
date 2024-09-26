import { IPost } from '../models/Posts';
const API_URL = '/posts';
import axiosInstance from '../axiosConfig';
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
  await axiosInstance.delete(`${API_URL}/${id}`);
};

