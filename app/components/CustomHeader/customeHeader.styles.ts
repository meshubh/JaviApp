// app/screens/Home/customHeader.styles.ts
import { createStyles } from '../../theme/createStyles';

export const useCustomHeaderStyles = createStyles((theme) => ({
    header: {
        backgroundColor: theme.colors.primary.main,
        paddingBottom: theme.spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        height: 50,
    },
    title: {
        flex: 1,
        color: theme.colors.text.onPrimary,
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        marginLeft: theme.spacing.lg,
    },
}));