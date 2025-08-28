// app/services/apiClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Environment configuration
const ENV = {
  development: {
    API_URL: 'http://10.0.2.2:8000',
  },
  production: {
    API_URL: 'https://javilogistics.com',
  },
};

// Get current environment - you can switch this manually or use env variables
const currentEnv = 'development'; // Change to 'production' for production testing
const API_BASE_URL = ENV[currentEnv].API_URL;

console.log(`API Base URL: ${API_BASE_URL}`);

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token refresh flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}> = [];

// Process the queue of failed requests after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (__DEV__) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (__DEV__) {
      console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (__DEV__) {
      console.error(`❌ Response Error: ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;
        
        await AsyncStorage.setItem('authToken', access);
        if (refresh) {
          await AsyncStorage.setItem('refreshToken', refresh);
        }
        
        // Update the authorization header for the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        
        processQueue(null, access);
        
        // Retry the original request with new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear auth data and redirect to login
        await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']);
        
        // You might want to trigger navigation to login here
        // navigationRef.current?.navigate('Login');
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error statuses
    if (error.response?.status === 403) {
      throw new Error('You do not have permission to perform this action.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('The requested resource was not found.');
    }
    
    if (error.response?.status === 422) {
      const errorData = error.response.data as any;
      if (errorData?.errors) {
        const firstError = Object.values(errorData.errors)[0] as string[];
        throw new Error(firstError[0] || 'Validation error occurred.');
      }
    }
    
    if (error.response?.status && error.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    // Network error
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // GET request
  get: async <T = any>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    const response = await axiosInstance.get<T>(endpoint, { params });
    return response.data;
  },

  // POST request
  post: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await axiosInstance.post<T>(endpoint, data);
    return response.data;
  },

  // PUT request
  put: async <T = any>(endpoint: string, data: any): Promise<T> => {
    const response = await axiosInstance.put<T>(endpoint, data);
    return response.data;
  },

  // PATCH request
  patch: async <T = any>(endpoint: string, data: any): Promise<T> => {
    const response = await axiosInstance.patch<T>(endpoint, data);
    return response.data;
  },

  // DELETE request
  delete: async <T = any>(endpoint: string): Promise<T> => {
    const response = await axiosInstance.delete<T>(endpoint);
    return response.data;
  },

  // File upload
  uploadFile: async <T = any>(
    endpoint: string,
    file: any,
    additionalData?: Record<string, any>,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<T> => {
    const formData = new FormData();
    
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'photo.jpg',
    } as any);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await axiosInstance.post<T>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    
    return response.data;
  },

  // Get user data from storage or token
  getUserData: async (): Promise<any> => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        return JSON.parse(userDataStr);
      }
      
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Basic JWT decode (without verification)
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Set custom headers (useful for specific requests)
  setHeader: (key: string, value: string) => {
    axiosInstance.defaults.headers.common[key] = value;
  },

  // Remove custom header
  removeHeader: (key: string) => {
    delete axiosInstance.defaults.headers.common[key];
  },

  // Get current environment
  getCurrentEnvironment: () => currentEnv,

  // Get current API URL
  getApiUrl: () => API_BASE_URL,
};

// Export types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Export axios instance if needed for custom configurations
export { axiosInstance };
