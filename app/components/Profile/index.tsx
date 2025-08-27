// app/screens/Profile/index.tsx
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/OrderService';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import Addresses from '../Addresses/index';
import BankAccounts from '../BankAccounts/index';
import PersonalInformation from '../PersonalInformation/index';
import { useProfileStyles } from './profile.styles';

interface ProfileProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'Profile'>;
}

interface ProfileOption {
  icon: keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap | keyof typeof Feather.glyphMap;
  iconFamily: 'material' | 'ionicons' | 'feather';
  title: string;
  subtitle?: string;
  value?: string;
  action?: 'navigate' | 'toggle' | 'logout' | 'modal';
  hasToggle?: boolean;
  isDanger?: boolean;
  modalComponent?: 'personal' | 'addresses' | 'bankAccounts';
}

interface OrderStats {
  total_orders: number;
  active_orders: number;
  delivered_orders: number;
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total_orders: 0,
    active_orders: 0,
    delivered_orders: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<'personal' | 'addresses' | 'bankAccounts' | null>(null);

  const { theme } = useTheme();
  const styles = useProfileStyles(theme);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      setLoadingStats(true);
      const stats = await orderService.getOrderStats();
      setOrderStats({
        total_orders: stats.total_orders,
        active_orders: stats.active_orders,
        delivered_orders: stats.delivered_orders,
      });
    } catch (error) {
      console.error('Failed to fetch order stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

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
    setModalContent('personal');
    setModalVisible(true);
  };

  const handleModalOpen = (component: 'personal' | 'addresses' | 'bankAccounts') => {
    setModalContent(component);
    setModalVisible(true);
  };

  const profileSections: { title: string; options: ProfileOption[] }[] = [
    {
      title: 'Account',
      options: [
        {
          icon: 'person',
          iconFamily: 'material',
          title: 'Personal Information',
          subtitle: 'Name, email, phone, GST',
          action: 'modal',
          modalComponent: 'personal',
        },
        {
          icon: 'location-on',
          iconFamily: 'material',
          title: 'Addresses',
          subtitle: 'Manage delivery addresses',
          action: 'modal',
          modalComponent: 'addresses',
        },
        {
          icon: 'account-balance',
          iconFamily: 'material',
          title: 'Bank Accounts',
          subtitle: 'Manage bank accounts',
          action: 'modal',
          modalComponent: 'bankAccounts',
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
    const iconColor = option.isDanger ? theme.colors.semantic.error : theme.colors.text.secondary;
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
      case 'modal':
        if (option.modalComponent) {
          handleModalOpen(option.modalComponent);
        }
        break;
      case 'navigate':
        Alert.alert(option.title, `${option.title} feature coming soon!`);
        break;
      default:
        break;
    }
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case 'personal':
        return <PersonalInformation />;
      case 'addresses':
        return <Addresses />;
      case 'bankAccounts':
        return <BankAccounts />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalContent) {
      case 'personal':
        return 'Personal Information';
      case 'addresses':
        return 'Addresses';
      case 'bankAccounts':
        return 'Bank Accounts';
      default:
        return '';
    }
  };

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary.main} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={theme.colors.text.onPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Feather name="menu" size={24} color={theme.colors.text.onPrimary} />
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
                <Feather name="user" size={50} color={theme.colors.text.onPrimary} />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <MaterialIcons name="camera-alt" size={18} color={theme.colors.text.onPrimary} />
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
              {loadingStats ? (
                <ActivityIndicator size="small" color={theme.colors.primary.main} />
              ) : (
                <>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{orderStats.total_orders}</Text>
                    <Text style={styles.statLabel}>Orders</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{orderStats.active_orders}</Text>
                    <Text style={styles.statLabel}>Active</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{orderStats.delivered_orders}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                </>
              )}
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
                        <Feather name="chevron-right" size={20} color={theme.colors.text.tertiary} />
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
            <Text style={styles.copyrightText}>© 2024 Javi Logistics. All rights reserved.</Text>
          </View>
        </ScrollView>

        {/* Component Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBackButton}>
                <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <View style={{ width: 24 }} />
            </View>
            {renderModalContent()}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default Profile;