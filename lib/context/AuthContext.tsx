'use client';

import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, AuthContextType } from '@/lib/types';
import { STORES } from '@/lib/data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole) => {
    const store = STORES[Math.floor(Math.random() * STORES.length)];

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role,
      storeId: role === 'admin' ? undefined : store.id,
      storeName: role === 'admin' ? undefined : store.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
