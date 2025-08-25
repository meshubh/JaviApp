import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, createElevation, Spacing, Typography } from '../../../theme';

export const searchableDropdownStyles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.text.error,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.inputBar,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  dropdownText: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    marginRight: Spacing.xs,
  },
  placeholderText: {
    color: Colors.text.tertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  dropdownContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    ...createElevation(4),
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  listContainer: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  selectedItem: {
    backgroundColor: Colors.ui.backgroundSelected,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  selectedText: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.teal,
  },
  emptyContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
});