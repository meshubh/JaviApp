// app/components/CustomDrawer/index.tsx
import { Feather } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, Typography } from '../../theme/index';
import { RootStackParamList } from '../../types/navigation';

interface MenuItem {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  screen: keyof RootStackParamList;
}

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
    { title: 'Home', icon: 'home', screen: 'Home' },
    { title: 'Create Order', icon: 'plus-circle', screen: 'CreateOrder' },
    { title: 'View Orders', icon: 'list', screen: 'ViewOrders' },
    { title: 'Profile', icon: 'user', screen: 'Profile' },
  ];

  const handleLogout = (): void => {
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

  return (
    <LinearGradient
      colors={Colors.gradients.drawer}
      style={styles.container}
    >
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <LinearGradient
            colors={Colors.gradients.profile}
            style={styles.profileCircle}
          >
            <Feather name="user" size={40} color={Colors.text.white} />
          </LinearGradient>
          <Text style={styles.drawerUserName}>{user?.name || 'User'}</Text>
          <Text style={styles.drawerUserEmail}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuItemsContainer}>
          {menuItems.map((item, index) => {
            const isFocused = props.state.index === index;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  isFocused && styles.menuItemActive,
                ]}
                onPress={() => props.navigation.navigate(item.screen)}
              >
                <View style={[
                  styles.menuItemIcon,
                  isFocused && styles.menuItemIconActive,
                ]}>
                  <Feather
                    name={item.icon}
                    size={22}
                    color={isFocused ? Colors.text.white : Colors.text.primary}
                  />
                </View>
                <Text style={[
                  styles.menuItemText,
                  isFocused && styles.menuItemTextActive,
                ]}>
                  {item.title}
                </Text>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={isFocused ? Colors.text.white : Colors.text.light}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Drawer Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={Colors.text.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    padding: Spacing.xxl,
    paddingTop: Spacing.xxxl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  drawerUserName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  drawerUserEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.regular,
  },
  menuItemsContainer: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    borderRadius: 12,
  },
  menuItemActive: {
    backgroundColor: Colors.primary.lavender,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(177, 156, 217, 0.1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuItemIconActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItemText: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
  },
  menuItemTextActive: {
    color: Colors.text.white,
  },
  drawerFooter: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.error,
    marginLeft: Spacing.sm,
  },
});

export default CustomDrawer;
