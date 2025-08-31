import type { ThemeStructure } from "./base.theme";
import { neutralColors, sharedStyles } from "./base.theme";

export const JeeblyTheme: ThemeStructure = {
  name: 'Jeebly',
  colors: {
    primary: {
      main: '#00BFA5',        // Teal
      dark: '#00A693',
      light: '#4DD0B5',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B6B',        // Coral
      dark: '#FF5252',
      light: '#FF8787',
      contrast: '#FFFFFF',
    },
    neutral: neutralColors,
    semantic: {
      success: '#00BFA5',
      warning: '#FFB74D',
      error: '#FF6B6B',
      info: '#4FC3F7',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAF9',
      tertiary: '#E0F7FA',    // Light teal
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
    surface: {
      primary: '#FFFFFF',
      secondary: '#F8FAF9',
      elevated: '#FFFFFF',
      pressed: '#F0F7F6',
      disabled: '#E0F2F1',
    },
    text: {
      primary: '#263238',
      secondary: '#546E7A',
      tertiary: '#78909C',
      disabled: '#B0BEC5',
      inverse: '#FFFFFF',
      link: '#00BFA5',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
    },
    border: {
      primary: '#E0E0E0',
      secondary: '#F5F5F5',
      focus: '#00BFA5',
      error: '#FF6B6B',
    },
    status: {
      active: '#00BFA5',
      inactive: '#B0BEC5',
      pending: '#FFB74D',
      completed: '#00BFA5',
      cancelled: '#FF6B6B',
    },
  },
  ...sharedStyles,
  typography: {
    ...sharedStyles.typography,
    styles: {
      ...sharedStyles.typography.styles,
      h1: { ...sharedStyles.typography.styles.h1, color: '#263238' },
      h2: { ...sharedStyles.typography.styles.h2, color: '#263238' },
      h3: { ...sharedStyles.typography.styles.h3, color: '#263238' },
      h4: { ...sharedStyles.typography.styles.h4, color: '#263238' },
      body: { ...sharedStyles.typography.styles.body, color: '#546E7A' },
      bodySmall: { ...sharedStyles.typography.styles.bodySmall, color: '#546E7A' },
      label: { ...sharedStyles.typography.styles.label, color: '#263238' },
      caption: { ...sharedStyles.typography.styles.caption, color: '#78909C' },
      button: { ...sharedStyles.typography.styles.button, color: '#FFFFFF' },
    },
  },
  overlay: {
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modal: {
      ...sharedStyles.overlay.modal,
      backgroundColor: '#FFFFFF',
    },
  },
};