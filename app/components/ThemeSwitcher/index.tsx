import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemeName, useTheme } from '../../theme/themeContext';

interface ThemeOption {
  name: ThemeName;
  label: string;
  primaryColor: string;
  secondaryColor: string;
}

const themeOptions: ThemeOption[] = [
  {
    name: 'dhl',
    label: 'DHL Inspired',
    primaryColor: '#FFCC00',
    secondaryColor: '#D40511',
  },
  {
    name: 'aramex',
    label: 'Aramex Inspired',
    primaryColor: '#E20613',
    secondaryColor: '#000000',
  },
  {
    name: 'logistiq',
    label: 'Logistiq Inspired',
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
  },
  {
    name: 'jeebly',
    label: 'Jeebly Inspired',
    primaryColor: '#00BFA5',
    secondaryColor: '#FF6B6B',
  },
  {
    name: 'premium',
    label: 'Premium',
    primaryColor: '#1E40AF',
    secondaryColor: '#F97316',
  },
];

export const ThemeSwitcher: React.FC = () => {
  const { themeName, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Choose Theme
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.name}
            style={[
              styles.themeCard,
              {
                backgroundColor: theme.colors.background.elevated,
                borderColor: themeName === option.name 
                  ? theme.colors.primary.main 
                  : theme.colors.border.primary,
                borderWidth: themeName === option.name ? 2 : 1,
              },
            ]}
            // onPress={() => setTheme(option.name)}
          >
            <View style={styles.colorPreview}>
              <View
                style={[
                  styles.colorCircle,
                  { backgroundColor: option.primaryColor },
                ]}
              />
              <View
                style={[
                  styles.colorCircle,
                  { backgroundColor: option.secondaryColor },
                ]}
              />
            </View>
            <Text style={[styles.themeName, { color: theme.colors.text.primary }]}>
              {option.label}
            </Text>
            {themeName === option.name && (
              <Feather name="check" size={16} color={theme.colors.primary.main} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeCard: {
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  colorPreview: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  themeName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 4,
  },
});