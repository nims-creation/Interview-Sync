import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'interviewer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'candidate' | 'interviewer') => Promise<void>;
  googleAuth: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for saved user session in localStorage
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { user, token } = response.data.data;

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to login';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string, name: string, role: 'candidate' | 'interviewer') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        name,
        role
      });

      const { user, token } = response.data.data;

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to register';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const googleAuth = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/google/google', {
        token
      });

      const { user, token: jwtToken } = response.data.data;

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', jwtToken);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Google authentication failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      await axios.post('http://localhost:5000/api/auth/logout');

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } catch (err: any) {
      // Logout should succeed even if API fails
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearError = () => {
    setError(null);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    googleAuth,
    logout,
    clearError
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};