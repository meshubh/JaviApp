import { createStyles } from '../../../theme/createStyles';

export const useModalPickerStyles = createStyles((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '70%',
    ...theme.elevation[4],
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
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  
  closeButton: {
    padding: theme.spacing.xs,
  },
  
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  
  modalItem: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  
  modalItemSelected: {
    backgroundColor: theme.colors.background.tertiary,
  },
  
  modalItemTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  modalItemSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  
  emptyContainer: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.tertiary,
  },
}));