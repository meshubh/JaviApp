import { StyleSheet } from 'react-native';
import { DHLTheme } from './themes/dhl.theme';

export const createStyles = <T extends StyleSheet.NamedStyles<T>>(
  stylesFn: (theme: typeof DHLTheme) => T
) => {
  return (theme: typeof DHLTheme) => StyleSheet.create(stylesFn(theme));
};