import { DHLTheme } from './themes/dhl.theme';

export const getStatusColor = (status: string, theme: typeof DHLTheme): string => {
  const statusColorMap: Record<string, string> = {
    'Created': theme.colors.status.pending,
    'Ready to Pick': theme.colors.primary.main,
    'Picked': theme.colors.semantic.info,
    'In Transit': theme.colors.semantic.info,
    'Out for Delivery': theme.colors.primary.dark,
    'Delivered': theme.colors.status.completed,
    'Cancelled': theme.colors.status.cancelled,
  };
  return statusColorMap[status] || theme.colors.neutral[500];
};

export const getButtonStyles = (
  variant: 'primary' | 'secondary' | 'danger' | 'text',
  theme: typeof DHLTheme
) => {
  const baseStyles = {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
  };

  const variants = {
    primary: {
      ...baseStyles,
      backgroundColor: theme.colors.primary.main,
      ...theme.elevation[2],
    },
    secondary: {
      ...baseStyles,
      backgroundColor: theme.colors.secondary.main,
      ...theme.elevation[2],
    },
    danger: {
      ...baseStyles,
      backgroundColor: theme.colors.semantic.error,
      ...theme.elevation[2],
    },
    text: {
      ...baseStyles,
      backgroundColor: 'transparent',
    },
  };

  return variants[variant];
};