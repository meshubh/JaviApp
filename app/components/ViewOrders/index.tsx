// app/components/ViewOrders/index.tsx
import { Feather } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Spacing, Typography, createShadow } from '../../theme';
import { Order } from '../../types';
import { RootStackParamList } from '../../types/navigation';

interface ViewOrdersProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'ViewOrders'>;
}

const ViewOrders: React.FC<ViewOrdersProps> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Processing' | 'Delivered'>('All');

  const sampleOrders: Order[] = [
    { id: '1', date: '2024-01-20', status: 'Delivered', amount: '$125.00' },
    { id: '2', date: '2024-01-18', status: 'In Transit', amount: '$87.50' },
    { id: '3', date: '2024-01-15', status: 'Processing', amount: '$234.00' },
    { id: '4', date: '2024-01-12', status: 'Delivered', amount: '$56.25' },
    { id: '5', date: '2024-01-10', status: 'Processing', amount: '$189.99' },
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return Colors.text.success;
      case 'In Transit':
        return Colors.text.warning;
      case 'Processing':
        return Colors.primary.pink;
      case 'Cancelled':
        return Colors.text.error;
      default:
        return Colors.text.secondary;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.8}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderAmount}>{item.amount}</Text>
        <Feather name="chevron-right" size={20} color={Colors.text.light} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.main}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Feather name="menu" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {(['All', 'Processing', 'Delivered'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Orders List */}
        <FlatList
          data={sampleOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gradients.main[0],
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  // ViewOrdersScreen specific styles
  filterContainer: {
    maxHeight: 50,
    marginVertical: Spacing.md,
  },
  filterContent: {
    paddingHorizontal: Spacing.lg,
  },
  filterTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.ui.backgroundOpacity,
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary.lavender,
    borderColor: Colors.primary.lavender,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
  },
  filterTextActive: {
    color: Colors.text.white,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  orderCard: {
    backgroundColor: Colors.ui.backgroundOpacity,
    borderRadius: 15,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...createShadow(3),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  orderId: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
});

export default ViewOrders