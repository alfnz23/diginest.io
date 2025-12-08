"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { triggerWelcomeSeries } from "@/lib/emailAutomation";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
  role?: string;
  subscription_status?: string;
  is_seller?: boolean;
  joinedAt?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{success: boolean, message: string}>; // ← OPRAVA 1
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(c => c.trim().startsWith('diginest-user='));
      
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Failed to load user from cookies:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.user) {
        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        return true;
      }

      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // ← OPRAVA 2: Kompletně přepsaná register funkce
  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{success: boolean, message: string}> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();
      
      setState((prev) => ({ ...prev, isLoading: false }));

      if (data.success && data.user) {
        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });

        try {
          await triggerWelcomeSeries(email, name);
        } catch (emailError) {
          console.warn("Email automation error:", emailError);
        }

        return {
          success: true,
          message: data.message || "Registration successful! Welcome to DigiNest."
        };
      } else {
        return {
          success: false,
          message: data.error || data.message || "Registration failed. Please try again."
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
      return {
        success: false,
        message: "Network error occurred. Please check your connection and try again."
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      setState((prev) => ({
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
