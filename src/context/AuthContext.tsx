import React, { createContext, useState, useContext, useEffect } from 'react';
import { IUser } from '../models/Users';
import * as authService from '../services/auth';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<IUser>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, avatar: File, role: string, createDate: Date, updateDate: Date) => Promise<void>;
  updateUser: (userData: IUser) => Promise<void>;
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, error: error ?? undefined }}>
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