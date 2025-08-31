import { createStyles } from '../../theme/createStyles';

export const useAddressesStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  
  addButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.onPrimary,
  },
  
  listContent: {
    padding: theme.spacing.lg,
  },
  
  addressCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.elevation[2],
  },
  
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  addressType: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },

  // Contact Information Styles (NEW)
  contactSection: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  
  contactName: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  
  contactNumber: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    textDecorationLine: 'underline',
  },

  primaryBadge: {
    backgroundColor: theme.colors.primary.light + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary.light,
  },
  
  primaryText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.primary.main,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  activeBadge: {
    backgroundColor: theme.colors.semantic.success + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  
  activeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.success,
    fontWeight: theme.typography.fontWeight.medium,
  },
  
  addressLine1: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  addressLine2: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  
  addressLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  
  landmark: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
  
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
  },

  setPrimaryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    backgroundColor: 'transparent',
  },
  
  setPrimaryText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.main,
  },
  
  actionButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.md,
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl * 2,
  },
  
  emptyText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.regular,
    marginTop: theme.spacing.sm,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '90%',
    paddingBottom: theme.spacing.xl,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  
  formSection: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },

  // Form Section Headers (NEW)
  formSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  
  formSectionTitle: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.primary.main,
  },

  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.regular,
  },
  
  formRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
  },
  
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  
  input: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },

  // Input Error State (NEW)
  inputError: {
    borderColor: theme.colors.semantic.error,
    borderWidth: 1,
  },
  
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
  },
  
  typeOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  
  typeOptionActive: {
    backgroundColor: theme.colors.primary.main,
  },
  
  typeOptionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  
  typeOptionTextActive: {
    color: theme.colors.text.onPrimary,
  },
  
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  
  switchLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
  },
  
  cancelButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  
  cancelButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.secondary,
  },
  
  saveButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
  },

  saveButtonDisabled: {
    opacity: 0.6,
    elevation: 0,
  },
  
  saveButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.onPrimary,
  },
}));