// app/OrderDetails/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { OrderDetail, orderService } from '../../services/OrderService';
import { BorderRadius, Colors, createElevation, Spacing, Typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation';

interface OrderDetailsScreenProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'OrderDetails'>;
  route: {
    params: {
      orderId: string;
    };
  };
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const orderData = await orderService.getOrderDetail(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order details:', error);
      Alert.alert('Error', 'Failed to load order details. Please try again.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrderDetails();
  };

  const handleCancelOrder = () => {
    if (!order) return;

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
              loadOrderDetails();
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Failed to cancel order. Please try again.');
            }
          },
        },
      ]
    );
  };

  const openMaps = (url?: string, address?: string) => {
    if (url) {
      Linking.openURL(url);
    } else if (address) {
      const query = encodeURIComponent(address);
      const mapsUrl = Platform.OS === 'ios'
        ? `maps:0,0?q=${query}`
        : `geo:0,0?q=${query}`;
      Linking.openURL(mapsUrl);
    }
  };

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const sendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const renderStatusTimeline = () => {
    if (!order?.status_timeline || order.status_timeline.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Timeline</Text>
        {order.status_timeline.map((item, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineIndicator}>
              <View style={[
                styles.timelineDot,
                index === 0 && styles.timelineDotActive
              ]} />
              {index < ((order.status_timeline?.length ?? 0) - 1) && (
                <View style={styles.timelineLine} />
              )}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStatus}>{item.status}</Text>
              <Text style={styles.timelineDate}>
                {orderService.formatDateTime(item.changed_at)}
              </Text>
              {item.reason && (
                <Text style={styles.timelineReason}>{item.reason}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderTracking = () => {
    if (!order?.latest_tracking) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Tracking</Text>
        <View style={styles.trackingCard}>
          <View style={styles.trackingHeader}>
            <MaterialIcons name="location-on" size={20} color={Colors.primary.green} />
            <Text style={styles.trackingActivity}>{order.latest_tracking.activity}</Text>
          </View>
          <Text style={styles.trackingTime}>
            {orderService.formatDateTime(order.latest_tracking.timestamp)}
          </Text>
          {order.latest_tracking.location_address && (
            <Text style={styles.trackingLocation}>
              {order.latest_tracking.location_address}
            </Text>
          )}
          {order.latest_tracking.latitude && order.latest_tracking.longitude && (
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => {
                if (order.latest_tracking) {
                  const url = `https://maps.google.com/?q=${order.latest_tracking.latitude},${order.latest_tracking.longitude}`;
                  Linking.openURL(url);
                }
              }}
            >
              <Text style={styles.mapButtonText}>View on Map</Text>
              <Feather name="external-link" size={14} color={Colors.primary.green} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.teal} />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={Colors.text.error} />
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = orderService.getStatusColor(order.status);

  return (
    <>
      <StatusBar backgroundColor={Colors.primary.teal} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
              <Feather name="arrow-left" size={24} color={Colors.text.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order #{order.order_number}</Text>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Feather name="menu" size={24} color={Colors.text.white} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary.teal]}
              tintColor={Colors.primary.teal}
            />
          }
        >
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <MaterialIcons 
                name={orderService.getStatusIcon(order.status) as any} 
                size={20} 
                color={statusColor} 
              />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {order.status}
              </Text>
            </View>
            <Text style={styles.statusDate}>
              Created on {orderService.formatDateTime(order.created_at)}
            </Text>
            {order.is_overdue && (
              <View style={styles.overdueAlert}>
                <MaterialIcons name="warning" size={16} color={Colors.text.warning} />
                <Text style={styles.overdueText}>This order is overdue</Text>
              </View>
            )}
          </View>

          {/* Package Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Package Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Packages:</Text>
              <Text style={styles.infoValue}>
                {order.number_of_boxes > 0 && `${order.number_of_boxes} box${order.number_of_boxes > 1 ? 'es' : ''}`}
                {order.number_of_boxes > 0 && order.number_of_bundles > 0 && ', '}
                {order.number_of_bundles > 0 && `${order.number_of_bundles} invoice${order.number_of_bundles > 1 ? 's' : ''}`}
              </Text>
            </View>
            {order.total_weight && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Weight:</Text>
                <Text style={styles.infoValue}>{order.total_weight} kg</Text>
              </View>
            )}
            {order.declared_value && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Declared Value:</Text>
                <Text style={styles.infoValue}>₹{order.declared_value}</Text>
              </View>
            )}
            {order.package_description && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Description:</Text>
                <Text style={styles.infoValue}>{order.package_description}</Text>
              </View>
            )}
            <View style={styles.tagContainer}>
              {order.is_fragile && (
                <View style={styles.tag}>
                  <MaterialIcons name="warning" size={12} color={Colors.text.warning} />
                  <Text style={styles.tagText}>Fragile</Text>
                </View>
              )}
              {order.requires_signature && (
                <View style={styles.tag}>
                  <MaterialIcons name="edit" size={12} color={Colors.primary.blue} />
                  <Text style={styles.tagText}>Signature Required</Text>
                </View>
              )}
              <View style={[styles.tag, styles.priorityTag]}>
                <Text style={styles.tagText}>{order.priority} Priority</Text>
              </View>
            </View>
          </View>

          {/* Addresses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Address</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Feather name="map-pin" size={16} color={Colors.primary.green} />
                <Text style={styles.addressTitle}>Pickup Location</Text>
              </View>
              <Text style={styles.addressText}>
                {order.pickup_address.address_line_1}
                {order.pickup_address.address_line_2 && `\n${order.pickup_address.address_line_2}`}
                {`\n${order.pickup_address.city}, ${order.pickup_address.state} ${order.pickup_address.pincode}`}
              </Text>
              {order.pickup_address.contact_person_name && (
                <View style={styles.contactInfo}>
                  <Feather name="user" size={14} color={Colors.text.secondary} />
                  <Text style={styles.contactText}>
                    {order.pickup_address.contact_person_name}
                  </Text>
                </View>
              )}
              {order.pickup_address.contact_person_phone && (
                <TouchableOpacity
                  style={styles.contactInfo}
                  onPress={() => callPhone(order.pickup_address.contact_person_phone!)}
                >
                  <Feather name="phone" size={14} color={Colors.primary.green} />
                  <Text style={[styles.contactText, styles.contactLink]}>
                    {order.pickup_address.contact_person_phone}
                  </Text>
                </TouchableOpacity>
              )}
              {order.pickup_maps_url && (
                <TouchableOpacity
                  style={styles.mapLink}
                  onPress={() => openMaps(order.pickup_maps_url, 
                    `${order.pickup_address.address_line_1}, ${order.pickup_address.city}`)}
                >
                  <MaterialIcons name="directions" size={16} color={Colors.primary.green} />
                  <Text style={styles.mapLinkText}>Get Directions</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Drop Address</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Feather name="map-pin" size={16} color={Colors.text.error} />
                <Text style={styles.addressTitle}>Drop Location</Text>
              </View>
              <Text style={styles.addressText}>
                {order.drop_address_text || 
                 `${order.drop_address.address_line_1}
${order.drop_address.address_line_2 ? order.drop_address.address_line_2 + '\n' : ''}${order.drop_address.city}, ${order.drop_address.state} ${order.drop_address.pincode}`}
              </Text>
              {order.drop_address.contact_person_name && (
                <View style={styles.contactInfo}>
                  <Feather name="user" size={14} color={Colors.text.secondary} />
                  <Text style={styles.contactText}>
                    {order.drop_address.contact_person_name}
                  </Text>
                </View>
              )}
              {order.drop_address.contact_person_phone && (
                <TouchableOpacity
                  style={styles.contactInfo}
                  onPress={() => callPhone(order.drop_address.contact_person_phone!)}
                >
                  <Feather name="phone" size={14} color={Colors.primary.green} />
                  <Text style={[styles.contactText, styles.contactLink]}>
                    {order.drop_address.contact_person_phone}
                  </Text>
                </TouchableOpacity>
              )}
              {order.drop_maps_url && (
                <TouchableOpacity
                  style={styles.mapLink}
                  onPress={() => openMaps(order.drop_maps_url,
                    order.drop_address_text || `${order.drop_address.address_line_1}, ${order.drop_address.city}`)}
                >
                  <MaterialIcons name="directions" size={16} color={Colors.primary.green} />
                  <Text style={styles.mapLinkText}>Get Directions</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            {order.expected_pickup_date && (
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIcon}>
                  <MaterialIcons name="schedule" size={20} color={Colors.primary.green} />
                </View>
                <View style={styles.scheduleContent}>
                  <Text style={styles.scheduleLabel}>Expected Pickup</Text>
                  <Text style={styles.scheduleDate}>
                    {orderService.formatDateTime(order.expected_pickup_date)}
                  </Text>
                </View>
              </View>
            )}
            {order.expected_delivery_date && (
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIcon}>
                  <MaterialIcons name="local-shipping" size={20} color={Colors.primary.blue} />
                </View>
                <View style={styles.scheduleContent}>
                  <Text style={styles.scheduleLabel}>Expected Delivery</Text>
                  <Text style={styles.scheduleDate}>
                    {orderService.formatDateTime(order.expected_delivery_date)}
                  </Text>
                </View>
              </View>
            )}
            {order.pickup_completed_at && (
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIcon}>
                  <MaterialIcons name="check-circle" size={20} color={Colors.primary.green} />
                </View>
                <View style={styles.scheduleContent}>
                  <Text style={styles.scheduleLabel}>Actual Pickup</Text>
                  <Text style={styles.scheduleDate}>
                    {orderService.formatDateTime(order.pickup_completed_at)}
                  </Text>
                </View>
              </View>
            )}
            {order.delivery_completed_at && (
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIcon}>
                  <MaterialIcons name="done-all" size={20} color={Colors.primary.green} />
                </View>
                <View style={styles.scheduleContent}>
                  <Text style={styles.scheduleLabel}>Delivered</Text>
                  <Text style={styles.scheduleDate}>
                    {orderService.formatDateTime(order.delivery_completed_at)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Payment Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Mode:</Text>
              <Text style={styles.infoValue}>{order.payment_mode}</Text>
            </View>
            {order.order_amount && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order Amount:</Text>
                <Text style={[styles.infoValue, styles.amountText]}>₹{order.order_amount}</Text>
              </View>
            )}
            {order.cod_amount && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>COD Amount:</Text>
                <Text style={[styles.infoValue, styles.amountText]}>₹{order.cod_amount}</Text>
              </View>
            )}
          </View>

          {/* Special Instructions */}
          {order.special_instructions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <Text style={styles.instructionsText}>{order.special_instructions}</Text>
            </View>
          )}

          {/* Contact Information */}
          {(order.customer_phone || order.customer_email) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              {order.customer_phone && (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => callPhone(order.customer_phone!)}
                >
                  <Feather name="phone" size={16} color={Colors.primary.green} />
                  <Text style={styles.contactLink}>{order.customer_phone}</Text>
                </TouchableOpacity>
              )}
              {order.customer_email && (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => sendEmail(order.customer_email!)}
                >
                  <Feather name="mail" size={16} color={Colors.primary.green} />
                  <Text style={styles.contactLink}>{order.customer_email}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Status Timeline */}
          {renderStatusTimeline()}

          {/* Latest Tracking */}
          {renderTracking()}

          {/* Actions */}
          {(order.status === 'Created' || order.status === 'Ready to Pick') && (
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={styles.cancelOrderButton}
                onPress={handleCancelOrder}
              >
                <MaterialIcons name="cancel" size={20} color={Colors.text.white} />
                <Text style={styles.cancelOrderButtonText}>Cancel Order</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: Spacing.xxxl }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  backButton: {
    backgroundColor: Colors.primary.teal,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    color: Colors.text.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
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
  headerBackButton: {
    padding: Spacing.xs,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.white,
  },
  content: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: Colors.background.primary,
    padding: Spacing.xl,
    marginVertical: Spacing.xs,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    marginLeft: Spacing.sm,
  },
  statusDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    backgroundColor: Colors.text.warning + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  overdueText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.warning,
    marginLeft: Spacing.xs,
  },
  section: {
    backgroundColor: Colors.background.primary,
    padding: Spacing.xl,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
    textAlign: 'right',
  },
  amountText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary.green,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ui.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  priorityTag: {
    backgroundColor: Colors.primary.blue + '20',
  },
  tagText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  addressCard: {
    backgroundColor: Colors.background.inputBar,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addressTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  addressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  contactText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  contactLink: {
    color: Colors.primary.green,
    textDecorationLine: 'underline',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.divider,
  },
  mapLinkText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.green,
    marginLeft: Spacing.xs,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  scheduleIcon: {
    width: 40,
    alignItems: 'center',
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  scheduleDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  instructionsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  timelineIndicator: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.ui.border,
  },
  timelineDotActive: {
    backgroundColor: Colors.primary.green,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.ui.border,
    marginTop: Spacing.xs,
  },
  timelineContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  timelineStatus: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  timelineDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  timelineReason: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  trackingCard: {
    backgroundColor: Colors.background.inputBar,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  trackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingActivity: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  trackingTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  trackingLocation: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.divider,
  },
  mapButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.green,
    marginRight: Spacing.xs,
  },
  actionSection: {
    padding: Spacing.xl,
  },
  cancelOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.text.error,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    height: 48,
    ...createElevation(2),
  },
  cancelOrderButtonText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.white,
  },
});

export default OrderDetailsScreen;