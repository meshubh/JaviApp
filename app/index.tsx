// App.tsx
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import providers and contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import screens
import HomeScreen from './components/HomeScreen/index';
import LoginScreen from './components/Login';

import CreateOrder from './components/CreateOrder/index';
import Profile from './components/Profile/index';
import ViewOrders from './components/ViewOrders/index';

// Import navigation components
import CustomDrawer from './components/CustomDrawer/index';

// Import types and theme
import { Colors } from './theme/colors';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

// Loading Screen Component
const LoadingScreen: React.FC = () => (
  <LinearGradient
    colors={Colors.gradients.main}
    style={styles.loadingContainer}
  >
    <ActivityIndicator size="large" color={Colors.primary.lavender} />
  </LinearGradient>
);

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
        overlayColor: Colors.ui.overlay,
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

// Main Navigation Component
const Navigation: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen
            name="Home"
            component={DrawerNavigator}
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
  );
};

// Main App Component
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" backgroundColor={Colors.gradients.main[0]} />
          <Navigation />
        </AuthProvider>
      </SafeAreaProvider>
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