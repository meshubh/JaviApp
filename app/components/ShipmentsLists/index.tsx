// ShipmentsList.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../theme/themeContext';
import { shipmentListsStyles } from './shipmentLists.styles';

interface ShipmentInfo {
  id: string;
  shipment_number: string;
  status: string;
  created_at: string;
  pickup_completed_at?: string;
  delivery_completed_at?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  tracking_number?: string;
  description?: string;
  special_handling?: string[];
  proof_of_delivery?: string;
  notes?: string;
  number_of_boxes?: number;
  number_of_invoices?: number;
  declared_value?: number;
  is_fragile?: boolean;
  requires_signature?: boolean;
}

interface ShipmentsListProps {
  shipments: ShipmentInfo[];
}

const ShipmentsList: React.FC<ShipmentsListProps> = ({ shipments }) => {
  const { theme } = useTheme();
  const styles = shipmentListsStyles(theme);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Filter shipments based on search query
  const filteredShipments = useMemo(() => {
    if (!searchQuery.trim()) return shipments;
    
    const query = searchQuery.toLowerCase();
    return shipments.filter(shipment =>
      shipment.shipment_number.toLowerCase().includes(query) ||
      shipment.status.toLowerCase().includes(query) ||
      shipment.description?.toLowerCase().includes(query) ||
      shipment.tracking_number?.toLowerCase().includes(query)
    );
  }, [shipments, searchQuery]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const statusCounts = shipments.reduce((acc, shipment) => {
      acc[shipment.status] = (acc[shipment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalWeight = shipments.reduce((acc, shipment) => 
      acc + (shipment.weight || 0), 0);

    return {
      total: shipments.length,
      delivered: statusCounts['Delivered'] || 0,
      inTransit: (statusCounts['In Transit'] || 0) + (statusCounts['Picked'] || 0),
      pending: statusCounts['Created'] || 0,
      totalWeight
    };
  }, [shipments]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Created': theme.colors.neutral[500],
      'Picked': theme.colors.primary.main,
      'In Transit': '#F59E0B',
      'Delivered': theme.colors.semantic.success,
      'Cancelled': theme.colors.semantic.error,
    };
    return colors[status] || theme.colors.neutral[500];
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      'Created': 'file-text',
      'Picked': 'package',
      'In Transit': 'truck',
      'Delivered': 'check-circle',
      'Cancelled': 'x-circle',
    };
    return icons[status] ?? 'info';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setSearchQuery(''); // Clear search when collapsing
    }
  };

  const toggleItemExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderSummaryStats = () => (
    <View style={styles.summaryStats}>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>
          {summaryStats.total}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
          Total
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: theme.colors.semantic.success }]}>
          {summaryStats.delivered}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
          Delivered
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
          {summaryStats.inTransit}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
          In Transit
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: theme.colors.neutral[500] }]}>
          {summaryStats.pending}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
          Pending
        </Text>
      </View>
    </View>
  );

  const renderShipmentItem = ({ item }: { item: ShipmentInfo }) => {
    const isItemExpanded = expandedItems.has(item.id);
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <View style={[styles.shipmentCard, { backgroundColor: theme.colors.background.primary }]}>
        {/* Collapsed Header */}
        <TouchableOpacity
          style={styles.shipmentHeader}
          onPress={() => toggleItemExpanded(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.shipmentHeaderLeft}>
            <MaterialIcons name="inventory" size={20} color={theme.colors.primary.main} />
            <View style={styles.shipmentBasicInfo}>
              <Text style={[styles.shipmentNumber, { color: theme.colors.text.primary }]}>
                {item.shipment_number}
              </Text>
              <View style={styles.shipmentMeta}>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                  <Feather name={statusIcon as any} size={12} color={statusColor} />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {item.status}
                  </Text>
                </View>
                {item.weight && (
                  <Text style={[styles.weightText, { color: theme.colors.text.secondary }]}>
                    {item.weight} kg
                  </Text>
                )}
              </View>
            </View>
          </View>
          <MaterialIcons
            name={isItemExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>

        {/* Expanded Details */}
        {isItemExpanded && (
          <View style={styles.shipmentDetails}>
            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              {item.tracking_number && (
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                    Tracking #
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    {item.tracking_number}
                  </Text>
                </View>
              )}

              {item.dimensions && (
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                    Dimensions
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    {item.dimensions.length}×{item.dimensions.width}×{item.dimensions.height} cm
                  </Text>
                </View>
              )}

              {item && item.number_of_boxes && item.number_of_boxes > 0 && (
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                    Boxes
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    {item.number_of_boxes}
                  </Text>
                </View>
              )}

              {item && item.number_of_invoices && item.number_of_invoices > 0 && (
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                    Invoices
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    {item.number_of_invoices}
                  </Text>
                </View>
              )}

              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                  Created
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                  {formatDate(item.created_at)}
                </Text>
              </View>

              {item.pickup_completed_at && (
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                    Picked Up
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    {formatDate(item.pickup_completed_at)}
                  </Text>
                </View>
              )}

              {item.delivery_completed_at && (
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                    Delivered
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    {formatDate(item.delivery_completed_at)}
                  </Text>
                </View>
              )}

              {item.declared_value && (
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                    Value
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    ₹{item.declared_value}
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            {item.description && (
              <View style={styles.descriptionContainer}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                  Description
                </Text>
                <Text style={[styles.descriptionText, { color: theme.colors.text.primary }]}>
                  {item.description}
                </Text>
              </View>
            )}

            {/* Special Handling & Flags */}
            <View style={styles.flagsContainer}>
              {item.is_fragile && (
                <View style={[styles.flag, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialIcons name="warning" size={14} color="#D97706" />
                  <Text style={[styles.flagText, { color: '#D97706' }]}>Fragile</Text>
                </View>
              )}
              {item.requires_signature && (
                <View style={[styles.flag, { backgroundColor: '#DBEAFE' }]}>
                  <MaterialIcons name="edit" size={14} color="#2563EB" />
                  <Text style={[styles.flagText, { color: '#2563EB' }]}>Signature Required</Text>
                </View>
              )}
              {item.special_handling && item.special_handling.map((tag, index) => (
                <View
                  key={index}
                  style={[styles.flag, { backgroundColor: theme.colors.primary.light + '30' }]}
                >
                  <Text style={[styles.flagText, { color: theme.colors.primary.main }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>

            {/* Notes */}
            {item.notes && (
              <View style={styles.notesContainer}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                  Notes
                </Text>
                <Text style={[styles.notesText, { color: theme.colors.text.primary }]}>
                  {item.notes}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (!shipments || shipments.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <MaterialIcons 
            name="local-shipping" 
            size={24} 
            color={theme.colors.primary.main} 
          />
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Shipments ({shipments.length})
          </Text>
        </View>
        <MaterialIcons
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>

      {/* Summary Stats - always visible */}
      {renderSummaryStats()}

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Search Bar */}
          {shipments.length > 3 && (
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.background.secondary }]}>
              <MaterialIcons name="search" size={20} color={theme.colors.text.secondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text.primary }]}
                placeholder="Search shipments..."
                placeholderTextColor={theme.colors.text.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="clear" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Results Info */}
          {searchQuery && (
            <Text style={[styles.resultsInfo, { color: theme.colors.text.secondary }]}>
              {filteredShipments.length} of {shipments.length} shipments
            </Text>
          )}

          {/* Shipments List */}
          <FlatList
            data={filteredShipments}
            renderItem={renderShipmentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // Parent ScrollView handles scrolling
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <MaterialIcons name="search-off" size={48} color={theme.colors.text.secondary} />
                <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                  No shipments found matching "{searchQuery}"
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default ShipmentsList;