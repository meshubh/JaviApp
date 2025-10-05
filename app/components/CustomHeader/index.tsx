// app/components/common/CustomHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/themeContext';
import { useCustomHeaderStyles } from './customeHeader.styles';

interface CustomHeaderProps {
  navigation?: any;
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  rightComponent?: React.ReactNode;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  navigation,
  title, 
  showBack = false, 
  showMenu = false,
  rightComponent
}) => {
  const insets = useSafeAreaInsets();
  const themeContext = useTheme();
  const styles = useCustomHeaderStyles(themeContext.theme);

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        {showMenu && navigation && (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        )}
        {showBack && navigation && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        {!showMenu && !showBack && <View style={{ width: 24 }} />}
        <Text style={styles.title}>{title}</Text>
        {rightComponent || <View style={{ width: 24 }} />}
      </View>
    </View>
  );
};