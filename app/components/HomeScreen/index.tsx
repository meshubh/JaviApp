import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardStats, orderService } from '../../services/OrderService';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import { CustomHeader } from '../CustomHeader';
import NotificationDropdown from '../NotificationDropdown/index';
import { useHomeStyles } from './home.styles';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface ActionCard {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  screen: keyof RootStackParamList;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = useHomeStyles(theme);
  const { t } = useTranslation();
  
  // State
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
  
  // Animation values
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const statsAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const notificationBadgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchDashboardStats();
    animateCards();
    animateNotificationBadge();
  }, []);

  const animateNotificationBadge = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(notificationBadgeScale, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(notificationBadgeScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchDashboardStats = async () => {
    try {
      setError(null);
      const stats = await orderService.getDashboardStats();
      setDashboardStats(stats);
      animateStats();
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  const animateCards = (): void => {
    const animations = cardAnimations.map((anim, index) => {
      return Animated.sequence([
        Animated.delay(index * 100),
        Animated.spring(anim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]);
    });
    Animated.parallel(animations).start();
  };

  const animateStats = (): void => {
    const animations = statsAnimations.map((anim, index) => {
      return Animated.sequence([
        Animated.delay(index * 150),
        Animated.spring(anim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]);
    });
    Animated.parallel(animations).start();
  };

  const handleNotificationItemPress = (orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const handleViewAllOrders = () => {
    navigation.navigate('ViewOrders');
  };

  const actionCards: ActionCard[] = [
    {
      title:  t('home.createOrder.value'),
      subtitle: 'Start a new order',
      icon: 'add-shopping-cart',
      iconColor: theme.colors.primary.main,
      backgroundColor: theme.colors.primary.light,
      screen: 'CreateOrder',
    },
    {
      title: t('home.viewOrders.value'),
      subtitle: 'View past orders',
      icon: 'receipt-long',
      iconColor: theme.colors.secondary.main,
      backgroundColor: theme.colors.secondary.light,
      screen: 'ViewOrders',
    },
    {
      title: t('home.profile.value'),
      subtitle: 'Account settings',
      icon: 'account-circle',
      iconColor: theme.colors.primary.dark,
      backgroundColor: theme.colors.background.tertiary,
      screen: 'Profile',
    },
  ];

  const formatDate = (): string => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return 'trending-up';
    if (trend < 0) return 'trending-down';
    return 'minus';
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return theme.colors.semantic.success;
    if (trend < 0) return theme.colors.semantic.error;
    return theme.colors.text.tertiary;
  };

  const formatTrend = (trend: number) => {
    if (trend > 0) return `+${trend.toFixed(1)}%`;
    if (trend < 0) return `${trend.toFixed(1)}%`;
    return '0%';
  };

  const hasNotifications = dashboardStats && dashboardStats.recent_activity.length > 0;

  const NotificationIcon = () => (
    <>
    <Ionicons name="notifications-outline" size={24} color="white" />
    {hasNotifications && (
      <Animated.View 
        style={[
          styles.notificationBadge,
          { transform: [{ scale: notificationBadgeScale }] }
        ]} 
      />
    )}
    </>
  );

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary.main} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <CustomHeader
          navigation={navigation as any}
          title="Javi Logistics"
          showMenu={false}
          rightComponent={
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => setNotificationDropdownVisible(true)}
            >
              <NotificationIcon />
            </TouchableOpacity>
          }
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary.main]}
            />
          }
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>{t('home.welcome.value')}</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('home.quickActions.value')}</Text>
            
            {actionCards.map((card, index) => (
              <Animated.View
                key={index}
                style={[
                  {
                    opacity: cardAnimations[index],
                    transform: [
                      {
                        translateY: cardAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                      {
                        scale: cardAnimations[index],
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => navigation.navigate(card.screen as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: card.backgroundColor }]}>
                    <MaterialIcons name={card.icon} size={28} color={card.iconColor} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={theme.colors.text.tertiary} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Stats Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Overview</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchDashboardStats} style={styles.retryButton}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : dashboardStats ? (
              <View style={styles.statsGrid}>
                <Animated.View
                  style={[
                    styles.statCard,
                    {
                      opacity: statsAnimations[0],
                      transform: [
                        {
                          scale: statsAnimations[0],
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.statNumber}>{dashboardStats.total_orders}</Text>
                  <Text style={styles.statLabel}>Total Orders</Text>
                  <View style={styles.statTrend}>
                    <Feather 
                      name={getTrendIcon(dashboardStats.orders_trend)} 
                      size={14} 
                      color={getTrendColor(dashboardStats.orders_trend)} 
                    />
                    <Text style={[styles.statTrendText, { color: getTrendColor(dashboardStats.orders_trend) }]}>
                      {formatTrend(dashboardStats.orders_trend)}
                    </Text>
                  </View>
                </Animated.View>
                
                <Animated.View
                  style={[
                    styles.statCard,
                    {
                      opacity: statsAnimations[1],
                      transform: [
                        {
                          scale: statsAnimations[1],
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.statNumber}>{dashboardStats.pending_orders}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                  <View style={styles.statTrend}>
                    <Feather name="clock" size={14} color={theme.colors.semantic.warning} />
                    <Text style={[styles.statTrendText, { color: theme.colors.semantic.warning }]}>
                      Active
                    </Text>
                  </View>
                </Animated.View>
              </View>
            ) : null}
          </View>

          {/* Quick Stats Row */}
          {dashboardStats && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Today's Summary</Text>
              <View style={styles.quickStatsRow}>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatValue}>{dashboardStats.today_orders}</Text>
                  <Text style={styles.quickStatLabel}>New Orders</Text>
                </View>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatValue}>{dashboardStats.in_transit_orders}</Text>
                  <Text style={styles.quickStatLabel}>In Transit</Text>
                </View>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatValue}>
                    {dashboardStats.insights.on_time_delivery_rate 
                      ? `${dashboardStats.insights.on_time_delivery_rate}%` 
                      : 'N/A'}
                  </Text>
                  <Text style={styles.quickStatLabel}>On Time</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Notification Dropdown Component */}
        <NotificationDropdown
          visible={notificationDropdownVisible}
          activities={dashboardStats?.recent_activity || []}
          onClose={() => setNotificationDropdownVisible(false)}
          onItemPress={handleNotificationItemPress}
          onViewAllPress={handleViewAllOrders}
        />
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;