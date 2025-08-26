'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: boolean; // Simplified: true for admin, false for guest
  loading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage for admin status
    try {
      const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
      setUser(isAdmin);
    } catch (error) {
      // sessionStorage is not available
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (password === adminPassword) {
      setUser(true);
       try {
        sessionStorage.setItem('isAdmin', 'true');
      } catch (error) {
        // sessionStorage is not available
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(false);
     try {
        sessionStorage.removeItem('isAdmin');
    } catch (error) {
        // sessionStorage is not available
    }
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
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
