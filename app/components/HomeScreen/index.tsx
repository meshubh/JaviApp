// app/components/HomeScreen/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, Typography, createShadow } from '../../theme';
import { RootStackParamList } from '../../types/navigation';

interface HomeScreenProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'Home'>;
}

import type { ColorValue } from 'react-native';

interface ActionCard {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
  iconColor: string;
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
        Animated.delay(index * 150),
        Animated.spring(anim, {
          toValue: 1,
          friction: 5,
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
      icon: 'add-circle',
      gradient: Colors.gradients.card1,
      iconColor: '#FF69B4',
      screen: 'CreateOrder',
    },
    {
      title: 'Past Orders',
      subtitle: 'View order history',
      icon: 'receipt-long',
      gradient: Colors.gradients.card2,
      iconColor: '#8B7AB8',
      screen: 'ViewOrders',
    },
    {
      title: 'My Profile',
      subtitle: 'Manage your account',
      icon: 'account-circle',
      gradient: Colors.gradients.card3,
      iconColor: '#5F9EA0',
      screen: 'Profile',
    },
  ];

  const formatDate = (): string => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.main}
        style={styles.mainContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.menuButton}
          >
            <View style={styles.menuIconContainer}>
              <Feather name="menu" size={24} color={Colors.text.primary} />
            </View>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Home</Text>

          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationIconContainer}>
              <Feather name="bell" size={22} color={Colors.text.primary} />
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'User'} 👋</Text>
          <Text style={styles.dateText}>{formatDate()}</Text>
        </View>

        {/* Action Cards */}
        <ScrollView
          style={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardsContent}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          {actionCards.map((card, index) => (
            <Animated.View
              key={index}
              style={[
                styles.cardWrapper,
                {
                  opacity: cardAnimations[index],
                  transform: [
                    {
                      translateY: cardAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                    {
                      scale: cardAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate(card.screen)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={card.gradient}
                  style={styles.actionCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                      <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                    </View>
                    <View style={[styles.cardIconContainer, { backgroundColor: card.iconColor + '20' }]}>
                      <MaterialIcons name={card.icon} size={32} color={card.iconColor} />
                    </View>
                  </View>
                  <View style={styles.cardArrow}>
                    <Feather name="arrow-right" size={20} color={card.iconColor} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>9</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gradients.main[0],
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  menuIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: Colors.ui.backgroundOpacity,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...createShadow(5),
  },
  headerTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  notificationButton: {
    padding: Spacing.xs,
  },
  notificationIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: Colors.ui.backgroundOpacity,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...createShadow(5),
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    backgroundColor: Colors.text.error,
    borderRadius: 4,
  },
  welcomeSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  welcomeText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.regular,
  },
  userName: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  dateText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.lavender,
    marginTop: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  cardsContainer: {
    flex: 1,
  },
  cardsContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    marginLeft: Spacing.xs,
  },
  cardWrapper: {
    marginBottom: Spacing.lg,
  },
  actionCard: {
    borderRadius: 20,
    padding: Spacing.xl,
    ...createShadow(8),
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: Typography.fontWeight.medium,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardArrow: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
  },
  statsSection: {
    marginTop: Spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.ui.backgroundOpacity,
    borderRadius: 15,
    padding: Spacing.lg,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    ...createShadow(3),
  },
  statNumber: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default HomeScreen;