// app/Profile/index.tsx
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../theme';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import { useProfileStyles } from './profile.styles';

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

  const { theme } = useTheme();
  const styles = useProfileStyles(theme);

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
    const iconColor = option.isDanger ? theme.colors.semantic.error : theme.colors.text. secondary;
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
      <StatusBar backgroundColor={theme.colors.secondary.main} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={theme.colors.text.inverse} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Feather name="menu" size={24} color={theme.colors.text.inverse} />
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
                <Feather name="user" size={50} color={theme.colors.text.inverse} />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <MaterialIcons name="camera-alt" size={18} color={theme.colors.text.inverse} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Feather name="edit-2" size={16} color={theme.colors.primary.main} />
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
                            false: theme.colors.border.primary, 
                            true: theme.colors.primary.main + '50' 
                          }}
                          thumbColor={
                            (option.title === 'Push Notifications' ? notifications : darkMode)
                              ? theme.colors.primary.main
                              : theme.colors.background.primary
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

export default ProfileScreen;