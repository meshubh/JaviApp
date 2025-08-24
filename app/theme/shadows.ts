// app/theme/shadows.ts
import { Platform } from 'react-native';

export const createShadow = (elevation: number = 5) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: Colors.ui.shadow,
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.15,
      shadowRadius: elevation * 2,
    };
  }
  return {
    elevation,
  };
};