// app/contexts/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AuthContextType, LoginResponse, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('userData'),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Optionally validate token with backend
        const isValid = await authService.validateToken(storedToken);
        if (!isValid) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response: LoginResponse = await authService.login({ email, password });

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem('authToken', response.token),
        AsyncStorage.setItem('userData', JSON.stringify(response.user)),
        response.refreshToken ? AsyncStorage.setItem('refreshToken', response.refreshToken) : Promise.resolve(),
      ]);

      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint if needed
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      await Promise.all([
        AsyncStorage.removeItem('authToken'),
        AsyncStorage.removeItem('userData'),
        AsyncStorage.removeItem('refreshToken'),
      ]);

      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};