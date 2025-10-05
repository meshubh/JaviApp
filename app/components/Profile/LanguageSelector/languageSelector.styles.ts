import { createStyles } from '../../../theme/createStyles';

export const useLanguageSelectorStyles = createStyles((theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: 40,
    },
    languageGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
    languageCard: {
      width: '48%',
      aspectRatio: 1,
      borderRadius: 16,
      padding: 20,
      justifyContent: 'space-between',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    languageCardSelected: {
      borderColor: theme.colors.primary.main,
    },
    englishCard: {
      backgroundColor: '#5BB5E8',
    },
    hindiCard: {
      backgroundColor: '#26C6DA',
    },
    languageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    languageName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    radioButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#FFFFFF',
    },
    languageSymbolContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    languageSymbol: {
      fontSize: 80,
      fontWeight: '700',
      color: 'rgba(255, 255, 255, 0.3)',
    },
    landmarkIcon: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      opacity: 0.2,
    },
    continueButton: {
      backgroundColor: theme.colors.primary.main,
      borderRadius: 28,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginBottom: 40,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    continueButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
}));