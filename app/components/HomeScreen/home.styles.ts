// app/screens/Home/home.styles.ts
import { createStyles } from '../../theme/createStyles';

export const useHomeStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  
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
  
  menuButton: {
    padding: theme.spacing.xs,
  },
  
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.onPrimary,
    flex: 1,
    textAlign: 'center',
  },
  
  notificationButton: {
    padding: theme.spacing.xs,
    position: 'relative',
  },
  
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.semantic.error,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  
  content: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  
  welcomeSection: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
    marginBottom: theme.spacing.xs,
  },
  
  welcomeText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  
  userName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  
  dateText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.sm,
  },
  
  sectionContainer: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing.xs,
  },
  
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    ...theme.elevation[1],
  },
  
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  cardContent: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  
  cardTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  cardSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
    alignItems: 'center',
    ...theme.elevation[1],
  },
  
  statNumber: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  
  statTrendText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
    marginLeft: theme.spacing.xs,
  },
  
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  
  quickStatItem: {
    alignItems: 'center',
  },
  
  quickStatValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  quickStatLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  
  loadingContainer: {
    padding: theme.spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  errorContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  
  errorText: {
    color: theme.colors.semantic.error,
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  
  retryButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
  },
  
  retryText: {
    color: theme.colors.text.onPrimary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
}));