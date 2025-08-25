// app/Profile/index.tsx
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { BorderRadius, Colors, createElevation, Spacing, Typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation';

interface ProfileScreenProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'Profile'>;
}

interface ProfileOption {
  icon: keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap | keyof typeof Feather.glyphMap;
  iconFamily: 'material' | 'ionicons' | 'feather';
  title: string;
  subtitle?: string;
  value?: string;
  action?: 'navigate' | 'toggle' | 'logout';
  hasToggle?: boolean;
  isDanger?: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const profileSections: { title: string; options: ProfileOption[] }[] = [
    {
      title: 'Account',
      options: [
        {
          icon: 'person',
          iconFamily: 'material',
          title: 'Personal Information',
          subtitle: 'Name, email, phone',
          action: 'navigate',
        },
        {
          icon: 'location-on',
          iconFamily: 'material',
          title: 'Addresses',
          subtitle: 'Manage delivery addresses',
          action: 'navigate',
        },
        {
          icon: 'payment',
          iconFamily: 'material',
          title: 'Payment Methods',
          subtitle: 'Cards and payment options',
          action: 'navigate',
        },
      ],
    },
    {
      title: 'Preferences',
      options: [
        {
          icon: 'notifications',
          iconFamily: 'material',
          title: 'Push Notifications',
          hasToggle: true,
          action: 'toggle',
        },
        {
          icon: 'moon',
          iconFamily: 'ionicons',
          title: 'Dark Mode',
          hasToggle: true,
          action: 'toggle',
        },
        {
          icon: 'language',
          iconFamily: 'material',
          title: 'Language',
          value: 'English',
          action: 'navigate',
        },
      ],
    },
    {
      title: 'Support',
      options: [
        {
          icon: 'help-circle',
          iconFamily: 'feather',
          title: 'Help Center',
          action: 'navigate',
        },
        {
          icon: 'message-circle',
          iconFamily: 'feather',
          title: 'Contact Support',
          subtitle: 'Get help from our team',
          action: 'navigate',
        },
        {
          icon: 'info',
          iconFamily: 'feather',
          title: 'About',
          action: 'navigate',
        },
        {
          icon: 'file-text',
          iconFamily: 'feather',
          title: 'Terms & Privacy',
          action: 'navigate',
        },
      ],
    },
    {
      title: 'Actions',
      options: [
        {
          icon: 'log-out',
          iconFamily: 'feather',
          title: 'Logout',
          isDanger: true,
          action: 'logout',
        },
      ],
    },
  ];

  const renderIcon = (option: ProfileOption) => {
    const iconColor = option.isDanger ? Colors.text.error : Colors.text.secondary;
    const iconSize = 22;

    switch (option.iconFamily) {
      case 'material':
        return <MaterialIcons name={option.icon as any} size={iconSize} color={iconColor} />;
      case 'ionicons':
        return <Ionicons name={option.icon as any} size={iconSize} color={iconColor} />;
      case 'feather':
        return <Feather name={option.icon as any} size={iconSize} color={iconColor} />;
      default:
        return <MaterialIcons name={option.icon as any} size={iconSize} color={iconColor} />;
    }
  };

  const handleOptionPress = (option: ProfileOption) => {
    switch (option.action) {
      case 'logout':
        handleLogout();
        break;
      case 'navigate':
        Alert.alert(option.title, `${option.title} feature coming soon!`);
        break;
      default:
        break;
    }
  };

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
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Feather name="menu" size={24} color={Colors.text.white} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Feather name="user" size={50} color={Colors.text.white} />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <MaterialIcons name="camera-alt" size={18} color={Colors.text.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Feather name="edit-2" size={16} color={Colors.primary.green} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
          </View>

          {/* Profile Options */}
          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.options.map((option, optionIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
                    style={[
                      styles.optionItem,
                      optionIndex === section.options.length - 1 && styles.lastOption,
                    ]}
                    onPress={() => handleOptionPress(option)}
                    activeOpacity={option.hasToggle ? 1 : 0.7}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[
                        styles.iconContainer,
                        option.isDanger && styles.iconContainerDanger,
                      ]}>
                        {renderIcon(option)}
                      </View>
                      <View style={styles.optionContent}>
                        <Text style={[
                          styles.optionTitle,
                          option.isDanger && styles.optionTitleDanger,
                        ]}>
                          {option.title}
                        </Text>
                        {option.subtitle && (
                          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.optionRight}>
                      {option.hasToggle ? (
                        <Switch
                          value={option.title === 'Push Notifications' ? notifications : darkMode}
                          onValueChange={(value) => {
                            if (option.title === 'Push Notifications') {
                              setNotifications(value);
                            } else if (option.title === 'Dark Mode') {
                              setDarkMode(value);
                            }
                          }}
                          trackColor={{ 
                            false: Colors.ui.border, 
                            true: Colors.primary.green + '50' 
                          }}
                          thumbColor={
                            (option.title === 'Push Notifications' ? notifications : darkMode)
                              ? Colors.primary.green
                              : Colors.background.primary
                          }
                        />
                      ) : option.value ? (
                        <Text style={styles.optionValue}>{option.value}</Text>
                      ) : !option.isDanger ? (
                        <Feather name="chevron-right" size={20} color={Colors.text.tertiary} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>JaviApp Version 1.0.0</Text>
            <Text style={styles.copyrightText}>© 2024 JaviApp. All rights reserved.</Text>
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
  backButton: {
    padding: Spacing.xs,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  profileHeader: {
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary.teal,
    justifyContent: 'center',
    alignItems: 'center',
    ...createElevation(2),
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.primary,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary.green,
    marginBottom: Spacing.xl,
  },
  editButtonText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.green,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.ui.divider,
  },
  section: {
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
  },
  sectionContent: {
    backgroundColor: Colors.background.primary,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  iconContainerDanger: {
    backgroundColor: Colors.text.error + '10',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  optionTitleDanger: {
    color: Colors.text.error,
  },
  optionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginTop: Spacing.xl,
  },
  versionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  copyrightText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
});

export default ProfileScreen;