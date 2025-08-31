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
    surface: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      elevated: '#FFFFFF',
      pressed: '#F3F4F6',
      disabled: '#E5E7EB',
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
      error: '#EF4444',
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
  typography: {
    ...sharedStyles.typography,
    styles: {
      ...sharedStyles.typography.styles,
      h1: { ...sharedStyles.typography.styles.h1, color: '#111827' },
      h2: { ...sharedStyles.typography.styles.h2, color: '#111827' },
      h3: { ...sharedStyles.typography.styles.h3, color: '#111827' },
      h4: { ...sharedStyles.typography.styles.h4, color: '#111827' },
      body: { ...sharedStyles.typography.styles.body, color: '#6B7280' },
      bodySmall: { ...sharedStyles.typography.styles.bodySmall, color: '#6B7280' },
      label: { ...sharedStyles.typography.styles.label, color: '#111827' },
      caption: { ...sharedStyles.typography.styles.caption, color: '#9CA3AF' },
      button: { ...sharedStyles.typography.styles.button, color: '#FFFFFF' },
    },
  },
  overlay: {
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
      ...sharedStyles.overlay.modal,
      backgroundColor: '#FFFFFF',
    },
  },
};