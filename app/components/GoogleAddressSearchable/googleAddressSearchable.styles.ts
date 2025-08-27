// components/GoogleAddressSearchable/googleAddressSearchable.styles.ts
import { Platform } from 'react-native';
import { createStyles } from '../../theme/createStyles';

export const useGoogleAddressSearchableStyles = createStyles((theme) => ({
  // Form Group Styles
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  formLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  requiredAsterisk: {
    color: theme.colors.semantic.error,
  },

  // Address Button Styles
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 48,
    ...theme.elevation[1],
  },
  addressButtonPressed: {
    backgroundColor: theme.colors.surface.pressed,
    borderColor: theme.colors.border.focus,
  },
  addressButtonContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  addressText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  placeholderText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.tertiary,
  },

  // Address Actions Styles
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  clearButtonPressed: {
    backgroundColor: theme.colors.surface.pressed,
  },
  chevronIcon: {
    marginLeft: theme.spacing.xs,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.lg,
    maxHeight: '80%',
    width: '90%',
    ...theme.elevation[4],
    ...(Platform.OS === 'ios' && {
      shadowColor: theme.colors.neutral[1000],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    }),
    ...(Platform.OS === 'android' && {
      elevation: 8,
    }),
  },

  // Modal Header Styles
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  closeButtonPressed: {
    backgroundColor: theme.colors.surface.pressed,
  },

  // Search Container Styles
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  searchInput: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    minHeight: 48,
  },
  searchInputFocused: {
    borderColor: theme.colors.border.focus,
    backgroundColor: theme.colors.surface.elevated,
  },

  // Search Results Styles
  searchResultsContainer: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  resultItemPressed: {
    backgroundColor: theme.colors.surface.pressed,
  },
  resultIcon: {
    marginRight: theme.spacing.sm,
  },
  resultContent: {
    flex: 1,
  },
  resultMainText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  resultSecondaryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },

  // Loading State Styles
  loadingContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // Empty State Styles
  emptyContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyIcon: {
    marginBottom: theme.spacing.md,
  },

  // Error State Styles
  errorContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.semantic.error,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorIcon: {
    marginBottom: theme.spacing.md,
  },

  // Retry Button Styles
  retryButton: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.onPrimary,
  },

  // Animation Styles
  fadeIn: {
    opacity: 0,
  },
  fadeInVisible: {
    opacity: 1,
  },

  // Accessibility Styles
  accessibilityLabel: {
    fontSize: 0, // Hidden but available to screen readers
    color: 'transparent',
  },
}));