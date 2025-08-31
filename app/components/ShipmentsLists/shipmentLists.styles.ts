import { createStyles } from "../../theme/createStyles";

export const shipmentListsStyles = createStyles((theme) => ({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  expandedContent: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  resultsInfo: {
    fontSize: 14,
    marginBottom: 8,
  },
  shipmentCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  shipmentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shipmentBasicInfo: {
    marginLeft: 12,
    flex: 1,
  },
  shipmentNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  shipmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  weightText: {
    fontSize: 12,
  },
  shipmentDetails: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 8,
    paddingRight: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  flagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  flag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  flagText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
}));