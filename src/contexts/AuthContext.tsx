"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { triggerWelcomeSeries } from "@/lib/emailAutomation";
import { getDatabase } from "@/lib/database";

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

  // ✅ OPRAVENÝ useEffect - načítá z Supabase místo cookies
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") return;

      try {
        const supabase = getDatabase();
        
        // ✅ 1. Zkontroluj Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase session error:", error);
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        if (session?.user) {
          // ✅ 2. Načti fresh data z databáze (ne z cookies!)
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

          // ✅ 3. Nastav správné role based na DB data
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: userData?.name || session.user.email!,
            isAdmin: userData?.role === 'admin', // ✅ Z databáze!
            role: userData?.role || 'customer',
            subscription_status: userData?.subscription_status,
            is_seller: userData?.is_seller || false,
            joinedAt: userData?.created_at,
          };

          console.log('🔍 Fresh user data from DB:', userData);
          console.log('👤 Final user object:', user);

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

    // ✅ 4. Listen na auth změny
    const supabase = getDatabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Reload user data when signed in
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
  }, []);

  // ✅ OPRAVENÝ login - používá Supabase
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const supabase = getDatabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // User data se načte automaticky přes onAuthStateChange
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // ✅ OPRAVENÁ register funkce - používá Supabase místo API route
  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{success: boolean, message: string}> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const supabase = getDatabase();

      // ✅ 1. Registrace přes Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // Metadata pro profil
          }
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

      // ✅ 2. Vytvoř profil v users tabulce s rolí customer
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: authData.user.email,
          name: name,
          role: 'customer', // ✅ VŽDY customer pro nové registrace
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

      // ✅ 3. Nastav user state s correct role
      const finalUser: User = {
        id: authData.user.id,
        email: authData.user.email!,
        name: name,
        isAdmin: false, // ✅ Nový uživatel není nikdy admin
        role: 'customer', // ✅ Vždy customer
        subscription_status: 'free',
        is_seller: false,
        joinedAt: userData.created_at,
      };

      console.log('🎯 New user registered:', finalUser);

      setState({
        user: finalUser,
        isLoading: false,
        isAuthenticated: true,
      });

      // ✅ 4. Spusť email automation
      try {
        await triggerWelcomeSeries(email, name);
      } catch (emailError) {
        console.warn("Email automation error:", emailError);
        // Nekritická chyba - registrace byla úspěšná
      }

      return {
        success: true,
        message: "Registration successful! Welcome to DigiNest."
      };

    } catch (error) {
      console.error("Registration error:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
      return {
        success: false,
        message: "Network error occurred. Please check your connection and try again."
      };
    }
  };

  // ✅ OPRAVENÝ logout - používá Supabase
  const logout = async () => {
    try {
      const supabase = getDatabase();
      await supabase.auth.signOut();
      // State se vyčistí automaticky přes onAuthStateChange
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
