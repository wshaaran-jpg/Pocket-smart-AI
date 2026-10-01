import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { loginUser, registerUser, logoutUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password?: string) => Promise<void>;
  register: (username: string, email: string, password?: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
  formatPrice: (priceINR: number) => string;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to demo user 'sai' to align with the prompt & screenshots
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pocketsmart_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fall through
      }
    }
    return {
      username: 'sai',
      email: 'sai@pocketsmart.ai',
      full_name: 'Sai Krishna',
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('pocketsmart_token') || 'token_sai_default';
  });

  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('pocketsmart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pocketsmart_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('pocketsmart_token', token);
    } else {
      localStorage.removeItem('pocketsmart_token');
    }
  }, [token]);

  const login = async (username: string, password?: string) => {
    const res = await loginUser(username, password);
    setUser(res.user);
    setToken(res.token);
    setAuthModalOpen(false);
  };

  const register = async (username: string, email: string, password?: string, fullName?: string) => {
    const res = await registerUser(username, email, password, fullName);
    setUser(res.user);
    setToken(res.token);
    setAuthModalOpen(false);
  };

  const logout = async () => {
    if (user) {
      await logoutUser(user.username);
    }
    setUser(null);
    setToken(null);
  };

  const formatPrice = (priceINR: number): string => {
    if (currency === 'USD') {
      const usd = Math.round(priceINR / 83.0);
      return `$${usd.toLocaleString('en-US')}`;
    }
    return `₹${priceINR.toLocaleString('en-IN')}`;
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        currency,
        setCurrency,
        formatPrice,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
