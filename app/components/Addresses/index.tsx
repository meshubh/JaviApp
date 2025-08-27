// app/screens/Addresses/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Address,
  CreateAddressData,
  profileService
} from '../../services/ProfileService';
import { useTheme } from '../../theme/themeContext';
import { useAddressesStyles } from './addresses.styles';

const Addresses: React.FC = () => {
  const { theme } = useTheme();
  const styles = useAddressesStyles(theme);
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<CreateAddressData>({
    address_type: 'Pickup',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    landmark: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await profileService.getClientAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      address_type: 'Pickup',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      landmark: '',
      is_active: true,
    });
    setModalVisible(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      address_type: address.address_type,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country || 'India',
      landmark: address.landmark || '',
      is_active: address.is_active,
      firm_name: address.firm_name,
      gst_number: address.gst_number,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.address_line_1 || !formData.city || !formData.state || !formData.postal_code) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      if (editingAddress) {
        await profileService.updateAddress(editingAddress.id, formData);
        Alert.alert('Success', 'Address updated successfully');
      } else {
        await profileService.createAddress(formData);
        Alert.alert('Success', 'Address added successfully');
      }
      setModalVisible(false);
      fetchAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
      Alert.alert('Error', 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (address: Address) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await profileService.deleteAddress(address.id);
              fetchAddresses();
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              console.error('Failed to delete address:', error);
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const getAddressTypeIcon = (type: string): keyof typeof MaterialIcons.glyphMap => {
    switch (type) {
      case 'Registered':
        return 'business';
      case 'Pickup':
        return 'local-shipping';
      case 'Delivery':
        return 'location-on';
      case 'Billing':
        return 'receipt';
      case 'Office':
        return 'apartment';
      case 'Warehouse':
        return 'warehouse';
      default:
        return 'location-on';
    }
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <MaterialIcons 
            name={getAddressTypeIcon(item.address_type)} 
            size={24} 
            color={theme.colors.primary.main} 
          />
          <Text style={styles.addressType}>{item.address_type}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {item.is_active && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>Active</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.addressLine1}>{item.address_line_1}</Text>
      {item.address_line_2 && <Text style={styles.addressLine2}>{item.address_line_2}</Text>}
      <Text style={styles.addressLocation}>
        {item.city}, {item.state} - {item.postal_code}
      </Text>
      {item.landmark && <Text style={styles.landmark}>Landmark: {item.landmark}</Text>}

      <View style={styles.addressActions}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
            <Feather name="edit-2" size={18} color={theme.colors.primary.main} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
            <Feather name="trash-2" size={18} color={theme.colors.semantic.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Addresses</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Feather name="plus" size={20} color={theme.colors.text.onPrimary} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchAddresses();
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="location-off" size={64} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyText}>No addresses found</Text>
            <Text style={styles.emptySubtext}>Add your first address to get started</Text>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} disabled={saving}>
                <Feather name="x" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Address Type *</Text>
                <View style={styles.typeSelector}>
                  {(['Pickup', 'Delivery', 'Billing', 'Office', 'Warehouse'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption, 
                        formData.address_type === type && styles.typeOptionActive
                      ]}
                      onPress={() => setFormData({ ...formData, address_type: type })}
                      disabled={saving}
                    >
                      <Text style={[
                        styles.typeOptionText, 
                        formData.address_type === type && styles.typeOptionTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Address Line 1 *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address_line_1}
                  onChangeText={(text) => setFormData({ ...formData, address_line_1: text })}
                  placeholder="Building, Street name"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Address Line 2</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address_line_2}
                  onChangeText={(text) => setFormData({ ...formData, address_line_2: text })}
                  placeholder="Floor, Unit number (Optional)"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formSection, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>City *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    placeholder="City"
                    placeholderTextColor={theme.colors.text.tertiary}
                    editable={!saving}
                  />
                </View>

                <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>State *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.state}
                    onChangeText={(text) => setFormData({ ...formData, state: text })}
                    placeholder="State"
                    placeholderTextColor={theme.colors.text.tertiary}
                    editable={!saving}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Postal Code *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.postal_code}
                  onChangeText={(text) => setFormData({ ...formData, postal_code: text })}
                  placeholder="Postal code"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Landmark</Text>
                <TextInput
                  style={styles.input}
                  value={formData.landmark}
                  onChangeText={(text) => setFormData({ ...formData, landmark: text })}
                  placeholder="Nearby landmark (Optional)"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Country</Text>
                <TextInput
                  style={styles.input}
                  value={formData.country}
                  onChangeText={(text) => setFormData({ ...formData, country: text })}
                  placeholder="Country"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                />
              </View>

              <View style={styles.formSection}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Active</Text>
                  <Switch
                    value={formData.is_active !== false}
                    onValueChange={(value) => setFormData({ ...formData, is_active: value })}
                    trackColor={{ 
                      false: theme.colors.border.primary, 
                      true: theme.colors.primary.main + '50' 
                    }}
                    thumbColor={formData.is_active !== false ? theme.colors.primary.main : theme.colors.background.primary}
                    disabled={saving}
                  />
                </View>
              </View>

              {formData.address_type === 'Registered' && (
                <>
                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>Firm Name</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.firm_name || ''}
                      onChangeText={(text) => setFormData({ ...formData, firm_name: text })}
                      placeholder="Firm name for registered address"
                      placeholderTextColor={theme.colors.text.tertiary}
                      editable={!saving}
                    />
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>GST Number</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.gst_number || ''}
                      onChangeText={(text) => setFormData({ ...formData, gst_number: text.toUpperCase() })}
                      placeholder="GST number for registered address"
                      autoCapitalize="characters"
                      placeholderTextColor={theme.colors.text.tertiary}
                      editable={!saving}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={theme.colors.text.onPrimary} />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Addresses;