import { sharedStyles, neutralColors } from "./base.theme";
import type { ThemeStructure } from "./base.theme";

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
};
