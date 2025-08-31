import React, { createContext, ReactNode, useContext } from 'react';
import { AramexTheme } from './themes/aramex.theme';
import type { ThemeStructure } from './themes/base.theme';
import { DHLTheme } from './themes/dhl.theme';
import { JeeblyTheme } from './themes/jeebly.theme';
import { LogistiqTheme } from './themes/logistiq.theme';
import { PremiumTheme } from './themes/premium.theme';

// Available themes
export const themes = {
  dhl: DHLTheme,
  aramex: AramexTheme,
  logistiq: LogistiqTheme,
  jeebly: JeeblyTheme,
  premium: PremiumTheme,
} as const;

export type ThemeName = keyof typeof themes;

interface ThemeContextType {
  theme: ThemeStructure;
  themeName: ThemeName;
  // setTheme: (themeName: ThemeName) => void;
  // availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// const THEME_STORAGE_KEY = '@app_theme';

const SELECTED_THEME = 'dhl'; // Change this value to switch themes

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const [themeName, setThemeName] = useState<ThemeName>('dhl');
  // const [theme, setCurrentTheme] = useState<ThemeStructure>(themes.dhl);

  // useEffect(() => {
  //   loadSavedTheme();
  // }, []);

  // const loadSavedTheme = async () => {
  //   try {
  //     const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
  //     if (savedTheme && savedTheme in themes) {
  //       setThemeName(savedTheme as ThemeName);
  //       setCurrentTheme(themes[savedTheme as ThemeName]);
  //     }
  //   } catch (error) {
  //     console.error('Error loading theme:', error);
  //   }
  // };

  // const setTheme = async (newThemeName: ThemeName) => {
  //   try {
  //     setThemeName(newThemeName);
  //     setCurrentTheme(themes[newThemeName]);
  //     await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeName);
  //   } catch (error) {
  //     console.error('Error saving theme:', error);
  //   }
  // };

  // const availableThemes = Object.keys(themes) as ThemeName[];

  // return (
  //   <ThemeContext.Provider value={{ theme, themeName, setTheme, availableThemes }}>
  //     {children}
  //   </ThemeContext.Provider>

    const themeName = SELECTED_THEME as ThemeName;
    const theme = themes[themeName];
    return (
      <ThemeContext.Provider value={{ theme, themeName }}>
        {children}
      </ThemeContext.Provider>
    );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
