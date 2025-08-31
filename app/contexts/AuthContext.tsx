// app/contexts/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { authService } from '../services/AuthService';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRES_AT: 'token_expires_at',
  USER_DATA: 'userData',
};

const TOKEN_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [appStateVisible, setAppStateVisible] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    initializeAuth();
    
    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appStateVisible.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground, check token validity
      checkTokenValidity();
    }
    setAppStateVisible(nextAppState);
  };

  const initializeAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const [storedToken, storedRefreshToken, tokenExpiresAt, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      if (storedToken && tokenExpiresAt && userData) {
        const expiresAtTimestamp = parseInt(tokenExpiresAt);
        const now = Date.now();

        if (now < expiresAtTimestamp) {
          // Token is still valid
          setToken(storedToken);
          setUser(JSON.parse(userData));
          
          // Validate token with backend
          const isValid = await authService.validateToken(storedToken);
          if (!isValid) {
            await clearAuthData();
          }
        } else if (storedRefreshToken) {
          // Token expired, try to refresh
          const newToken = await authService.refreshToken();
          if (newToken) {
            const newExpiresAt = Date.now() + TOKEN_DURATION;
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, newExpiresAt.toString());
            setToken(newToken);
            setUser(JSON.parse(userData));
          } else {
            await clearAuthData();
          }
        } else {
          // No valid token or refresh token
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const checkTokenValidity = async (): Promise<void> => {
    try {
      const tokenExpiresAt = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
      
      if (tokenExpiresAt) {
        const expiresAtTimestamp = parseInt(tokenExpiresAt);
        const now = Date.now();
        
        // Check if token will expire in the next 30 minutes
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (now + thirtyMinutes >= expiresAtTimestamp) {
          const newToken = await authService.refreshToken();
          if (newToken) {
            const newExpiresAt = Date.now() + TOKEN_DURATION;
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, newExpiresAt.toString());
            setToken(newToken);
          } else {
            await logout();
          }
        }
      }
    } catch (error) {
      console.error('Error checking token validity:', error);
    }
  };

  const storeTokenWithExpiry = async (authToken: string): Promise<void> => {
    try {
      const expiresAt = Date.now() + TOKEN_DURATION;
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, expiresAt.toString());
    } catch (error) {
      console.error('Error storing token expiry:', error);
    }
  };

  const clearAuthData = async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
      
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authService.login({
        email,
        password
      });
      
      // authService already stores the tokens, but we need to add expiry
      if (response.token) {
        await storeTokenWithExpiry(response.token);
        setToken(response.token);
      }
      
      if (response.user) {
        setUser({
          ...response.user,
          name: response.user.name ?? '',
        });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint if needed
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      await clearAuthData();
    }
  };

  // Enhanced method to refresh auth token
  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      const newToken = await authService.refreshToken();
      if (newToken) {
        await storeTokenWithExpiry(newToken);
        setToken(newToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    isLoading,
    refreshAuthToken,
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