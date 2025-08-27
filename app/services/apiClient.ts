// app/services/apiClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/constants';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

class ApiClient {
  private baseURL: string;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.baseURL = API_BASE_URL || 'https://javilogistics.com';
  }

  private async getAuthHeader(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: `HTTP Error ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      // Handle specific error cases
      if (response.status === 401) {
        // Token expired or invalid - try to refresh
        const refreshed = await this.refreshToken();
        if (!refreshed) {
          // Clear auth data and redirect to login
          await this.clearAuthData();
          throw new Error('Session expired. Please login again.');
        }
        // Retry the request with new token
        return this.retryRequest<T>(response.url, {
          method: response.headers.get('method') || 'GET',
          body: response.headers.get('body') || undefined,
        });
      }

      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action.');
      }

      if (response.status === 404) {
        throw new Error('The requested resource was not found.');
      }

      if (response.status === 422) {
        // Validation error
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          throw new Error(firstError[0] || 'Validation error occurred.');
        }
      }

      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      try {
        await this.refreshPromise;
        return true;
      } catch {
        return false;
      }
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      await this.refreshPromise;
      return true;
    } catch {
      return false;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/api/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    await AsyncStorage.setItem('authToken', data.access);
    
    if (data.refresh) {
      await AsyncStorage.setItem('refreshToken', data.refresh);
    }
    
    return data.access;
  }

  private async retryRequest<T>(url: string, options: RequestInit): Promise<T> {
    const headers = await this.getAuthHeader();
    const response = await fetch(url, {
      ...options,
      headers,
    });
    return this.handleResponse<T>(response);
  }

  private async clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']);
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const headers = await this.getAuthHeader();
    
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  // File upload support
  async uploadFile<T>(endpoint: string, file: any, additionalData?: Record<string, any>): Promise<T> {
    const token = await AsyncStorage.getItem('authToken');
    const formData = new FormData();
    
    // Add file to form data
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'photo.jpg',
    } as any);
    
    // Add additional data if provided
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  async getUserData(): Promise<any> {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        return JSON.parse(userDataStr);
      }
      
      // If no userData stored, decode from token
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Decode JWT payload (basic decoding without verification)
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
}

export const apiClient = new ApiClient();

// Export error types for use in components
export type { ApiError };
