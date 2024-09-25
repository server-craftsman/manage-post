import React, { createContext, useState, useContext, useEffect } from 'react';
import { IUser } from '../models/Users';
import * as authService from '../services/auth';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<IUser>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<IUser> => {
    try {
      const user = await authService.login(email, password); // This should return user details including role
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
        setError('An unexpected error occurred');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setError('Failed to log out');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const newUser = await authService.register(username, email, password);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, error }}>
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