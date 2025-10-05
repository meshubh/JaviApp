// app/components/Profile/index.tsx
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/OrderService';
import { ClientProfile, profileService } from '../../services/ProfileService';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import Addresses from '../Addresses/index';
import { CustomHeader } from '../CustomHeader';
import PasswordChangeDialog from '../PasswordChangeDialog/index';
import PersonalInformation from '../PersonalInformation/index';
import { useProfileStyles } from './profile.styles';

interface ProfileProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootStackParamList, 'Profile'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
}

interface ProfileOption {
  icon: keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap | keyof typeof Feather.glyphMap;
  iconFamily: 'material' | 'ionicons' | 'feather';
  title: string;
  subtitle?: string;
  value?: string;
  action?: 'navigate' | 'logout' | 'modal' | 'password' | 'language';
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
  const { t, i18n } = useTranslation();
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total_orders: 0,
    active_orders: 0,
    delivered_orders: 0,
  });
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<'personal' | 'addresses' | 'bankAccounts' | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const { theme } = useTheme();
  const styles = useProfileStyles(theme);

  useEffect(() => {
    fetchOrderStats();
    fetchProfile();
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

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const data = await profileService.getClientProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout.value'),
      t('profile.logoutConfirm.value'),
      [
        { text: t('common.cancel.value'), style: 'cancel' },
        { 
          text: t('profile.logout.value'), 
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleModalOpen = (component: 'personal' | 'addresses' | 'bankAccounts') => {
    setModalContent(component);
    setModalVisible(true);
  };

  const getLanguageDisplayName = () => {
    return i18n.language === 'hi' ? 'हिन्दी' : 'English';
  };

  const profileSections: { title: string; options: ProfileOption[] }[] = [
    {
      title: t('profile.account.value'),
      options: [
        {
          icon: 'person',
          iconFamily: 'material',
          title: t('profile.personalInfo.value'),
          subtitle: t('profile.personalInfoSubtitle.value'),
          action: 'modal',
          modalComponent: 'personal',
        },
        {
          icon: 'location-on',
          iconFamily: 'material',
          title: t('profile.addresses.value'),
          subtitle: t('profile.addressesSubtitle.value'),
          action: 'modal',
          modalComponent: 'addresses',
        },
        {
          icon: 'lock',
          iconFamily: 'material',
          title: t('profile.changePassword.value'),
          subtitle: t('profile.changePasswordSubtitle.value'),
          action: 'password',
        },
      ],
    },
    {
      title: t('profile.support.value'),
      options: [
        {
          icon: 'help-circle',
          iconFamily: 'feather',
          title: t('profile.helpCenter.value'),
          action: 'navigate',
        },
        {
          icon: 'message-circle',
          iconFamily: 'feather',
          title: t('profile.contactSupport.value'),
          subtitle: t('profile.contactSupportSubtitle.value'),
          action: 'navigate',
        },
        {
          icon: 'info',
          iconFamily: 'feather',
          title: t('profile.about.value'),
          action: 'navigate',
        },
        {
          icon: 'file-text',
          iconFamily: 'feather',
          title: t('profile.termsPrivacy.value'),
          action: 'navigate',
        },
      ],
    },
    {
      title: t('profile.actions.value'),
      options: [
        {
          icon: 'language',
          iconFamily: 'material',
          title: t('profile.chooseLanguage.value'),
          value: getLanguageDisplayName(),
          action: 'language',
        },
        {
          icon: 'log-out',
          iconFamily: 'feather',
          title: t('profile.logout.value'),
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
      case 'password':
        setShowPasswordDialog(true);
        break;
      case 'language':
        navigation.navigate('LanguageSelector' as any);
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
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalContent) {
      case 'personal':
        return t('profile.personalInfo.value');
      case 'addresses':
        return t('profile.addresses.value');
      default:
        return '';
    }
  };

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary.main} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <CustomHeader
          navigation={navigation}
          title={t('common.profile.value')}
          showBack={false}
          showMenu={false}
        />

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

            {/* Stats Row */}
            <View style={styles.statsRow}>
              {loadingStats ? (
                <ActivityIndicator size="small" color={theme.colors.primary.main} />
              ) : (
                <>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{orderStats.total_orders}</Text>
                    <Text style={styles.statLabel}>{t('profile.orders.value')}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{orderStats.active_orders}</Text>
                    <Text style={styles.statLabel}>{t('profile.active.value')}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{orderStats.delivered_orders}</Text>
                    <Text style={styles.statLabel}>{t('profile.completed.value')}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Account Statistics from Profile */}
            {!loadingProfile && profile && (
              <View style={styles.additionalStatsRow}>
                <View style={styles.statItem}>
                  <MaterialIcons name="payments" size={20} color={theme.colors.semantic.success} />
                  <Text style={styles.statNumber}>₹{profile.total_revenue || 0}</Text>
                  <Text style={styles.statLabel}>{t('profile.totalSpent.value')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <MaterialIcons name="calendar-today" size={20} color={theme.colors.primary.main} />
                  <Text style={styles.statNumber}>
                    {new Date(profile.onboarding_date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.statLabel}>{t('profile.memberSince.value')}</Text>
                </View>
              </View>
            )}
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
                    activeOpacity={0.7}
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
                      {option.value ? (
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

        {/* Password Change Dialog */}
        <PasswordChangeDialog
          visible={showPasswordDialog}
          onSuccess={() => {
            setShowPasswordDialog(false);
            Alert.alert(t('common.success.value'), t('profile.passwordChangeSuccess.value'));
          }}
          onCancel={() => setShowPasswordDialog(false)}
        />
      </SafeAreaView>
    </>
  );
};

export default Profile;