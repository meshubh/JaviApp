// app/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, LoginResponse } from '../types/auth';
import { apiClient } from './apiClient';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Attempting login with email:', credentials.email);
      
      // Use apiClient.post which handles all the headers and error handling
      const data = await apiClient.post<LoginResponse>('/api/v1/clients/login', credentials);
      
      console.log('Login successful:', data);
      
      // Store auth tokens if they exist in the response
      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token);
      }
      
      if (data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // Store user data if it exists
      if (data.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      // The apiClient already handles error formatting, but we can add specific login error handling
      if (error instanceof Error) {
        // Check for network errors
        if (error.message.includes('Network error')) {
          throw new Error(
            'Cannot connect to server. Please check:\n' +
            '1. Your Django server is running\n' +
            '2. Your device/emulator has network access\n' +
            '3. You are using the correct environment'
          );
        }
        
        // Check for authentication errors
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          throw new Error('Invalid email or password');
        }
        
        throw error;
      }
      
      throw new Error('An unexpected error occurred during login');
    }
  }

  async logout(token?: string): Promise<void> {
    try {
      // If token is provided, use it temporarily for this request
      if (token) {
        apiClient.setHeader('Authorization', `Bearer ${token}`);
      }
      
      await apiClient.post('/api/auth/logout');
      
      // Clear all stored auth data
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']);
      
    } catch (error) {
      console.error('Logout API error:', error);
      // Even if API call fails, clear local storage
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']);
    }
  }

  async validateToken(token?: string): Promise<boolean> {
    try {
      // Use the provided token or get from storage
      const authToken = token || await AsyncStorage.getItem('authToken');
      
      if (!authToken) {
        return false;
      }
      
      // Temporarily set the token for this request if provided
      if (token) {
        apiClient.setHeader('Authorization', `Bearer ${token}`);
      }
      
      await apiClient.get('/api/auth/validate');
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post<{ access: string; refresh?: string }>(
        '/api/auth/refresh/',
        { refresh: refreshToken }
      );
      
      if (response.access) {
        await AsyncStorage.setItem('authToken', response.access);
        
        if (response.refresh) {
          await AsyncStorage.setItem('refreshToken', response.refresh);
        }
        
        return response.access;
      }
      
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      // First try to get from storage
      const userData = await apiClient.getUserData();
      
      if (userData) {
        return userData;
      }
      
      // If not in storage, fetch from API
      const user = await apiClient.get('/api/auth/me');
      
      // Store for future use
      if (user) {
        await AsyncStorage.setItem('userData', JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Test connection without authentication
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing connection to API...');
      console.log('Current API URL:', apiClient.getApiUrl());
      console.log('Current Environment:', apiClient.getCurrentEnvironment());
      
      // Try to hit a public endpoint that doesn't require auth
      // You might need to adjust this endpoint based on your Django API
      await apiClient.get('/api/health');
      
      console.log('Connection test successful');
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Helper method to check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        return false;
      }
      
      // Optionally validate the token with the server
      // return await this.validateToken(token);
      
      // Or just check if token exists (faster but less secure)
      return true;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }

  // Helper to clear all auth data
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
}

export const authService = new AuthService();

// Export types if needed
export type { LoginRequest, LoginResponse };
