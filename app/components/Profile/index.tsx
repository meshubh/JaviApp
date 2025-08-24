// app/components/Profile/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, Typography, createShadow } from '../../theme';
import { RootStackParamList } from '../../types/navigation';

interface ProfileProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'Profile'>;
}

interface ProfileOption {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  iconColor: string;
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const profileOptions: ProfileOption[] = [
    {
      icon: 'person',
      title: 'Personal Information',
      subtitle: 'Update your personal details',
      iconColor: Colors.primary.lavender,
    },
    {
      icon: 'location-on',
      title: 'Delivery Addresses',
      subtitle: 'Manage your addresses',
      iconColor: Colors.primary.pink,
    },
    {
      icon: 'payment',
      title: 'Payment Methods',
      subtitle: 'Add or remove payment methods',
      iconColor: Colors.primary.plum,
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      subtitle: 'Configure notification preferences',
      iconColor: '#87CEEB',
    },
    {
      icon: 'security',
      title: 'Security',
      subtitle: 'Password and authentication',
      iconColor: Colors.primary.mint,
    },
    {
      icon: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      iconColor: Colors.primary.peach,
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.main}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Feather name="menu" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={Colors.gradients.profile}
              style={styles.avatarGradient}
            >
              <Feather name="user" size={50} color={Colors.text.white} />
            </LinearGradient>
            <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

            <TouchableOpacity style={styles.editButton}>
              <LinearGradient
                colors={Colors.gradients.button}
                style={styles.editGradient}
              >
                <Feather name="edit-2" size={16} color={Colors.text.white} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Profile Options */}
          <View style={styles.optionsContainer}>
            {profileOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionCard}
                activeOpacity={0.8}
              >
                <View style={[styles.optionIcon, { backgroundColor: option.iconColor + '20' }]}>
                  <MaterialIcons name={option.icon} size={24} color={option.iconColor} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={Colors.text.light} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={20} color={Colors.text.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  gradient: {
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
  backButton: {
    padding: Spacing.xs,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  // ProfileScreen specific styles
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.ui.backgroundOpacity,
    borderRadius: 20,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    ...createShadow(5),
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...createShadow(8),
  },
  userName: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  editButton: {
    marginTop: Spacing.sm,
  },
  editGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    ...createShadow(5),
  },
  editButtonText: {
    color: Colors.text.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    marginLeft: Spacing.xs,
  },
  optionsContainer: {
    marginBottom: Spacing.xl,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ui.backgroundOpacity,
    borderRadius: 15,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...createShadow(2),
  },
  optionIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 15,
    marginBottom: Spacing.xxl,
    ...createShadow(3),
  },
  logoutText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.error,
    marginLeft: Spacing.sm,
  },
  })

export default Profile