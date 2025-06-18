"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { triggerWelcomeSeries } from '@/lib/emailAutomation';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
  purchases?: string[];
  joinedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@diginest.io',
    name: 'Admin User',
    isAdmin: true,
    purchases: [],
    joinedAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'customer@example.com',
    name: 'John Doe',
    isAdmin: false,
    purchases: ['product-1', 'product-2'],
    joinedAt: '2024-02-15',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      const savedUser = localStorage.getItem('diginest-user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
      // Clear corrupted data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('diginest-user');
      }
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check credentials against mock users
      const user = mockUsers.find(u => u.email === email);

      if (user && (password === 'password123' || password === 'admin123')) {
        const loggedInUser = { ...user };

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('diginest-user', JSON.stringify(loggedInUser));
        }

        setState({
          user: loggedInUser,
          isLoading: false,
          isAuthenticated: true,
        });

        return true;
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        isAdmin: false,
        purchases: [],
        joinedAt: new Date().toISOString(),
      };

      // Add to mock users (in real app, this would be an API call)
      mockUsers.push(newUser);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('diginest-user', JSON.stringify(newUser));
      }

      setState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      });

      // Trigger welcome email series safely
      try {
        triggerWelcomeSeries(newUser);
      } catch (emailError) {
        console.warn('Email automation error:', emailError);
        // Don't fail registration due to email issues
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('diginest-user');
      }
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      if (typeof window !== 'undefined') {
        localStorage.setItem('diginest-user', JSON.stringify(updatedUser));
      }
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
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
