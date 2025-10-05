// // app/components/CustomDrawer.tsx
// import { Feather } from '@expo/vector-icons';
// import {
//   DrawerContentComponentProps
// } from '@react-navigation/drawer';
// import React from 'react';
// import {
//   Alert,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { useAuth } from '../../contexts/AuthContext';
// import { useTheme } from '../../theme/themeContext';
// import { RootStackParamList } from '../../types/navigation';
// import { useCustomDrawerStyles } from './customDrawer.styles';

// interface MenuItem {
//   title: string;
//   icon: keyof typeof Feather.glyphMap;
//   screen: keyof RootStackParamList;
// }

// const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
//   const { user, logout } = useAuth();

//   const { theme } = useTheme();
//   const styles = useCustomDrawerStyles(theme);

//   const menuItems: MenuItem[] = [
//     { title: 'Home', icon: 'home', screen: 'Home' },
//     { title: 'Create Order', icon: 'plus-square', screen: 'CreateOrder' },
//     { title: 'My Orders', icon: 'list', screen: 'ViewOrders' },
//     { title: 'Profile', icon: 'user', screen: 'Profile' },
//   ];

//   const handleLogout = (): void => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Logout', 
//           style: 'destructive',
//           onPress: async () => {
//             await logout();
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.profileContainer}>
//           <View style={styles.profileImage}>
//             <Feather name="user" size={40} color={theme.colors.text.inverse} />
//           </View>
//           <View style={styles.profileInfo}>
//             <Text style={styles.userName}>{user?.name || 'User'}</Text>
//             <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Menu Items */}
//       <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
//         {menuItems.map((item, index) => {
//           const isFocused = props.state.index === index;
          
//           return (
//             <TouchableOpacity
//               key={index}
//               style={[
//                 styles.menuItem,
//                 isFocused && styles.menuItemActive,
//               ]}
//               onPress={() => props.navigation.navigate(item.screen)}
//             >
//               <Feather 
//                 name={item.icon} 
//                 size={20} 
//                 color={isFocused ? theme.colors.primary.main : theme.colors.text. secondary} 
//               />
//               <Text style={[
//                 styles.menuItemText,
//                 isFocused && styles.menuItemTextActive,
//               ]}>
//                 {item.title}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}

//         {/* Divider */}
//         <View style={styles.divider} />

//         {/* Settings Section */}
//         <TouchableOpacity style={styles.menuItem}>
//           <Feather name="settings" size={20} color={theme.colors.text. secondary} />
//           <Text style={styles.menuItemText}>Settings</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Feather name="help-circle" size={20} color={theme.colors.text. secondary} />
//           <Text style={styles.menuItemText}>Help & Support</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Feather name="info" size={20} color={theme.colors.text. secondary} />
//           <Text style={styles.menuItemText}>About</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Feather name="log-out" size={20} color={theme.colors.semantic.error} />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CustomDrawer;