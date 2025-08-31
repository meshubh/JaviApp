// app/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, LoginResponse } from '../types/auth';
import { apiClient } from './apiClient';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRES_AT: 'token_expires_at',
  REQUIRES_PASSWORD_CHANGE: 'requires_password_change',
  USER_DATA: 'userData',
};

const TOKEN_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Attempting login with email:', credentials.email);
      
      // Use apiClient.post which handles all the headers and error handling
      const data = await apiClient.post<LoginResponse>('/api/v1/clients/login', credentials);
      
      console.log('Login successful:', data);
      
      // Store auth tokens with expiry if they exist in the response
      if (data.token) {
        const expiresAt = Date.now() + TOKEN_DURATION;
        
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token),
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, expiresAt.toString()),
        ]);
      }
      
      if (data.refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      }
      
      // Store user data if it exists
      if (data.user) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
      }

      // Store first login status for UI decisions
      if (data.requires_password_change) {
        await AsyncStorage.setItem(STORAGE_KEYS.REQUIRES_PASSWORD_CHANGE, 'true');
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

  async logout(): Promise<void> {
    try {
      console.log('Attempting to logout...');

      // Get stored tokens for the logout request
      const [authToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      ]);

      // If we have tokens, try to logout on the server
      if (authToken || refreshToken) {
        try {
          // Prepare logout request data
          const logoutData: any = {};
          if (refreshToken) {
            logoutData.refreshToken = refreshToken;
            // Also support alternative field name
            logoutData.refresh_token = refreshToken;
          }

          console.log('Sending logout request to server...');
          
          // Make logout API call with proper endpoint
          await apiClient.post('/api/v1/clients/logout', logoutData);
          
          console.log('Server logout successful');
          
        } catch (apiError) {
          console.error('Server logout failed, but continuing with local cleanup:', apiError);
          
          // Don't throw error here - we still want to clear local storage
          // Server logout failure shouldn't prevent local cleanup
        }
      } else {
        console.log('No tokens found, skipping server logout');
      }

      // Always clear local storage regardless of server response
      console.log('Clearing local storage...');
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.TOKEN_EXPIRES_AT,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.REQUIRES_PASSWORD_CHANGE // Clear password change flag
      ]);

      console.log('Logout completed successfully');

    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if everything fails, try to clear local storage as a fallback
      try {
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.AUTH_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.TOKEN_EXPIRES_AT,
          STORAGE_KEYS.USER_DATA,
          STORAGE_KEYS.REQUIRES_PASSWORD_CHANGE
        ]);
        console.log('Local storage cleared despite errors');
      } catch (storageError) {
        console.error('Failed to clear local storage:', storageError);
      }

      // Don't throw the error - logout should always succeed from user perspective
      // The user should be logged out locally even if server communication fails
    }
  }

  async validateToken(token?: string): Promise<boolean> {
    try {
      // Use the provided token or get from storage
      const authToken = token || await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (!authToken) {
        return false;
      }
      
      // Check expiry first (faster than API call)
      const isExpired = await apiClient.isTokenExpired();
      if (isExpired) {
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

  // New method to check if password change is required
  async requiresPasswordChange(): Promise<boolean> {
    try {
      const requiresChange = await AsyncStorage.getItem(STORAGE_KEYS.REQUIRES_PASSWORD_CHANGE);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (userData) {
        const user = JSON.parse(userData);
        // Check both stored flag and user data
        return requiresChange === 'true' || user.is_first_login || user.force_password_change;
      }
      
      return requiresChange === 'true';
    } catch (error) {
      console.error('Error checking password change requirement:', error);
      return false;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post<{ access: string; refresh?: string }>(
        '/api/auth/refresh/',
        { refresh: refreshToken }
      );
      
      if (response.access) {
        const expiresAt = Date.now() + TOKEN_DURATION;
        
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access),
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, expiresAt.toString()),
        ]);
        
        if (response.refresh) {
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
        }
        
        return response.access;
      }
      
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword?: string): Promise<any> {
  try {
    const response = await apiClient.post('/api/v1/clients/change_password', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword || newPassword
    });
    
    return response;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
}

  // New method to mark password change as completed
  async markPasswordChangeComplete(): Promise<void> {
    try {
      // Remove the password change flag
      await AsyncStorage.removeItem(STORAGE_KEYS.REQUIRES_PASSWORD_CHANGE);
      
      // Update user data to reflect password change completion
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData);
        user.is_first_login = false;
        user.force_password_change = false;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error marking password change complete:', error);
    }
  }

  // New method to get current user data
  async getCurrentUser(): Promise<any> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
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
      const [token, expiresAtStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT),
      ]);
      
      if (!token || !expiresAtStr) {
        return false;
      }
      
      // Check if token is expired
      const expiresAt = parseInt(expiresAtStr);
      const now = Date.now();
      
      if (now >= expiresAt) {
        // Token is expired, try to refresh
        const newToken = await this.refreshToken();
        return !!newToken;
      }
      
      return true;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  };

  // Helper to clear all auth data
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.TOKEN_EXPIRES_AT,
        STORAGE_KEYS.USER_DATA
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Get token expiry status
  async getTokenStatus(): Promise<{
    hasToken: boolean;
    isExpired: boolean;
    expiresAt: Date | null;
    timeUntilExpiry: number | null;
  }> {
    try {
      const [token, expiresAtStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT),
      ]);
      
      const hasToken = !!token;
      
      if (!expiresAtStr) {
        return {
          hasToken,
          isExpired: true,
          expiresAt: null,
          timeUntilExpiry: null,
        };
      }
      
      const expiresAt = new Date(parseInt(expiresAtStr));
      const now = Date.now();
      const isExpired = now >= parseInt(expiresAtStr);
      const timeUntilExpiry = parseInt(expiresAtStr) - now;
      
      return {
        hasToken,
        isExpired,
        expiresAt,
        timeUntilExpiry: isExpired ? null : timeUntilExpiry,
      };
    } catch (error) {
      console.error('Error getting token status:', error);
      return {
        hasToken: false,
        isExpired: true,
        expiresAt: null,
        timeUntilExpiry: null,
      };
    }
  }
}

export const authService = new AuthService();

// Export types if needed
export type { LoginRequest, LoginResponse };
