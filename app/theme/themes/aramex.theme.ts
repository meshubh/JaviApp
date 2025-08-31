import type { ThemeStructure } from "./base.theme";
import { neutralColors, sharedStyles } from "./base.theme";

export const AramexTheme: ThemeStructure = {
  name: 'Aramex',
  colors: {
    primary: {
      main: '#E20613',        // Aramex red
      dark: '#B30510',        // Darker red
      light: '#FF4444',       // Lighter red
      contrast: '#FFFFFF',    // White on red
    },
    secondary: {
      main: '#000000',        // Black
      dark: '#1A1A1A',       
      light: '#333333',
      contrast: '#FFFFFF',
    },
    neutral: neutralColors,
    semantic: {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#E20613',
      info: '#2196F3',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#FFEBEE',    // Light red tint
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    surface: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      elevated: '#FFFFFF',
      pressed: '#F0F0F0',
      disabled: '#E0E0E0',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      tertiary: '#9E9E9E',
      disabled: '#BDBDBD',
      inverse: '#FFFFFF',
      link: '#E20613',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
    },
    border: {
      primary: '#E0E0E0',
      secondary: '#EEEEEE',
      focus: '#E20613',
      error: '#E20613',
    },
    status: {
      active: '#4CAF50',
      inactive: '#9E9E9E',
      pending: '#FF9800',
      completed: '#4CAF50',
      cancelled: '#E20613',
    },
  },
  ...sharedStyles,
  typography: {
    ...sharedStyles.typography,
    styles: {
      ...sharedStyles.typography.styles,
      h1: { ...sharedStyles.typography.styles.h1, color: '#212121' },
      h2: { ...sharedStyles.typography.styles.h2, color: '#212121' },
      h3: { ...sharedStyles.typography.styles.h3, color: '#212121' },
      h4: { ...sharedStyles.typography.styles.h4, color: '#212121' },
      body: { ...sharedStyles.typography.styles.body, color: '#757575' },
      bodySmall: { ...sharedStyles.typography.styles.bodySmall, color: '#757575' },
      label: { ...sharedStyles.typography.styles.label, color: '#212121' },
      caption: { ...sharedStyles.typography.styles.caption, color: '#9E9E9E' },
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