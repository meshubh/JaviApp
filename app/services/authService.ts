// app/services/authService.ts
import { LoginRequest, LoginResponse } from '../types';
import { API_BASE_URL } from '../config/constants';

class AuthService {
  private baseURL: string;

  constructor() {
    // Replace with your actual EC2 instance URL
    this.baseURL = API_BASE_URL || 'https://your-ec2-instance.amazonaws.com';
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await fetch(`${this.baseURL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Don't throw - we'll clear local storage anyway
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }
}

export const authService = new AuthService();