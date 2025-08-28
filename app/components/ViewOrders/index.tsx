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
              <Feather name="map-pin" size={14} color={theme.colors.primary.main} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.pickup_city || item.pickup_address_text?.substring(0, 30)}
              </Text>
            </View>
            <Feather name="arrow-down" size={14} color={Colors.text.tertiary} />
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color={theme.colors.semantic.error} />
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
              <Feather name="chevron-right" size={16} color={theme.colors.primary.main} />
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
        <ActivityIndicator size="small" color={theme.colors.secondary.main} />
      </View>
    );
  };

  const filters: FilterType[] = ['All', 'Active', 'Delivered', 'Cancelled'];

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