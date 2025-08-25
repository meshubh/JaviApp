// app/types/navigation.ts
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
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
  Register: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;