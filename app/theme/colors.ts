// app/theme/colors.ts
export const Colors = {
  // Primary Pastels
  primary: {
    lavender: '#B19CD9',
    plum: '#DDA0DD',
    pink: '#FFB6C1',
    peach: '#FFDAB9',
    mint: '#98FB98',
  },

  // Background Gradients
  gradients: {
    main: ['#FFE5EC', '#FFF0F5', '#E6E6FA'],
    card1: ['#FFB6C1', '#FFC0CB', '#FFD1DC'],
    card2: ['#B19CD9', '#C8B6DB', '#DDA0DD'],
    card3: ['#87CEEB', '#B0E0E6', '#E0F6FF'],
    button: ['#DDA0DD', '#B19CD9', '#9370DB'],
    profile: ['#B19CD9', '#DDA0DD'],
    drawer: ['#F8F0FF', '#FFF0F5', '#FFE5EC'],
  },

  // Text Colors
  text: {
    primary: '#6B5B95',
    secondary: '#9B8AA5',
    light: '#C8B6DB',
    white: '#FFFFFF',
    error: '#FF6B6B',
    success: '#90EE90',
    warning: '#FFE4B5',
  },

  // UI Elements
  ui: {
    background: '#FFFFFF',
    backgroundOpacity: 'rgba(255, 255, 255, 0.9)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    border: 'rgba(177, 156, 217, 0.2)',
    shadow: '#B19CD9',
  },
} as const;