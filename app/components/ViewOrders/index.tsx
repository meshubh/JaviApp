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
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { OrderListItem, orderService, PaginatedResponse } from '../../services/OrderService';
import { Colors } from '../../theme';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import { CustomHeader } from '../CustomHeader';
import { useViewOrdersStyles } from './viewOrders.styles';

interface ViewOrdersScreenProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'ViewOrders'>;
  route?: {
    params?: {
      orderId?: string;
    };
  };
}

type FilterType = 'All' | 'In Progress' | 'Active' | 'Completed';

const ViewOrdersScreen: React.FC<ViewOrdersScreenProps> = ({ navigation, route }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { theme } = useTheme();
  const styles = useViewOrdersStyles(theme);

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
    console.log(`Getting status for filter: ${filter}`);
    switch (filter) {
      case 'In Progress':
        return 'pickup requested,pickup assigned'; // Add your actual status names
      case 'Active':
        return 'Ready to Pick,Picked,Out for Delivery,In Transit';
      case 'Completed':
        return 'Delivered,Cancelled,Returned,Failed Delivery';
      default:
        return undefined;
    }
  };

  // Helper function to determine if contract is distance/km based
  const isDistanceBasedContract = (order: OrderListItem): boolean => {
    if (order?.drop_address_text && order.drop_poc_name && order.drop_poc_number) {
      console.log(`Order ${order.order_number} is distance-based.`);
      return true;
    }
    console.log(`Order ${order?.order_number} is not distance-based.`);
    return false;
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
        if (statusFilter.includes(',')) {
          params.status = statusFilter;
        } else {
          params.status = statusFilter;
        }
      }

      const response: PaginatedResponse<OrderListItem> = await orderService.getClientOrders(params);

      if (reset) {
        console.log('Orders fetched:', response.results[0]);
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
    const showDropLocation = isDistanceBasedContract(item);
    
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
              <Feather name="map-pin" size={14} color={theme.colors.primary.main} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.pickup_city || item.pickup_address_text?.substring(0, 30)}
              </Text>
            </View>
            
            {/* Only show drop location for distance/km based contracts */}
            {showDropLocation && (
              <>
                <Feather name="arrow-down" size={14} color={Colors.text.tertiary} />
                <View style={styles.locationRow}>
                  <Feather name="map-pin" size={14} color={theme.colors.semantic.error} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {item.drop_city || item.drop_address_text?.substring(0, 30)}
                  </Text>
                </View>
              </>
            )}
          </View>

          {item.number_of_boxes > 0 || item.number_of_invoices > 0 ? (
            <View style={styles.packageInfo}>
              <MaterialIcons name="inventory-2" size={14} color={Colors.text.tertiary} />
              <Text style={styles.packageText}>
                {item.number_of_boxes > 0 && `${item.number_of_boxes} box${item.number_of_boxes > 1 ? 'es' : ''}`}
                {item.number_of_boxes > 0 && item.number_of_invoices > 0 && ', '}
                {item.number_of_invoices > 0 && `${item.number_of_invoices} invoice${item.number_of_invoices > 1 ? 's' : ''}`}
              </Text>
            </View>
          ) : null}
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
        
        {(item.status === 'Created') && (
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => handleCancelOrder(item)}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
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
          : selectedFilter === 'In Progress'
          ? 'No orders in progress'
          : selectedFilter === 'Active'
          ? 'No active orders'
          : 'No completed orders'}
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
        <ActivityIndicator size="small" color={theme.colors.secondary.main} />
      </View>
    );
  };

  const filters: FilterType[] = ['All', 'In Progress', 'Active', 'Completed'];

  return (
    <>
      <StatusBar backgroundColor={theme.colors.secondary.main} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <CustomHeader
          navigation={navigation}
          title="My Orders"
          showBack={false}
          showMenu={true}
        />

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
            <ActivityIndicator size="large" color={theme.colors.secondary.main} />
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
                colors={[theme.colors.secondary.main]}
                tintColor={theme.colors.secondary.main}
              />
            }
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default ViewOrdersScreen;