import React from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { ThemeSwitcher } from '../components/ThemeSwitcher/index';
import { useTheme } from '../theme/themeContext';

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar 
        backgroundColor={theme.colors.primary.main} 
        barStyle={
          theme.name === 'logistiq' || theme.name === 'premium' 
            ? 'light-content' 
            : 'dark-content'
        } 
      />
      <ScrollView style={{ backgroundColor: theme.colors.background.secondary }}>
        {/* Other settings sections */}
        
        {/* Theme Switcher Section */}
        <ThemeSwitcher />
        
        {/* More settings */}
      </ScrollView>
    </>
  );
};