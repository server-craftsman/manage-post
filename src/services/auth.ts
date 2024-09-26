import { IUser } from '../models/Users';
import axios from 'axios'; 
const API_URL = '/api/users';

export const login = async (email: string, password: string): Promise<IUser> => {
  try {
    const response = await axios.get<IUser[]>(API_URL); // Use axios instance
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

export const register = async (username: string, email: string, password: string): Promise<IUser> => {
  try {
    const response = await axios.post<IUser>(API_URL, { // Use axios instance
      username,
      email,
      password,
      role: 'user', // Default role
      createdAt: new Date(), // Use Date object for createdAt
      updatedAt: new Date(), // Use Date object for updatedAt
      avatar: 'path/to/image', // Use avatar instead of userImage
    });
    return response.data;
  } catch (error) {
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