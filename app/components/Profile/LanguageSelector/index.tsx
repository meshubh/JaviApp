// app/components/LanguageSelector/index.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { changeLanguage } from '../../../locales';
import { useTheme } from '../../../theme/themeContext';
import { CustomHeader } from '../../CustomHeader';
import { useLanguageSelectorStyles } from './languageSelector.styles';

interface LanguageSelectorProps {
  navigation: any;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ navigation }) => {
  const { i18n, t } = useTranslation();
  const { theme } = useTheme();
  const styles = useLanguageSelectorStyles(theme);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      nativeName: 'English',
      letter: 'A',
      symbol: 'अ'
    },
    { 
      code: 'hi', 
      name: 'Hindi', 
      nativeName: 'हिन्दी',
      letter: 'अ',
      symbol: 'अ'
    },
  ];

  const handleLanguageSelect = async (code: string) => {
    setSelectedLanguage(code);
  };

  const handleContinue = async () => {
    await changeLanguage(selectedLanguage as 'en' | 'hi');
    navigation.goBack();
  };

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary.main} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <CustomHeader
          navigation={navigation}
          title={t('profile.chooseLanguage.value')}
          showBack={true}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{t('languageSelector.title.value')}</Text>
          <Text style={styles.subtitle}>
            {t('languageSelector.subtitle.value')}
          </Text>

          <View style={styles.languageGrid}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageCard,
                  lang.code === 'en' ? styles.englishCard : styles.hindiCard,
                  selectedLanguage === lang.code && styles.languageCardSelected,
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
                activeOpacity={0.8}
              >
                <View style={styles.languageHeader}>
                  <Text style={styles.languageName}>{lang.nativeName}</Text>
                  <View style={styles.radioButton}>
                    {selectedLanguage === lang.code && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>

                <View style={styles.languageSymbolContainer}>
                  <Text style={styles.languageSymbol}>{lang.letter}</Text>
                </View>

                {/* Landmark icons in background */}
                <View style={styles.landmarkIcon}>
                  <Ionicons 
                    name={lang.code === 'en' ? 'business' : 'home'} 
                    size={40} 
                    color="#FFFFFF" 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default LanguageSelector;