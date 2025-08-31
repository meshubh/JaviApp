// App.tsx
import { createDrawerNavigator } from '@react-navigation/drawer';
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
import CustomDrawer from './app/components/CustomDrawer';
import HomeScreen from './app/components/HomeScreen';
import LoginScreen from './app/components/Login';
import OrderDetailsScreen from './app/components/OrderDetails';
import PasswordChangeDialog from './app/components/PasswordChangeDialog/index';
import Profile from './app/components/Profile';
import ViewOrders from './app/components/ViewOrders';
import { authService } from './app/services/AuthService';

// Import types and theme
import { ThemeProvider } from './app/theme/themeContext';
import { RootStackParamList } from './app/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

// Loading Screen Component
const LoadingScreen: React.FC = () => {
  // Temporarily use a hardcoded color until theme is loaded
  return (
    <LinearGradient
      colors={['#4A90E2', '#50E3C2']}
      style={styles.loadingContainer}
    >
      <ActivityIndicator size="large" color="#FFFFFF" />
    </LinearGradient>
  );
};

// Drawer Navigator Component
const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '75%',
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.5)',
        swipeEnabled: true,
        swipeEdgeWidth: 100,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="CreateOrder" component={CreateOrder} />
      <Drawer.Screen name="ViewOrders" component={ViewOrders} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
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
      
      // Mark password change as complete in local storage
      await authService.markPasswordChangeComplete();
      
      // Close the dialog
      setShowPasswordDialog(false);
      
      console.log('Password change flow completed successfully');
    } catch (error) {
      console.error('Error handling password change success:', error);
    }
  };

  const handlePasswordChangeCancel = async () => {
    console.log('User canceled password change');
    
    // For first login scenarios, user cannot proceed without changing password
    // So we'll force logout to maintain security
    try {
      await authService.logout();
      console.log('User logged out due to password change cancellation');
    } catch (error) {
      console.error('Error during forced logout:', error);
    }
    
    // The auth context will automatically redirect to login screen
    // when user is logged out
  };

  // Show loading screen while checking password requirement
  if (checkingPasswordRequirement) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={DrawerNavigator}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetailsScreen}
          options={{ 
            animation: 'slide_from_right'
          }}
        />
      </Stack.Navigator>
      
      {/* Password Change Dialog - Overlays the entire authenticated stack */}
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
});