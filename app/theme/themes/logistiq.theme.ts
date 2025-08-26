import type { ThemeStructure } from "./base.theme";
import { neutralColors, sharedStyles } from "./base.theme";

export const LogistiqTheme: ThemeStructure = {
  name: 'Logistiq',
  colors: {
    primary: {
      main: '#6366F1',        // Indigo
      dark: '#4F46E5',
      light: '#818CF8',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#EC4899',        // Pink accent
      dark: '#DB2777',
      light: '#F472B6',
      contrast: '#FFFFFF',
    },
    neutral: neutralColors,
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#EEF2FF',    // Light indigo
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      disabled: '#D1D5DB',
      inverse: '#FFFFFF',
      link: '#6366F1',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
    },
    border: {
      primary: '#E5E7EB',
      secondary: '#F3F4F6',
      focus: '#6366F1',
    },
    status: {
      active: '#10B981',
      inactive: '#9CA3AF',
      pending: '#F59E0B',
      completed: '#10B981',
      cancelled: '#EF4444',
    },
  },
  ...sharedStyles,
};