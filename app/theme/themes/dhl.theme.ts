import type { ThemeStructure } from "./base.theme";
import { neutralColors, sharedStyles } from "./base.theme";

export const DHLTheme: ThemeStructure = {
  name: 'DHL',
  colors: {
    primary: {
      main: '#FFCC00',
      dark: '#F0B90B',
      light: '#FFF4CC',
      contrast: '#000000',
    },
    secondary: {
      main: '#D40511',
      dark: '#BA030E',
      light: '#FFE5E5',
      contrast: '#FFFFFF',
    },
    neutral: neutralColors,
    semantic: {
      success: '#4CAF50',
      warning: '#FFCC00',
      error: '#D40511',
      info: '#2196F3',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#FFF9E6',
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      tertiary: '#9E9E9E',
      disabled: '#BDBDBD',
      inverse: '#FFFFFF',
      link: '#D40511',
      onPrimary: '#000000',
      onSecondary: '#FFFFFF',
    },
    border: {
      primary: '#E0E0E0',
      secondary: '#EEEEEE',
      focus: '#FFCC00',
    },
    status: {
      active: '#4CAF50',
      inactive: '#9E9E9E',
      pending: '#FFCC00',
      completed: '#4CAF50',
      cancelled: '#D40511',
    },
  },
  ...sharedStyles,
};