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
  };
  elevation: Record<number, any>;
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
