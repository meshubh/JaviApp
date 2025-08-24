// app/types/navigation.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CreateOrder: undefined;
  ViewOrders: undefined;
  Profile: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;