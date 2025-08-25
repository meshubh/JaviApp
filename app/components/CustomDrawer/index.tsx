// app/components/CustomDrawer.tsx
import { Feather } from '@expo/vector-icons';
import {
  DrawerContentComponentProps
} from '@react-navigation/drawer';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
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
    { title: 'Create Order', icon: 'plus-square', screen: 'CreateOrder' },
    { title: 'My Orders', icon: 'list', screen: 'ViewOrders' },
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImage}>
            <Feather name="user" size={40} color={Colors.text.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
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
              <Feather 
                name={item.icon} 
                size={20} 
                color={isFocused ? Colors.primary.green : Colors.text.secondary} 
              />
              <Text style={[
                styles.menuItemText,
                isFocused && styles.menuItemTextActive,
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Settings Section */}
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="settings" size={20} color={Colors.text.secondary} />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="help-circle" size={20} color={Colors.text.secondary} />
          <Text style={styles.menuItemText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="info" size={20} color={Colors.text.secondary} />
          <Text style={styles.menuItemText}>About</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={Colors.text.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    backgroundColor: Colors.primary.teal,
    paddingTop: 50,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.white,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuContainer: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  menuItemActive: {
    backgroundColor: Colors.background.secondary,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.green,
  },
  menuItemText: {
    flex: 1,
    marginLeft: Spacing.lg,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
  },
  menuItemTextActive: {
    color: Colors.primary.green,
    fontWeight: Typography.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.ui.divider,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.ui.divider,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  logoutText: {
    marginLeft: Spacing.lg,
    fontSize: Typography.fontSize.md,
    color: Colors.text.error,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default CustomDrawer;