import { IUser } from '../models/Users';
import axios from 'axios'; 
const API_URL = '/api/users';

export const login = async (email: string, password: string): Promise<IUser> => {
  try {
    const response = await axios.get<IUser[]>(API_URL); 
    const users = response.data;
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const logout = async (): Promise<void> => {
  // No network request needed for logout
  localStorage.removeItem('user'); // Remove user data from local storage
};

export const register = async (name: string, email: string, password: string, avatar: File, role: string, createDate: Date, updateDate: Date): Promise<IUser> => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('createDate', createDate.toISOString());
    formData.append('updateDate', updateDate.toISOString());
    formData.append('avatar', avatar);

    const response = await axios.post<IUser>(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 413) {
      throw new Error('Payload Too Large');
    }
    throw new Error('Failed to register user');
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const response = await axios.get<IUser[]>(API_URL); // Use axios instance
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const getUserById = async (id: string): Promise<IUser> => {
  const response = await axios.get<IUser>(`${API_URL}/${id}`);
  if (!response.data) {
    throw new Error('Failed to fetch user');
  }
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateUser = async (userData: IUser): Promise<IUser> => {
  const response = await axios.put(`/api/users/${userData.id}`, userData);
  return response.data;
};