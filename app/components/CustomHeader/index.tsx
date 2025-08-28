// app/components/common/CustomHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import { useCustomHeaderStyles } from './customeHeader.styles';

interface CustomHeaderProps {
  navigation: DrawerNavigationProp<RootStackParamList, keyof RootStackParamList>;
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  rightComponent?: React.ReactNode;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  navigation,
  title, 
  showBack = false, 
  showMenu = true,
  rightComponent
}) => {
  const insets = useSafeAreaInsets();
  const themeContext = useTheme();
  const styles = useCustomHeaderStyles(themeContext.theme);


  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        {showMenu && (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        )}
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        {rightComponent}
      </View>
    </View>
  );
};
