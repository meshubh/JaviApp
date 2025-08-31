// app/screens/Addresses/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
    name: '',  // NEW: Contact name
    number: '', // NEW: Contact number
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.name?.trim()) {
      errors.name = 'Contact name is required';
    }
    
    if (!formData.number?.trim()) {
      errors.number = 'Contact number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.number.trim())) {
      errors.number = 'Invalid phone number (10 digits required)';
    }
    
    if (!formData.address_line_1?.trim()) {
      errors.address_line_1 = 'Address line 1 is required';
    }
    
    if (!formData.city?.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.state?.trim()) {
      errors.state = 'State is required';
    }
    
    if (!formData.postal_code?.trim()) {
      errors.postal_code = 'Postal code is required';
    } else if (!/^\d{6}$/.test(formData.postal_code.trim())) {
      errors.postal_code = 'Postal code must be 6 digits';
    }
    
    // Registered address specific validation
    if (formData.address_type === 'Registered') {
      if (!formData.firm_name?.trim()) {
        errors.firm_name = 'Firm name is required for registered addresses';
      }
      if (!formData.gst_number?.trim()) {
        errors.gst_number = 'GST number is required for registered addresses';
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number)) {
        errors.gst_number = 'Invalid GST format';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      address_type: 'Pickup',
      name: '',
      number: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      landmark: '',
      is_active: true,
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      address_type: address.address_type,
      name: address.name || '',
      number: address.number || '',
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
    setFormErrors({});
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again');
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
      `Are you sure you want to delete this address${address.name ? ` (${address.name})` : ''}?`,
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

  const handleCall = (number: string) => {
    // You can implement actual calling functionality here
    // For example, using Linking.openURL(`tel:${number}`)
    Alert.alert('Call', `Calling ${number}`);
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

      {/* Contact Information Section */}
      {(item.name || item.number) && (
        <View style={styles.contactSection}>
          {item.name && (
            <View style={styles.contactRow}>
              <Feather name="user" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.contactName}>{item.name}</Text>
            </View>
          )}
          {item.number && (
            <TouchableOpacity 
              style={styles.contactRow} 
              onPress={() => handleCall(item.number!)}
            >
              <Feather name="phone" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.contactNumber}>{item.number}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Text style={styles.addressLine1}>{item.address_line_1}</Text>
      {item.address_line_2 && <Text style={styles.addressLine2}>{item.address_line_2}</Text>}
      <Text style={styles.addressLocation}>
        {item.city}, {item.state} - {item.postal_code}
      </Text>
      {item.landmark && <Text style={styles.landmark}>Landmark: {item.landmark}</Text>}

      <View style={styles.addressActions}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {item.number && (
            <TouchableOpacity 
              onPress={() => handleCall(item.number!)} 
              style={styles.actionButton}
            >
              <Feather name="phone" size={18} color={theme.colors.semantic.success} />
            </TouchableOpacity>
          )}
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
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

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
                {/* Contact Information Section */}
                <View style={styles.formSectionHeader}>
                  <Feather name="user" size={18} color={theme.colors.primary.main} />
                  <Text style={styles.formSectionTitle}>Contact Information</Text>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Contact Name *</Text>
                  <TextInput
                    style={[styles.input, formErrors.name && styles.inputError]}
                    value={formData.name}
                    onChangeText={(text) => {
                      setFormData({ ...formData, name: text });
                      if (formErrors.name) {
                        setFormErrors({ ...formErrors, name: '' });
                      }
                    }}
                    placeholder="John Doe"
                    placeholderTextColor={theme.colors.text.tertiary}
                    editable={!saving}
                  />
                  {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Contact Number *</Text>
                  <TextInput
                    style={[styles.input, formErrors.number && styles.inputError]}
                    value={formData.number}
                    onChangeText={(text) => {
                      // Remove non-numeric characters and limit to 10 digits
                      const cleaned = text.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, number: cleaned });
                      if (formErrors.number) {
                        setFormErrors({ ...formErrors, number: '' });
                      }
                    }}
                    placeholder="9876543210"
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholderTextColor={theme.colors.text.tertiary}
                    editable={!saving}
                  />
                  {formErrors.number && <Text style={styles.errorText}>{formErrors.number}</Text>}
                </View>

                {/* Address Type Section */}
                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Address Type *</Text>
                  <View style={styles.typeSelector}>
                    {(['Pickup', 'Delivery', 'Billing', 'Registered'] as const).map((type) => (
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

                {/* Address Details Section */}
                <View style={styles.formSectionHeader}>
                  <MaterialIcons name="location-on" size={18} color={theme.colors.primary.main} />
                  <Text style={styles.formSectionTitle}>Address Details</Text>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Address Line 1 *</Text>
                  <TextInput
                    style={[styles.input, formErrors.address_line_1 && styles.inputError]}
                    value={formData.address_line_1}
                    onChangeText={(text) => {
                      setFormData({ ...formData, address_line_1: text });
                      if (formErrors.address_line_1) {
                        setFormErrors({ ...formErrors, address_line_1: '' });
                      }
                    }}
                    placeholder="Building, Street name"
                    placeholderTextColor={theme.colors.text.tertiary}
                    editable={!saving}
                  />
                  {formErrors.address_line_1 && <Text style={styles.errorText}>{formErrors.address_line_1}</Text>}
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
                      style={[styles.input, formErrors.city && styles.inputError]}
                      value={formData.city}
                      onChangeText={(text) => {
                        setFormData({ ...formData, city: text });
                        if (formErrors.city) {
                          setFormErrors({ ...formErrors, city: '' });
                        }
                      }}
                      placeholder="City"
                      placeholderTextColor={theme.colors.text.tertiary}
                      editable={!saving}
                    />
                    {formErrors.city && <Text style={styles.errorText}>{formErrors.city}</Text>}
                  </View>

                  <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>State *</Text>
                    <TextInput
                      style={[styles.input, formErrors.state && styles.inputError]}
                      value={formData.state}
                      onChangeText={(text) => {
                        setFormData({ ...formData, state: text });
                        if (formErrors.state) {
                          setFormErrors({ ...formErrors, state: '' });
                        }
                      }}
                      placeholder="State"
                      placeholderTextColor={theme.colors.text.tertiary}
                      editable={!saving}
                    />
                    {formErrors.state && <Text style={styles.errorText}>{formErrors.state}</Text>}
                  </View>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Postal Code *</Text>
                  <TextInput
                    style={[styles.input, formErrors.postal_code && styles.inputError]}
                    value={formData.postal_code}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/\D/g, '').slice(0, 6);
                      setFormData({ ...formData, postal_code: cleaned });
                      if (formErrors.postal_code) {
                        setFormErrors({ ...formErrors, postal_code: '' });
                      }
                    }}
                    placeholder="110001"
                    keyboardType="numeric"
                    maxLength={6}
                    placeholderTextColor={theme.colors.text.tertiary}
                    editable={!saving}
                  />
                  {formErrors.postal_code && <Text style={styles.errorText}>{formErrors.postal_code}</Text>}
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

                {/* Registered Address Fields */}
                {formData.address_type === 'Registered' && (
                  <>
                    <View style={styles.formSectionHeader}>
                      <MaterialIcons name="business" size={18} color={theme.colors.primary.main} />
                      <Text style={styles.formSectionTitle}>Firm Information</Text>
                    </View>

                    <View style={styles.formSection}>
                      <Text style={styles.inputLabel}>Firm Name *</Text>
                      <TextInput
                        style={[styles.input, formErrors.firm_name && styles.inputError]}
                        value={formData.firm_name || ''}
                        onChangeText={(text) => {
                          setFormData({ ...formData, firm_name: text });
                          if (formErrors.firm_name) {
                            setFormErrors({ ...formErrors, firm_name: '' });
                          }
                        }}
                        placeholder="ABC Technologies Pvt. Ltd."
                        placeholderTextColor={theme.colors.text.tertiary}
                        editable={!saving}
                      />
                      {formErrors.firm_name && <Text style={styles.errorText}>{formErrors.firm_name}</Text>}
                    </View>

                    <View style={styles.formSection}>
                      <Text style={styles.inputLabel}>GST Number *</Text>
                      <TextInput
                        style={[styles.input, formErrors.gst_number && styles.inputError]}
                        value={formData.gst_number || ''}
                        onChangeText={(text) => {
                          setFormData({ ...formData, gst_number: text.toUpperCase() });
                          if (formErrors.gst_number) {
                            setFormErrors({ ...formErrors, gst_number: '' });
                          }
                        }}
                        placeholder="22AAAAA0000A1Z5"
                        autoCapitalize="characters"
                        maxLength={15}
                        placeholderTextColor={theme.colors.text.tertiary}
                        editable={!saving}
                      />
                      {formErrors.gst_number && <Text style={styles.errorText}>{formErrors.gst_number}</Text>}
                    </View>
                  </>
                )}

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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Addresses;