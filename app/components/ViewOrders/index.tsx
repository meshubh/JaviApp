// app/ViewOrders/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { OrderListItem, orderService, PaginatedResponse } from '../../services/OrderService';
import { BorderRadius, Colors, createElevation, Spacing, Typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation';

interface ViewOrdersScreenProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'ViewOrders'>;
  route?: {
    params?: {
      orderId?: string;
    };
  };
}

type FilterType = 'All' | 'Active' | 'Delivered' | 'Cancelled';

const ViewOrdersScreen: React.FC<ViewOrdersScreenProps> = ({ navigation, route }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadOrders(true);
  }, [selectedFilter]);

  useEffect(() => {
    // If navigated with an orderId, scroll to that order
    if (route?.params?.orderId) {
      // You can implement scroll to specific order logic here
    }
  }, [route?.params?.orderId]);

  const getStatusForFilter = (filter: FilterType): string | undefined => {
    switch (filter) {
      case 'Active':
        return 'In Transit,Picked,Ready to Pick,Created,Out for Delivery';
      case 'Delivered':
        return 'Delivered';
      case 'Cancelled':
        return 'Cancelled';
      default:
        return undefined;
    }
  };

  const loadOrders = async (reset: boolean = false) => {
    if (reset) {
      setIsLoading(true);
      setPage(1);
      setHasMore(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const statusFilter = getStatusForFilter(selectedFilter);
      const params: any = {
        page: reset ? 1 : page,
        page_size: 10,
      };

      if (statusFilter) {
        // For multiple statuses, we might need to handle this differently
        // depending on your backend implementation
        if (statusFilter.includes(',')) {
          // Backend might need to handle multiple statuses differently
          params.status = statusFilter.split(',')[0]; // Simplified for now
        } else {
          params.status = statusFilter;
        }
      }

      const response: PaginatedResponse<OrderListItem> = await orderService.getClientOrders(params);

      if (reset) {
        setOrders(response.results);
      } else {
        setOrders([...orders, ...response.results]);
      }

      setHasMore(response.next !== null);
      if (!reset) {
        setPage(page + 1);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrders(true);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadOrders(false);
    }
  };

  const navigateToOrderDetail = (order: OrderListItem) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
  };

  const handleCancelOrder = async (order: OrderListItem) => {
    if (order.status !== 'Created' && order.status !== 'Ready to Pick') {
      Alert.alert('Cannot Cancel', 'Order cannot be cancelled after pickup.');
      return;
    }

    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel order #${order.order_number}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await orderService.cancelOrder(order.id, 'Cancelled by customer');
              Alert.alert('Success', 'Order cancelled successfully');
              handleRefresh();
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Failed to cancel order. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string): string => {
    return orderService.getStatusColor(status);
  };

  const getStatusIcon = (status: string): string => {
    const iconMap: Record<string, string> = {
      'Created': 'access-time',
      'Ready to Pick': 'inventory',
      'Picked': 'check-circle',
      'In Transit': 'local-shipping',
      'Out for Delivery': 'directions-bike',
      'Delivered': 'done-all',
      'Cancelled': 'cancel',
    };
    return iconMap[status] || 'info';
  };

  const renderOrderItem = ({ item }: { item: OrderListItem }) => {
    const statusColor = getStatusColor(item.status);
    
    return (
      <TouchableOpacity 
        style={styles.orderCard} 
        activeOpacity={0.7}
        onPress={() => navigateToOrderDetail(item)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order</Text>
            <Text style={styles.orderId}>#{item.order_number}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <MaterialIcons 
              name={getStatusIcon(item.status) as any} 
              size={14} 
              color={statusColor} 
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderBody}>
          <View style={styles.locationInfo}>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color={Colors.primary.green} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.pickup_city || item.pickup_address_text?.substring(0, 30)}
              </Text>
            </View>
            <Feather name="arrow-down" size={14} color={Colors.text.tertiary} />
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color={Colors.text.error} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.drop_city || item.drop_address_text?.substring(0, 30)}
              </Text>
            </View>
          </View>
          
          <View style={styles.packageInfo}>
            <MaterialIcons name="inventory-2" size={14} color={Colors.text.tertiary} />
            <Text style={styles.packageText}>
              {item.number_of_boxes > 0 && `${item.number_of_boxes} box${item.number_of_boxes > 1 ? 'es' : ''}`}
              {item.number_of_boxes > 0 && item.number_of_bundles > 0 && ', '}
              {item.number_of_bundles > 0 && `${item.number_of_bundles} invoice${item.number_of_bundles > 1 ? 's' : ''}`}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderFooter}>
          <View style={styles.orderDateContainer}>
            <Feather name="calendar" size={14} color={Colors.text.tertiary} />
            <Text style={styles.orderDate}>
              {orderService.formatDate(item.created_at)}
            </Text>
          </View>
          
          {item.order_amount && (
            <Text style={styles.orderAmount}>₹{item.order_amount}</Text>
          )}
        </View>
        
        {(item.status === 'Created' || item.status === 'Ready to Pick') && (
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => handleCancelOrder(item)}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.trackButtonText}>Track</Text>
              <Feather name="chevron-right" size={16} color={Colors.primary.green} />
            </TouchableOpacity>
          </View>
        )}
        
        {item.is_overdue && (
          <View style={styles.overdueTag}>
            <MaterialIcons name="warning" size={12} color={Colors.text.warning} />
            <Text style={styles.overdueText}>Overdue</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="inbox" size={64} color={Colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No Orders Found</Text>
      <Text style={styles.emptySubtitle}>
        {selectedFilter === 'All' 
          ? "You haven't created any orders yet" 
          : `No ${selectedFilter.toLowerCase()} orders`}
      </Text>
      <TouchableOpacity 
        style={styles.createOrderButton}
        onPress={() => navigation.navigate('CreateOrder')}
      >
        <Text style={styles.createOrderButtonText}>Create Your First Order</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary.teal} />
      </View>
    );
  };

  const filters: FilterType[] = ['All', 'Active', 'Delivered', 'Cancelled'];

  return (
    <>
      <StatusBar backgroundColor={Colors.primary.teal} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={Colors.text.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Orders</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('CreateOrder')} 
                style={styles.addButton}
              >
                <Feather name="plus" size={24} color={Colors.text.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
                <Feather name="menu" size={24} color={Colors.text.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.teal} />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              orders.length === 0 && styles.emptyListContent,
            ]}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={renderEmptyList}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[Colors.primary.teal]}
                tintColor={Colors.primary.teal}
              />
            }
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    backgroundColor: Colors.primary.teal,
    ...createElevation(2),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.white,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  filterTabActive: {
    backgroundColor: Colors.primary.green + '15',
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.primary.green,
    fontWeight: Typography.fontWeight.semiBold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
  },
  listContent: {
    paddingVertical: Spacing.md,
  },
  emptyListContent: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...createElevation(1),
    position: 'relative',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  orderIdLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  orderId: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.xs,
  },
  orderBody: {
    marginBottom: Spacing.md,
  },
  locationInfo: {
    marginBottom: Spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  locationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  packageText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.divider,
  },
  orderDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginLeft: Spacing.xs,
  },
  orderAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.divider,
  },
  cancelButton: {
    paddingVertical: Spacing.xs,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.error,
    fontWeight: Typography.fontWeight.medium,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  trackButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.green,
    fontWeight: Typography.fontWeight.medium,
    marginRight: Spacing.xs,
  },
  overdueTag: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.text.warning + '20',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  overdueText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.warning,
    marginLeft: 2,
  },
  separator: {
    height: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  createOrderButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary.green,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  createOrderButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.white,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
});

export default ViewOrdersScreen;