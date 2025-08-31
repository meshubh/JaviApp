import { TextStyle } from 'react-native';

export interface ThemeStructure {
  name: string;
  colors: {
    primary: {
      main: string;
      dark: string;
      light: string;
      contrast: string;
    };
    secondary: {
      main: string;
      dark: string;
      light: string;
      contrast: string;
    };
    neutral: Record<number, string>;
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      elevated: string;
      overlay: string;
    };
    surface: {
      primary: string;
      secondary: string;
      elevated: string;
      pressed: string;
      disabled: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      inverse: string;
      link: string;
      onPrimary: string;
      onSecondary: string;
    };
    border: {
      primary: string;
      secondary: string;
      focus: string;
      error: string;
    };
    status: {
      active: string;
      inactive: string;
      pending: string;
      completed: string;
      cancelled: string;
    };
  };
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
  typography: {
    fontSize: Record<string, number>;
    fontWeight: {
      regular: TextStyle['fontWeight'];
      medium: TextStyle['fontWeight'];
      semiBold: TextStyle['fontWeight'];
      bold: TextStyle['fontWeight'];
    };
    lineHeight: Record<string, number>;
    // Typography styles for different text types
    styles: {
      h1: TextStyle;
      h2: TextStyle;
      h3: TextStyle;
      h4: TextStyle;
      body: TextStyle;
      bodySmall: TextStyle;
      label: TextStyle;
      caption: TextStyle;
      button: TextStyle;
    };
  };
  elevation: Record<number, any>;
  // New overlay styles for modals and dialogs
  overlay: {
    backdrop: {
      backgroundColor: string;
    };
    modal: {
      backgroundColor: string;
      borderRadius: number;
      padding: number;
      elevation: any;
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
    };
  };
}

// Shared spacing, typography, etc. for all themes
export const sharedStyles = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    round: 9999,
  },
  typography: {
    fontSize: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 19,
      xxl: 22,
      xxxl: 26,
      xxxxl: 30,
    },
    fontWeight: {
      regular: '400' as TextStyle['fontWeight'],
      medium: '500' as TextStyle['fontWeight'],
      semiBold: '600' as TextStyle['fontWeight'],
      bold: '700' as TextStyle['fontWeight'],
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },
    // Shared typography styles - themes can override specific colors
    styles: {
      h1: {
        fontSize: 30,
        fontWeight: '700' as TextStyle['fontWeight'],
        lineHeight: 36,
      },
      h2: {
        fontSize: 26,
        fontWeight: '700' as TextStyle['fontWeight'],
        lineHeight: 32,
      },
      h3: {
        fontSize: 22,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 28,
      },
      h4: {
        fontSize: 19,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 24,
      },
      body: {
        fontSize: 15,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 22,
      },
      bodySmall: {
        fontSize: 13,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 18,
      },
      label: {
        fontSize: 15,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 20,
      },
      caption: {
        fontSize: 11,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 16,
      },
      button: {
        fontSize: 15,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 20,
      },
    },
  },
  elevation: {
    0: {},
    1: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    2: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    3: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 6,
    },
    4: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 8,
      elevation: 8,
    },
    5: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 12,
    },
  },
  // Shared overlay styles
  overlay: {
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 24,
      elevation: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
      },
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
  },
};

export const neutralColors = {
  0: '#FFFFFF',
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#EEEEEE',
  300: '#E0E0E0',
  400: '#BDBDBD',
  500: '#9E9E9E',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  1000: '#000000',
};