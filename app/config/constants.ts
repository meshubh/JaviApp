import Constants from 'expo-constants';
import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.15'; // Find this with ipconfig (Windows) or ifconfig (Mac/Linux)

// Different URLs for different environments
export const API_URLS = {
  // For Android Emulator (use special Android emulator address or your computer's IP)
  androidEmulator: 'http://10.0.2.2:8000', // Special Android emulator address for localhost
  
  // For physical device testing (use your computer's IP)
  physicalDevice: `http://${LOCAL_IP}:8000`,
  
  // For production (your actual AWS EC2 instance)
  production: 'https://javilogistics.com', 
  
  // For iOS Simulator
  iosSimulator: 'http://localhost:8000',
};

const getApiUrl = () => {
  console.log('App Constants:');
  console.log('Platform:', Platform.OS, __DEV__);

  // If you have a production URL in environment variables, use it
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('Using production API URL from environment variables');
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // For development
  if (__DEV__) {
    console.log('Running in development mode');
    if (Platform.OS === 'android') {
      console.log('Running on Android platform');
      // Check if it's emulator or physical device
      const isEmulator = !Constants.isDevice;
      return isEmulator ? API_URLS.androidEmulator : API_URLS.physicalDevice;
    } else if (Platform.OS === 'ios') {
      return API_URLS.iosSimulator;
    }
  }
  
  // Default to production
  return API_URLS.production;
};

export const API_BASE_URL = getApiUrl();

// App Configuration
export const APP_NAME = 'Javi Logistics';
export const APP_VERSION = '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// Order Status Constants
export const ORDER_STATUS = {
  CREATED: 'Created',
  READY_TO_PICK: 'Ready to Pick',
  PICKED: 'Picked',
  IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
} as const;

// Order Priority
export const ORDER_PRIORITY = {
  NORMAL: 'Normal',
  URGENT: 'Urgent',
  HIGH: 'High',
} as const;

// Payment Modes
export const PAYMENT_MODES = {
  PREPAID: 'Prepaid',
  COD: 'COD',
  CREDIT: 'Credit',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  REMEMBER_ME: 'rememberMe',
  LAST_SYNC: 'lastSync',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login/',
  LOGOUT: '/api/auth/logout/',
  REFRESH: '/api/auth/refresh/',
  VALIDATE_TOKEN: '/api/auth/validate/',
  
  // Orders
  ORDERS: '/api/orders/',
  CLIENT_ORDERS: '/api/orders/client_orders/',
  CLIENT_ORDER_DETAIL: (id: string) => `/api/orders/${id}/client_order_detail/`,
  CLIENT_CREATE_ORDER: '/api/orders/client_create_order/',
  CLIENT_CANCEL_ORDER: (id: string) => `/api/orders/${id}/client_cancel_order/`,
  CLIENT_ORDER_STATS: '/api/orders/client_order_stats/',
  CLIENT_CONTRACTS: '/api/orders/client_contracts/',
  CLIENT_ADDRESSES: '/api/orders/client_addresses/',
  
  // Tracking
  ORDER_TRACKING: (id: string) => `/api/orders/${id}/tracking_history/`,
  LIVE_TRACKING: '/api/tracking/live_tracking/',
} as const;

// Timeouts
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  REFRESH_TOKEN: 5000, // 5 seconds
  LOCATION_UPDATE: 60000, // 1 minute
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 28.7041,
  DEFAULT_LONGITUDE: 77.1025,
  DEFAULT_ZOOM: 15,
  DEFAULT_DELTA: {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PHONE_LENGTH: 15,
  MIN_PHONE_LENGTH: 10,
  MAX_ADDRESS_LENGTH: 500,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_SPECIAL_INSTRUCTIONS_LENGTH: 500,
  MIN_PACKAGE_COUNT: 1,
  MAX_PACKAGE_COUNT: 9999,
  MIN_WEIGHT: 0.1,
  MAX_WEIGHT: 99999,
  MIN_VALUE: 1,
  MAX_VALUE: 9999999,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  PERMISSION_ERROR: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully!',
  ORDER_UPDATED: 'Order updated successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_TIME: 'hh:mm A',
  DISPLAY_DATETIME: 'MMM DD, YYYY hh:mm A',
  API_DATE: 'YYYY-MM-DD',
  API_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
} as const;

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,15}$/,
  PINCODE: /^[0-9]{6}$/,
  NUMERIC: /^[0-9]+$/,
  DECIMAL: /^[0-9]+(\.[0-9]{1,2})?$/,
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_TRACKING: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_DARK_MODE: false,
  ENABLE_MULTI_LANGUAGE: false,
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER_CREATED: 'order_created',
  ORDER_ASSIGNED: 'order_assigned',
  ORDER_PICKED: 'order_picked',
  ORDER_DELIVERED: 'order_delivered',
  ORDER_CANCELLED: 'order_cancelled',
  PAYMENT_RECEIVED: 'payment_received',
} as const;

export default {
  APP_NAME,
  APP_VERSION,
  ORDER_STATUS,
  ORDER_PRIORITY,
  PAYMENT_MODES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  TIMEOUTS,
  MAP_CONFIG,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DATE_FORMATS,
  REGEX,
  FEATURES,
  NOTIFICATION_TYPES,
};

// For debugging - log the URL being used
console.log('🚀 API URL:', API_BASE_URL);