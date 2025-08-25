// app/HomeScreen/index.tsx
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { BorderRadius, Colors, createElevation, Spacing, Typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation';

interface HomeScreenProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'Home'>;
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
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    animateCards();
  }, []);

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

  const actionCards: ActionCard[] = [
    {
      title: 'Create Order',
      subtitle: 'Start a new order',
      icon: 'add-shopping-cart',
      iconColor: Colors.primary.green,
      backgroundColor: '#E8F5E9',
      screen: 'CreateOrder',
    },
    {
      title: 'Order History',
      subtitle: 'View past orders',
      icon: 'receipt-long',
      iconColor: Colors.primary.darkGreen,
      backgroundColor: '#E0F2F1',
      screen: 'ViewOrders',
    },
    {
      title: 'My Profile',
      subtitle: 'Account settings',
      icon: 'account-circle',
      iconColor: Colors.primary.teal,
      backgroundColor: '#E3F2FD',
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

  return (
    <>
      <StatusBar backgroundColor={Colors.primary.teal} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()} 
              style={styles.menuButton}
            >
              <Feather name="menu" size={24} color={Colors.text.white} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>JaviApp</Text>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerActionButton}>
                <Feather name="search" size={22} color={Colors.text.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton}>
                <Ionicons name="notifications-outline" size={22} color={Colors.text.white} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
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
                  onPress={() => navigation.navigate(card.screen)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: card.backgroundColor }]}>
                    <MaterialIcons name={card.icon} size={28} color={card.iconColor} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={Colors.text.tertiary} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Stats Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
                <View style={styles.statTrend}>
                  <Feather name="trending-up" size={14} color={Colors.primary.green} />
                  <Text style={styles.statTrendText}>+15%</Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Pending</Text>
                <View style={styles.statTrend}>
                  <Feather name="clock" size={14} color={Colors.text.warning} />
                  <Text style={[styles.statTrendText, { color: Colors.text.warning }]}>Active</Text>
                </View>
              </View>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>9</Text>
                <Text style={styles.statLabel}>Completed</Text>
                <View style={styles.statTrend}>
                  <Feather name="check-circle" size={14} color={Colors.primary.green} />
                  <Text style={styles.statTrendText}>Done</Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>$1,234</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
                <View style={styles.statTrend}>
                  <Feather name="dollar-sign" size={14} color={Colors.primary.green} />
                  <Text style={styles.statTrendText}>This month</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Feather name="package" size={16} color={Colors.primary.green} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Order #1234 delivered</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Feather name="truck" size={16} color={Colors.text.warning} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Order #1235 shipped</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
          </View>
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
  menuButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.white,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.error,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  welcomeSection: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  welcomeText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
  },
  userName: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  dateText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  sectionContainer: {
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.xs,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    ...createElevation(1),
  },
  statNumber: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTrendText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary.green,
    marginLeft: Spacing.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
});

export default HomeScreen;