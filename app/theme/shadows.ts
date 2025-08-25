// app/theme/shadows.ts
import { Platform } from 'react-native';
import { Colors } from './colors';

export const createShadow = (elevation: number = 2) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: Colors.ui.shadow,
      shadowOffset: { 
        width: 0, 
        height: elevation / 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: elevation,
    };
  }
  return {
    elevation: elevation,
  };
};

export const createElevation = (level: 1 | 2 | 3 | 4 | 5) => {
  const elevations = {
    1: createShadow(2),
    2: createShadow(4),
    3: createShadow(6),
    4: createShadow(8),
    5: createShadow(12),
  };
  return elevations[level];
};