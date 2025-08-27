import type { ThemeStructure } from "./base.theme";
import { sharedStyles } from "./base.theme";

export const PremiumTheme: ThemeStructure = {
  name: 'Premium',
  colors: {
    primary: {
      main: '#1E40AF',        // Deep blue
      dark: '#1E3A8A',
      light: '#3B82F6',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#F97316',        // Orange
      dark: '#EA580C',
      light: '#FB923C',
      contrast: '#FFFFFF',
    },
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
      1000: '#000000',
    },
    semantic: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0891B2',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#FAFAFA',
      tertiary: '#EFF6FF',    // Light blue
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.6)',
    },
    surface: {
      primary: '#FFFFFF',
      secondary: '#FAFAFA',
      elevated: '#FFFFFF',
      pressed: '#F4F4F5',
      disabled: '#E4E4E7',
    },
    text: {
      primary: '#18181B',
      secondary: '#52525B',
      tertiary: '#71717A',
      disabled: '#A1A1AA',
      inverse: '#FFFFFF',
      link: '#1E40AF',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
    },
    border: {
      primary: '#E4E4E7',
      secondary: '#F4F4F5',
      focus: '#1E40AF',
    },
    status: {
      active: '#059669',
      inactive: '#71717A',
      pending: '#D97706',
      completed: '#059669',
      cancelled: '#DC2626',
    },
  },
  ...sharedStyles,
};