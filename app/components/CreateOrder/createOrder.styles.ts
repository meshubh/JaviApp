// app/screens/CreateOrder/CreateOrder.styles.ts
import { createStyles } from '../../theme/createStyles';

export const useCreateOrderStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  
  // Header Styles
  header: {
    backgroundColor: theme.colors.primary.main,
    ...theme.elevation[2],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.onPrimary,
  },
  menuButton: {
    padding: theme.spacing.xs,
  },
  
  // Progress Indicator
  progressContainer: {
    backgroundColor: theme.colors.background.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressStepNumber: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressStepNumberActive: {
    backgroundColor: theme.colors.primary.main,
  },
  progressStepNumberCompleted: {
    backgroundColor: theme.colors.semantic.success,
  },
  progressStepText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  progressStepTextActive: {
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
  },
  progressLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: theme.colors.neutral[300],
    top: 16,
    left: '25%',
    right: '25%',
  },
  progressLineActive: {
    backgroundColor: theme.colors.primary.main,
  },
  
  // Content Styles
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  
  // Section Styles
  section: {
    backgroundColor: theme.colors.background.primary,
    marginTop: theme.spacing.xs,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  
  // Form Field Styles
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
  formInput: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    minHeight: 48,
  },
  formInputFocused: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.background.primary,
  },
  formInputError: {
    borderColor: theme.colors.semantic.error,
  },
  formInputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.md,
  },
  formError: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.xs,
  },
  formHint: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  
  // Counter Input Styles
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    overflow: 'hidden',
  },
  counterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
  },
  counterButtonDisabled: {
    backgroundColor: theme.colors.neutral[50],
  },
  counterInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.md,
  },
  
  // Toggle/Switch Styles
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  toggleLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: theme.spacing.md,
  },
  toggleDescription: {
    fontSize: theme.typography.fontSize.s,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm
  },
  
  // Address Card Styles
  addressCard: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    marginBottom: theme.spacing.md,
  },
  addressCardSelected: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
  },
  addressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  addressCardTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  addressCardBadge: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  addressCardBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.onPrimary,
  },
  addressCardBody: {
    marginBottom: theme.spacing.sm,
  },
  addressCardText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  addressCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.sm,
  },
  addressCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    marginLeft: theme.spacing.md,
  },
  addressCardButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.xs,
  },
  
  // Add Address Button
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    borderStyle: 'dashed',
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  addAddressButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.sm,
  },
  
  // Date/Time Picker Styles
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    minHeight: 48,
  },
  datePickerText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  datePickerPlaceholder: {
    color: theme.colors.text.tertiary,
  },
  datePickerIcon: {
    marginLeft: theme.spacing.sm,
  },
  
  // Priority Selector Styles
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  priorityOptionSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.light,
    borderWidth: 2,
  },
  priorityOptionHigh: {
    borderColor: theme.colors.semantic.error,
  },
  priorityOptionHighSelected: {
    backgroundColor: theme.colors.semantic.error + '10',
    borderColor: theme.colors.semantic.error,
  },
  priorityOptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  priorityOptionTextSelected: {
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  
  // Payment Mode Styles
  paymentModeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  paymentModeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  paymentModeOptionSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.light,
    borderWidth: 2,
  },
  paymentModeIcon: {
    marginRight: theme.spacing.xs,
  },
  paymentModeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  paymentModeTextSelected: {
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.dark,
  },
  
  // Summary Section Styles
  summarySection: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary.main,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: theme.colors.border.secondary,
    marginVertical: theme.spacing.sm,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
  },
  summaryTotalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  summaryTotalValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  
  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
    ...theme.elevation[2],
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryActionButton: {
    backgroundColor: theme.colors.primary.main,
    marginLeft: theme.spacing.sm,
    ...theme.elevation[2],
  },
  secondaryActionButton: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    marginRight: theme.spacing.sm,
  },
  disabledActionButton: {
    backgroundColor: theme.colors.neutral[300],
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  primaryActionButtonText: {
    color: theme.colors.text.onPrimary,
  },
  secondaryActionButtonText: {
    color: theme.colors.text.primary,
  },
  
  // Loading/Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateIcon: {
    marginBottom: theme.spacing.lg,
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Validation Messages
  validationContainer: {
    backgroundColor: theme.colors.semantic.error + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.semantic.error + '30',
  },
  validationTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.semantic.error,
    marginBottom: theme.spacing.xs,
  },
  validationList: {
    marginTop: theme.spacing.xs,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  validationBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.semantic.error,
    marginTop: 6,
    marginRight: theme.spacing.sm,
  },
  validationItemText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.error,
    flex: 1,
  },
}));