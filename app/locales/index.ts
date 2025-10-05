import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en/translation.json';
import hi from './hi/translation.json';

const LANGUAGE_KEY = '@app_language';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

// Get saved language or use device language
const getInitialLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) return savedLanguage;
    
    // Get device language - FIXED for newer expo-localization
    const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';
    return ['en', 'hi'].includes(deviceLanguage) ? deviceLanguage : 'en';
  } catch {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Will be updated by getInitialLanguage
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });

// Initialize language
getInitialLanguage().then((language) => {
  i18n.changeLanguage(language);
});

// Function to change language and save preference
export const changeLanguage = async (language: 'en' | 'hi') => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export default i18n;