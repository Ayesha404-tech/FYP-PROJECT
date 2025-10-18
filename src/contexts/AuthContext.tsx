import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginAction = useAction(api.auth.login);
  const verifyTokenAction = useAction(api.auth.verifyToken);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('hr360_token');
      if (token) {
        try {
          const userData = await verifyTokenAction({ token });
          setUser(userData);
        } catch {
          // Token is invalid, remove it
          localStorage.removeItem('hr360_token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [verifyTokenAction]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const result = await loginAction({ email, password });
      setUser(result.user);
      localStorage.setItem('hr360_token', result.token);
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hr360_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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