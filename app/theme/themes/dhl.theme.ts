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
      link: '#D40511',
      onPrimary: '#000000',
      onSecondary: '#FFFFFF',
    },
    border: {
      primary: '#E0E0E0',
      secondary: '#EEEEEE',
      focus: '#FFCC00',
      error: '#D40511',
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
      button: { ...sharedStyles.typography.styles.button, color: '#000000' },
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