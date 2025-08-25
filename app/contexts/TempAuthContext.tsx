// app/contexts/TempAuthContext.tsx
// TEMPORARY VERSION WITH MOCK LOGIN FOR TESTING

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/AuthService';
import { AuthContextType, LoginResponse, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Set this to true to use mock authentication (no backend needed)
const USE_MOCK_AUTH = true;

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
        
        // Skip validation in mock mode
        if (!USE_MOCK_AUTH) {
          const isValid = await authService.validateToken(storedToken);
          if (!isValid) {
            await logout();
          }
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
      if (USE_MOCK_AUTH) {
        // Mock authentication - accept any email/password
        console.log('🔐 Using MOCK authentication');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create mock user
        const mockUser: User = {
          id: '1',
          name: email.split('@')[0], // Use email prefix as name
          email: email,
          phone: '+1234567890',
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        // Store mock auth data
        await Promise.all([
          AsyncStorage.setItem('authToken', mockToken),
          AsyncStorage.setItem('userData', JSON.stringify(mockUser)),
        ]);

        setToken(mockToken);
        setUser(mockUser);
        
        Alert.alert(
          '✅ Mock Login Successful',
          'You are using mock authentication. To connect to your Django backend, set USE_MOCK_AUTH to false.',
          [{ text: 'OK' }]
        );
      } else {
        // Real authentication
        console.log('🔐 Using REAL authentication');
        const response: LoginResponse = await authService.login({ email, password });
        
        // Store auth data
        await Promise.all([
          AsyncStorage.setItem('authToken', response.token),
          AsyncStorage.setItem('userData', JSON.stringify(response.user)),
          response.refreshToken ? AsyncStorage.setItem('refreshToken', response.refreshToken) : Promise.resolve(),
        ]);

        setToken(response.token);
        setUser(response.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint if needed and not in mock mode
      if (token && !USE_MOCK_AUTH) {
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
    isLoading,
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