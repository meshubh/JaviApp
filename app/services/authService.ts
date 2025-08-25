// app/services/authService.ts
import { API_BASE_URL } from '../config/constants';
import { LoginRequest, LoginResponse } from '../types/auth';

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('AuthService initialized with URL:', this.baseURL);
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const url = `${this.baseURL}/api/v1/clients/login`;
      console.log('Attempting login to:', url);
      console.log('Credentials:', { email: credentials.email, password: '***' });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        // Try to parse as JSON, otherwise use text
        let errorMessage = 'Login failed';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.detail || 'Login failed';
        } catch {
          errorMessage = `Server error: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const data: LoginResponse = await response.json();
      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('Login error details:', error);
      
      if (error instanceof TypeError && error.message === 'Network request failed') {
        // This is a network connectivity issue
        throw new Error(
          'Cannot connect to server. Please check:\n' +
          '1. Your Django server is running\n' +
          '2. The API URL is correct\n' +
          '3. Your device/emulator has network access\n\n' +
          `Trying to connect to: ${this.baseURL}`
        );
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  // For testing connection without login
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.baseURL}/api/health`; // or any endpoint that returns 200
      console.log('Testing connection to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Connection test response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
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
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();