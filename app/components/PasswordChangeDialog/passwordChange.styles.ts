import { createStyles } from '../../theme/createStyles';

export const passwordChangeStyles = createStyles((theme) => ({
  modalContainer: {
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      ...theme.overlay.backdrop,
      justifyContent: 'center' as const,
      padding: theme.spacing.xl,
    },
    modalContent: {
      backgroundColor: theme.overlay.modal.backgroundColor,
      borderRadius: theme.overlay.modal.borderRadius,
      padding: 24,
      maxHeight: '80%',
      // Flatten the elevation object manually
      elevation: theme.overlay.modal.elevation.elevation,
      shadowColor: theme.overlay.modal.elevation.shadowColor,
      shadowOffsetWidth: theme.overlay.modal.elevation.shadowOffset.width,
      shadowOffsetHeight: theme.overlay.modal.elevation.shadowOffset.height,
      shadowOpacity: theme.overlay.modal.elevation.shadowOpacity,
      shadowRadius: theme.overlay.modal.elevation.shadowRadius,
    },
    title: {
      ...theme.typography.styles.h2,
      textAlign: 'center' as const,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.styles.body,
      textAlign: 'center' as const,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xxxl,
      lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
    },
    inputContainer: {
      marginBottom: theme.spacing.xl,
    },
    label: {
      ...theme.typography.styles.label,
      marginBottom: theme.spacing.sm,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      backgroundColor: theme.colors.surface.secondary,
      color: theme.colors.text.primary,
    },
    inputError: {
      borderColor: theme.colors.border.error,
      backgroundColor: theme.colors.background.tertiary,
    },
    errorText: {
      color: theme.colors.semantic.error,
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing.xs,
    },
    buttonContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginTop: theme.spacing.xxxl,
      gap: theme.spacing.md,
    },
    button: {
      flex: 1,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 48, // Accessibility guideline
    },
    cancelButton: {
      backgroundColor: theme.colors.surface.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    cancelButtonText: {
      ...theme.typography.styles.button,
      color: theme.colors.text.secondary,
    },
    changeButton: {
      backgroundColor: theme.colors.primary.main,
      ...theme.elevation[2],
    },
    changeButtonText: {
      ...theme.typography.styles.button,
      color: theme.colors.primary.contrast,
      textAlign: 'center' as const,
    },
    disabledButton: {
      opacity: 0.6,
    },
}));