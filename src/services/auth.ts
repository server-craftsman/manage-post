import { IUser } from '../models/Users';
import axios from 'axios'; 
const API_URL = '/users';
import axiosInstance from '../axiosConfig';
export const login = async (email: string, password: string): Promise<IUser> => {
  try {
    const response = await axiosInstance.get<IUser[]>(API_URL); 
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
  localStorage.removeItem('user'); // Remove user data from local storage
};

export const register = async (name: string, email: string, password: string, avatar: File, role: string, createDate: Date, updateDate: Date): Promise<IUser> => {
  try {
    const reader = new FileReader();
    const avatarBase64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(avatar);
    });

    const userData = {
      name,
      email,
      password,
      role,
      createDate: createDate.toISOString(),
      updateDate: updateDate.toISOString(),
      avatar: avatarBase64
    };

    const response = await axiosInstance.post<IUser>(API_URL, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 413) {
        throw new Error('Payload Too Large');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('Failed to register user');
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const response = await axiosInstance.get<IUser[]>(API_URL); // Use axios instance
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const getUserById = async (id: string): Promise<IUser> => {
  const response = await axiosInstance.get<IUser>(`${API_URL}/${id}`);
  if (!response.data) {
    throw new Error('Failed to fetch user');
  }
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}`);
};

export const updateUser = async (userData: IUser): Promise<IUser> => {
  const response = await axiosInstance.put(`${API_URL}/${userData.id}`, userData);
  return response.data;
};

export const createUser = async (userData: IUser): Promise<IUser | null> => {
  try {
    const response = await axiosInstance.post<IUser>(API_URL, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 413) {
        throw new Error('Payload Too Large');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('Failed to create user');
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get<IUser[]>(API_URL);
    const users = response.data;
    return users.some(user => user.email === email);
  } catch (error) {
    throw new Error('Failed to check email');
  }
};

