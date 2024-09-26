import { IPost } from '../models/Posts';
import axios from 'axios';
const API_URL = '/api/posts';

export const fetchPosts = async (): Promise<IPost[]> => {
  const response = await axios.get<IPost[]>(API_URL);
  if (!response.data) {
    throw new Error('Failed to fetch posts');
  }
  return response.data;
};

export const getPostById = async (id: string): Promise<IPost> => {
  const response = await axios.get<IPost>(`${API_URL}/${id}`);
  if (!response.data) {
    throw new Error('Failed to fetch post');
  }
  return response.data;
};

