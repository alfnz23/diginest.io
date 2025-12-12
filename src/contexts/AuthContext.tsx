"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { triggerWelcomeSeries } from "@/lib/emailAutomation";
import { getSupabaseClient } from "@/lib/database"; // ✅ Správný import!

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
  register: (email: string, password: string, name: string) => Promise<{success: boolean, message: string}>;
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

  // ✅ Opravený useEffect s correct function name
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") return;

      try {
        const supabase = getSupabaseClient(); // ✅ Správný název funkce
        
        if (!supabase) {
          console.warn("Supabase not configured, falling back to cookie auth");
          // Fallback na cookies pokud Supabase není dostupné
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
              setState(prev => ({ ...prev, isLoading: false }));
            }
          } catch (cookieError) {
            console.error("Cookie fallback error:", cookieError);
            setState(prev => ({ ...prev, isLoading: false }));
          }
          return;
        }

        // ✅ Supabase auth flow
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase session error:", error);
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error("Failed to fetch user data:", userError);
            setState(prev => ({ ...prev, isLoading: false }));
            return;
          }

          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: userData?.name || session.user.email!,
            isAdmin: userData?.role === 'admin',
            role: userData?.role || 'customer',
            subscription_status: userData?.subscription_status,
            is_seller: userData?.is_seller || false,
            joinedAt: userData?.created_at,
          };

          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // ✅ Listen na auth změny
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setState({
              user: {
                id: session.user.id,
                email: session.user.email!,
                name: userData?.name || session.user.email!,
                isAdmin: userData?.role === 'admin',
                role: userData?.role || 'customer',
                subscription_status: userData?.subscription_status,
                is_seller: userData?.is_seller || false,
                joinedAt: userData?.created_at,
              },
              isLoading: false,
              isAuthenticated: true,
            });
          } else if (event === 'SIGNED_OUT') {
            setState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // ✅ Hybrid login - zkusí Supabase, pak API fallback
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const supabase = getSupabaseClient();
      
      if (supabase) {
        // Zkusí Supabase auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Supabase login error:", error);
          setState(prev => ({ ...prev, isLoading: false }));
          return false;
        }

        return true; // User data se načte přes onAuthStateChange
      } else {
        // Fallback na API route
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setState({
            user: data.user,
            isLoading: false,
            isAuthenticated: true,
          });
          return true;
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
          return false;
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // ✅ Hybrid register
  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{success: boolean, message: string}> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const supabase = getSupabaseClient();

      if (supabase) {
        // Supabase registration
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name }
          }
        });

        if (authError) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return {
            success: false,
            message: authError.message || "Registration failed. Please try again."
          };
        }

        if (!authData.user) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return {
            success: false,
            message: "Registration failed. No user data received."
          };
        }

        // Vytvoř profil v users tabulce
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: authData.user.email,
            name: name,
            role: 'customer',
            subscription_status: 'free',
            is_seller: false,
            created_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (userError) {
          console.error("Failed to create user profile:", userError);
          setState((prev) => ({ ...prev, isLoading: false }));
          return {
            success: false,
            message: "Registration completed but profile creation failed. Please contact support."
          };
        }

        const finalUser: User = {
          id: authData.user.id,
          email: authData.user.email!,
          name: name,
          isAdmin: false,
          role: 'customer',
          subscription_status: 'free',
          is_seller: false,
          joinedAt: userData.created_at,
        };

        setState({
          user: finalUser,
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
          message: "Registration successful! Welcome to DigiNest."
        };
      } else {
        // Fallback na API route
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (response.ok) {
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

          return { success: true, message: data.message };
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
          return { success: false, message: data.message || "Registration failed" };
        }
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

  // ✅ Hybrid logout
  const logout = async () => {
    try {
      const supabase = getSupabaseClient();
      
      if (supabase) {
        await supabase.auth.signOut();
      } else {
        // Fallback - vyčistí cookies
        document.cookie = "diginest-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
      
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
