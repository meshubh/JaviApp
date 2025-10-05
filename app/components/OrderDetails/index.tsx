// app/OrderDetails/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { OrderDetail, orderService } from '../../services/OrderService';
import { Colors, Spacing } from '../../theme';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import { CustomHeader } from '../CustomHeader';
import ShipmentsList from '../ShipmentsLists/index';
import { useOrderDetailsStyles } from './orderDetails.styles';

interface OrderDetailsScreenProps {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>,
    BottomTabNavigationProp<RootStackParamList>
  >;
  route: {
    params: {
      orderId: string;
    };
  };
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { orderId } = route.params;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { theme } = useTheme();
  const styles = useOrderDetailsStyles(theme);

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

  // Helper function to determine if contract is distance/km based
  const isDistanceBasedContract = (): boolean => {
    if (order?.drop_address_text && order.drop_poc_name && order.drop_poc_number) {
      console.log(`Order ${order.order_number} is distance-based.`);
      return true;
    }
    console.log(`Order ${order?.order_number} is not distance-based.`);
    return false;
  };

  const renderStatusTimeline = () => {
    if (!order?.status_timeline || order.status_timeline.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('orderDetails.statusTimeline.value')}</Text>
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
              <Text style={styles.timelineStatus}>
                {t('statuses.'+ item.status .toLowerCase().replace(/ /g, '') + '.value')}
              </Text>
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
        <Text style={styles.sectionTitle}>{t('orderDetails.latestTracking.value')}</Text>
        <View style={styles.trackingCard}>
          <View style={styles.trackingHeader}>
            <MaterialIcons name="location-on" size={20} color={theme.colors.primary.main} />
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
              <Text style={styles.mapButtonText}>{t('orderDetails.viewOnMap.value')}</Text>
              <Feather name="external-link" size={14} color={theme.colors.primary.main} />
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
          <ActivityIndicator size="large" color={theme.colors.secondary.main} />
          <Text style={styles.loadingText}>{t('orderDetails.loadingOrder.value')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={theme.colors.semantic.error} />
          <Text style={styles.errorText}>{t('orderDetails.orderNotFound.value')}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{t('orderDetails.goBack.value')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = orderService.getStatusColor(order.status);
  const showDropLocation = isDistanceBasedContract();

  return (
    <>
      <StatusBar backgroundColor={theme.colors.secondary.main} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <CustomHeader
          navigation={navigation}
          title={`${t('orders.orderNumber.value')} #${order.order_number}`}
          showBack={true}
          showMenu={false}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.secondary.main]}
              tintColor={theme.colors.secondary.main}
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
                {t('statuses.'+ order.status .toLowerCase().replace(/ /g, '') + '.value')}
              </Text>
            </View>
            <Text style={styles.statusDate}>
               {t('orderDetails.createdOn.value') + ' ' + orderService.formatDateTime(order.created_at)}
            </Text>
            {order.is_overdue && (
              <View style={styles.overdueAlert}>
                <MaterialIcons name="warning" size={16} color={Colors.text.warning} />
                <Text style={styles.overdueText}>{t('orderDetails.orderOverdue.value')}</Text>
              </View>
            )}
          </View>

          {/* Shipments List */}
          {order.shipments_info && order.shipments_info.length > 0 && (
            <View style={styles.section}>
              <ShipmentsList 
                shipments={order.shipments_info}
              />
            </View>
          )}

          {/* Package Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('orderDetails.packageInformation.value')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('orderDetails.packages.value')}:</Text>
              <Text style={styles.infoValue}>
                {order.number_of_boxes > 0 && `${order.number_of_boxes} box${order.number_of_boxes > 1 ? 'es' : ''}`}
                {order.number_of_boxes > 0 && order.number_of_invoices > 0 && ', '}
                {order.number_of_invoices > 0 && `${order.number_of_invoices} invoice${order.number_of_invoices > 1 ? 's' : ''}`}
              </Text>
            </View>
            {order.package_description && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('orderDetails.description.value')}:</Text>
                <Text style={styles.infoValue}>{order.package_description}</Text>
              </View>
            )}
          </View>

          {/* Addresses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('orderDetails.pickupAddress.value')}</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Feather name="map-pin" size={16} color={theme.colors.primary.main} />
                <Text style={styles.addressTitle}>{t('orderDetails.pickupLocation.value')}</Text>
              </View>
              <Text style={styles.addressText}>
                {order.pickup_address.address_line_1}
                {order.pickup_address.address_line_2 && `\n${order.pickup_address.address_line_2}`}
                {`\n${order.pickup_address.city}, ${order.pickup_address.state} ${order.pickup_address.pincode}`}
              </Text>
              {order.pickup_address.contact_person_name && (
                <View style={styles.contactInfo}>
                  <Feather name="user" size={14} color={theme.colors.text.secondary} />
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
                  <Feather name="phone" size={14} color={theme.colors.primary.main} />
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
                  <MaterialIcons name="directions" size={16} color={theme.colors.primary.main} />
                  <Text style={styles.mapLinkText}>{t('orderDetails.getDirections.value')}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Drop Address - Only show for distance/km based contracts */}
            {showDropLocation && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>{t('orderDetails.dropAddress.value')}</Text>
                <View style={styles.addressCard}>
                  <View style={styles.addressHeader}>
                    <Feather name="map-pin" size={16} color={theme.colors.semantic.error} />
                    <Text style={styles.addressTitle}>{t('orderDetails.dropLocation.value')}</Text>
                  </View>
                  <Text style={styles.addressText}>
                    {order.drop_address_text || 
                     `${order.drop_address.address_line_1}
${order.drop_address.address_line_2 ? order.drop_address.address_line_2 + '\n' : ''}${order.drop_address.city}, ${order.drop_address.state} ${order.drop_address.pincode}`}
                  </Text>
                  {order.drop_address.contact_person_name && (
                    <View style={styles.contactInfo}>
                      <Feather name="user" size={14} color={theme.colors.text.secondary} />
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
                      <Feather name="phone" size={14} color={theme.colors.primary.main} />
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
                      <MaterialIcons name="directions" size={16} color={theme.colors.primary.main} />
                      <Text style={styles.mapLinkText}>{t('orderDetails.getDirections.value')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>

          {/* Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('orderDetails.schedule.value')}</Text>
            {order.expected_pickup_date && (
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIcon}>
                  <MaterialIcons name="schedule" size={20} color={theme.colors.primary.main} />
                </View>
                <View style={styles.scheduleContent}>
                  <Text style={styles.scheduleLabel}>{t('orderDetails.expectedPickup.value')}</Text>
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
                  <Text style={styles.scheduleLabel}>{t('orderDetails.expectedDelivery.value')}</Text>
                  <Text style={styles.scheduleDate}>
                    {orderService.formatDateTime(order.expected_delivery_date)}
                  </Text>
                </View>
              </View>
            )}
            {order.pickup_completed_at && (
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIcon}>
                  <MaterialIcons name="check-circle" size={20} color={theme.colors.primary.main} />
                </View>
                <View style={styles.scheduleContent}>
                  <Text style={styles.scheduleLabel}>{t('orderDetails.actualPickup.value')}</Text>
                  <Text style={styles.scheduleDate}>
                    {orderService.formatDateTime(order.pickup_completed_at)}
                  </Text>
                </View>
              </View>
            )}
            {order.delivery_completed_at && (
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIcon}>
                  <MaterialIcons name="done-all" size={20} color={theme.colors.primary.main} />
                </View>
                <View style={styles.scheduleContent}>
                  <Text style={styles.scheduleLabel}>{t('orderDetails.delivered.value')}</Text>
                  <Text style={styles.scheduleDate}>
                    {orderService.formatDateTime(order.delivery_completed_at)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Payment Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('orderDetails.paymentInformation.value')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('orderDetails.paymentMode.value')}</Text>
              <Text style={styles.infoValue}>{order.payment_mode}</Text>
            </View>
            {order.order_amount && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('orderDetails.orderAmount.value')}:</Text>
                <Text style={[styles.infoValue, styles.amountText]}>{t('orderDetails.tbc.value')}</Text>
              </View>
            )}
            {order.cod_amount && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('orderDetails.codAmount.value')}:</Text>
                {/* <Text style={[styles.infoValue, styles.amountText]}>₹{order.cod_amount}</Text> */}
                <Text style={[styles.infoValue, styles.amountText]}>{t('orderDetails.tbc.value')}</Text>
              </View>
            )}
          </View>

          {/* Special Instructions */}
          {order.special_instructions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('orderDetails.specialInstructions.value')}</Text>
              <Text style={styles.instructionsText}>{order.special_instructions}</Text>
            </View>
          )}

          {/* Contact Information */}
          {(order.customer_phone || order.customer_email) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('orderDetails.contactInformation.value')}</Text>
              {order.customer_phone && (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => callPhone(order.customer_phone!)}
                >
                  <Feather name="phone" size={16} color={theme.colors.primary.main} />
                  <Text style={styles.contactLink}>{order.customer_phone}</Text>
                </TouchableOpacity>
              )}
              {order.customer_email && (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => sendEmail(order.customer_email!)}
                >
                  <Feather name="mail" size={16} color={theme.colors.primary.main} />
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
                <MaterialIcons name="cancel" size={20} color={theme.colors.text.inverse} />
                <Text style={styles.cancelOrderButtonText}>{t('orderDetails.cancelOrderButton.value')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: Spacing.xxxl }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default OrderDetailsScreen;