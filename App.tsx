// App.tsx
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import providers and contexts
import { AuthProvider, useAuth } from './app/contexts/AuthContext';

// Import screens
import CreateOrder from './app/components/CreateOrder';
import LoginScreen from './app/components/Login';
import OrderDetailsScreen from './app/components/OrderDetails';
import PasswordChangeDialog from './app/components/PasswordChangeDialog/index';
import Profile from './app/components/Profile';
import ViewOrders from './app/components/ViewOrders';
import { authService } from './app/services/AuthService';

// Import types and theme
import { ThemeProvider, useTheme } from './app/theme/themeContext';
import { RootStackParamList } from './app/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Loading Screen Component
const LoadingScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#4A90E2', '#50E3C2']}
      style={styles.loadingContainer}
    >
      <ActivityIndicator size="large" color="#FFFFFF" />
    </LinearGradient>
  );
};

// Placeholder screens for Coins and Payments
const CoinsScreen: React.FC = () => {
  const { theme } = useTheme();
  return (
    <LinearGradient colors={[theme.colors.primary.main, theme.colors.secondary.main]} style={styles.placeholderContainer}>
      <Ionicons name="wallet-outline" size={60} color="white" />
      <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
    </LinearGradient>
  );
};

const PaymentsScreen: React.FC = () => {
  const { theme } = useTheme();
  return (
    <LinearGradient colors={[theme.colors.primary.main, theme.colors.secondary.main]} style={styles.placeholderContainer}>
      <Ionicons name="card-outline" size={60} color="white" />
      <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
    </LinearGradient>
  );
};

// Bottom Tab Navigator Component
const BottomTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | keyof typeof MaterialIcons.glyphMap;
          
          if (route.name === 'Home') {
            iconName = 'home';
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
          } else if (route.name === 'ViewOrders') {
            return <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.primary,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={CreateOrder}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="ViewOrders" 
        component={ViewOrders}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ tabBarLabel: 'Account' }}
      />
    </Tab.Navigator>
  );
};

// Authenticated Stack Navigator with Password Change Dialog
const AuthenticatedNavigator: React.FC = () => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [checkingPasswordRequirement, setCheckingPasswordRequirement] = useState(true);

  useEffect(() => {
    checkPasswordChangeRequirement();
  }, []);

  const checkPasswordChangeRequirement = async () => {
    try {
      console.log('Checking if password change is required...');
      const requiresChange = await authService.requiresPasswordChange();
      console.log('Password change required:', requiresChange);
      
      if (requiresChange) {
        setShowPasswordDialog(true);
      }
    } catch (error) {
      console.error('Error checking password change requirement:', error);
    } finally {
      setCheckingPasswordRequirement(false);
    }
  };

  const handlePasswordChangeSuccess = async () => {
    try {
      console.log('Password change successful, updating local storage...');
      await authService.markPasswordChangeComplete();
      setShowPasswordDialog(false);
      console.log('Password change flow completed successfully');
    } catch (error) {
      console.error('Error handling password change success:', error);
    }
  };

  const handlePasswordChangeCancel = async () => {
    console.log('User canceled password change');
    try {
      await authService.logout();
      console.log('User logged out due to password change cancellation');
    } catch (error) {
      console.error('Error during forced logout:', error);
    }
  };

  if (checkingPasswordRequirement) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="CreateOrder"
          component={CreateOrder}
          options={{ 
            animation: 'slide_from_bottom',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetailsScreen}
          options={{ 
            animation: 'slide_from_right'
          }}
        />
      </Stack.Navigator>
      
      <PasswordChangeDialog
        visible={showPasswordDialog}
        onSuccess={handlePasswordChangeSuccess}
        onCancel={handlePasswordChangeCancel}
      />
    </>
  );
};

// Main Navigation Component
const Navigation: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log('User authentication status:', user ? 'Logged in' : 'Not logged in');

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen
            name="Home"
            component={AuthenticatedNavigator}
            options={{ animation: 'fade' }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animation: 'slide_from_right' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main App Component
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <StatusBar style="dark" />
            <Navigation />
          </AuthProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});