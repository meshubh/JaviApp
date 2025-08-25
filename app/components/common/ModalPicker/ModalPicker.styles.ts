// app/components/ModalPicker/ModalPicker.styles.ts
import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, createElevation, Spacing, Typography } from '../../../theme';

export const modalPickerStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
    ...createElevation(4),
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
  },
  
  closeButton: {
    padding: Spacing.xs,
  },
  
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  
  modalItem: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  
  modalItemSelected: {
    backgroundColor: Colors.ui.backgroundSelected,
  },
  
  modalItemTitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  
  modalItemSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  
  emptyText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.tertiary,
  },
});