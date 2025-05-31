import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../lib/api';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { username, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Failed to login. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Successfully logged out');
  };

  const register = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', { username, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Successfully registered!');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Failed to register. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
