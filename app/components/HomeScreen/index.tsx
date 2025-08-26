import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import { useHomeStyles } from './home.styles';

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
  const { theme } = useTheme();
  const styles = useHomeStyles(theme);
  
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
      iconColor: theme.colors.primary.main,
      backgroundColor: theme.colors.primary.light,
      screen: 'CreateOrder',
    },
    {
      title: 'Order History',
      subtitle: 'View past orders',
      icon: 'receipt-long',
      iconColor: theme.colors.secondary.main,
      backgroundColor: theme.colors.secondary.light,
      screen: 'ViewOrders',
    },
    {
      title: 'My Profile',
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

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary.main} barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()} 
              style={styles.menuButton}
            >
              <Feather name="menu" size={24} color={theme.colors.text.onPrimary} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Javi Logistics</Text>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerActionButton}>
                <Feather name="search" size={22} color={theme.colors.text.onPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton}>
                <Ionicons name="notifications-outline" size={22} color={theme.colors.text.onPrimary} />
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
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
                <View style={styles.statTrend}>
                  <Feather name="trending-up" size={14} color={theme.colors.semantic.success} />
                  <Text style={styles.statTrendText}>+15%</Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Pending</Text>
                <View style={styles.statTrend}>
                  <Feather name="clock" size={14} color={theme.colors.semantic.warning} />
                  <Text style={[styles.statTrendText, { color: theme.colors.semantic.warning }]}>
                    Active
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Feather name="package" size={16} color={theme.colors.semantic.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Order #1234 delivered</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Feather name="truck" size={16} color={theme.colors.semantic.warning} />
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

export default HomeScreen;