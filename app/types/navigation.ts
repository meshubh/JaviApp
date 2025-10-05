// app/types/navigation.ts
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  CreateOrder: undefined;
  ViewOrders: {
    orderId?: string;
  } | undefined;
  OrderDetails: {
    orderId: string;
  };
  Profile: undefined;
  Settings: undefined;
  Login: undefined;
  LanguageSelector: undefined;
  Register: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;