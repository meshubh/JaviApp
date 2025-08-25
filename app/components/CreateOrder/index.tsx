// app/CreateOrder/index.tsx
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native'; // Add this import
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Address, Contract, CreateOrderData, orderService } from '../../services/OrderService';
import { BorderRadius, Colors, createElevation, Spacing, Typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation';
import SearchableDropdown from '../common/SearchableDropdown';

interface CreateOrderProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'CreateOrder'>;
}

const CreateOrder: React.FC<CreateOrderProps> = ({ navigation }) => {
  const { token } = useAuth();
  
  // Form state
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [selectedPickupAddress, setSelectedPickupAddress] = useState<string>('');
  const [selectedDropAddress, setSelectedDropAddress] = useState<string>('');
  const [dropAddressText, setDropAddressText] = useState('');
  const [numberOfBoxes, setNumberOfBoxes] = useState('0');
  const [numberOfInvoices, setNumberOfInvoices] = useState('0');
  const [packageDescription, setPackageDescription] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  const [requiresSignature, setRequiresSignature] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [expectedPickupDate, setExpectedPickupDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Use useFocusEffect to reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('[CreateOrder] Screen focused - loading fresh data');
      loadInitialData();
      
      // Optional: Reset form when screen comes into focus
      // You can comment this out if you want to preserve form data
      resetFormFields();
      
      // Cleanup function (optional)
      return () => {
        console.log('[CreateOrder] Screen unfocused');
      };
    }, [])
  );

  const loadInitialData = async () => {
    try {
      setIsLoadingData(true);
      
      // Log to debug
      console.log('[CreateOrder] Fetching contracts and addresses...');
      
      const [contractsData, addressesData] = await Promise.all([
        orderService.getActiveContracts(),
        orderService.getPickupAddresses(),
      ]);
      
      console.log('[CreateOrder] Fetched contracts:', contractsData?.length || 0);
      console.log('[CreateOrder] Fetched addresses:', addressesData?.length || 0);
      
      setContracts(contractsData || []);
      setAddresses(addressesData || []);
      
      // Set default selections if available
      if (contractsData && contractsData.length > 0) {
        setSelectedContract(contractsData[0].id);
      }
      if (addressesData && addressesData.length > 0) {
        setSelectedPickupAddress(addressesData[0].id);
      }
    } catch (error) {
      console.error('[CreateOrder] Error loading data:', error);
      Alert.alert('Error', 'Failed to load contracts and addresses. Please try again.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const resetFormFields = () => {
    setSelectedContract('');
    setSelectedPickupAddress('');
    setSelectedDropAddress('');
    setDropAddressText('');
    setNumberOfBoxes('0');
    setNumberOfInvoices('0');
    setPackageDescription('');
    setSpecialInstructions('');
    setDeclaredValue('');
    setTotalWeight('');
    setIsFragile(false);
    setRequiresSignature(false);
    setCustomerPhone('');
    setCustomerEmail('');
    setExpectedPickupDate(new Date());
  };

  const validateForm = (): boolean => {
    if (!selectedContract) {
      Alert.alert('Validation Error', 'Please select a contract');
      return false;
    }
    
    if (!selectedPickupAddress) {
      Alert.alert('Validation Error', 'Please select a pickup address');
      return false;
    }
    
    const boxes = parseInt(numberOfBoxes) || 0;
    const invoices = parseInt(numberOfInvoices) || 0;
    
    if (boxes === 0 && invoices === 0) {
      Alert.alert('Validation Error', 'Please enter at least one box or invoice');
      return false;
    }
    
    if (expectedPickupDate < new Date()) {
      Alert.alert('Validation Error', 'Pickup date must be in the future');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const orderData: CreateOrderData = {
        contract_id: selectedContract,
        pickup_address_id: selectedPickupAddress,
        drop_address_id: selectedDropAddress || undefined,
        drop_address_text: dropAddressText || undefined,
        number_of_boxes: parseInt(numberOfBoxes) || 0,
        number_of_invoices: parseInt(numberOfInvoices) || 0,
        expected_pickup_date: expectedPickupDate.toISOString(),
        package_description: packageDescription || undefined,
        special_instructions: specialInstructions || undefined,
        declared_value: declaredValue ? parseFloat(declaredValue) : undefined,
        total_weight: totalWeight ? parseFloat(totalWeight) : undefined,
        is_fragile: isFragile,
        requires_signature: requiresSignature,
        customer_phone: customerPhone || undefined,
        customer_email: customerEmail || undefined,
      };
      
      const createdOrder = await orderService.createOrder(orderData);
      
      Alert.alert(
        'Success',
        `Order #${createdOrder.order_number} created successfully!`,
        [
          {
            text: 'View Order',
            onPress: () => navigation.navigate('ViewOrders', { orderId: createdOrder.id }),
          },
          {
            text: 'Create Another',
            style: 'cancel',
            onPress: () => {
              resetFormFields();
              loadInitialData(); // Reload fresh data
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating order:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create order. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    resetFormFields();
  };

  // Rest of your component remains the same...
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpectedPickupDate(selectedDate);
    }
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.teal} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primary.teal} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={Colors.text.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Order</Text>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Feather name="menu" size={24} color={Colors.text.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Contract and Address Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contract & Pickup Details</Text>
              
              {/* Contract Searchable Dropdown */}
              <SearchableDropdown
                label="Contract"
                required={true}
                data={contracts}
                value={selectedContract}
                onSelect={setSelectedContract}
                displayField={(contract: Contract) => `${contract.contract_number} - ${contract.status}`}
                searchFields={(contract: Contract) => [
                  contract.contract_number,
                  contract.client,
                  contract.status,
                ]}
                keyExtractor={(contract: Contract) => contract.id}
                placeholder="Select a contract"
                renderItem={(contract: Contract, isSelected: boolean) => (
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      color: isSelected ? Colors.primary.teal : Colors.text.primary,
                      fontWeight: isSelected ? '600' : '400',
                    }}>
                      {contract.contract_number}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: Colors.text.secondary,
                      marginTop: 2,
                    }}>
                      {contract.status} • {contract.client}
                    </Text>
                  </View>
                )}
              />

              {/* Pickup Address Searchable Dropdown */}
              <SearchableDropdown
                label="Pickup Address"
                required={true}
                data={addresses}
                value={selectedPickupAddress}
                onSelect={setSelectedPickupAddress}
                displayField={(address: Address) => `${address.address_line_1}, ${address.city}`}
                searchFields={(address: Address) => [
                  address.address_line_1,
                  address.address_line_2 || '',
                  address.city,
                  address.state,
                  address.pincode,
                ]}
                keyExtractor={(address: Address) => address.id}
                placeholder="Select a pickup address"
                renderItem={(address: Address, isSelected: boolean) => (
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      color: isSelected ? Colors.primary.teal : Colors.text.primary,
                      fontWeight: isSelected ? '600' : '400',
                    }}>
                      {address.address_line_1}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: Colors.text.secondary,
                      marginTop: 2,
                    }}>
                      {address.city}, {address.state} - {address.pincode}
                    </Text>
                  </View>
                )}
              />


              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Drop Address (Optional)</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <Ionicons 
                    name="location-outline" 
                    size={20} 
                    color={Colors.text.tertiary}
                    style={styles.textAreaIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter drop address if different from pickup"
                    placeholderTextColor={Colors.text.tertiary}
                    value={dropAddressText}
                    onChangeText={setDropAddressText}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            </View>

            {/* Package Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Package Information</Text>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
                  <Text style={styles.inputLabel}>
                    Boxes <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="inventory-2" size={20} color={Colors.text.tertiary} />
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={Colors.text.tertiary}
                      value={numberOfBoxes}
                      onChangeText={setNumberOfBoxes}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
                  <Text style={styles.inputLabel}>
                    Invoices <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="receipt" size={20} color={Colors.text.tertiary} />
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={Colors.text.tertiary}
                      value={numberOfInvoices}
                      onChangeText={setNumberOfInvoices}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Package Description</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <MaterialIcons 
                    name="description" 
                    size={20} 
                    color={Colors.text.tertiary}
                    style={styles.textAreaIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe the package contents"
                    placeholderTextColor={Colors.text.tertiary}
                    value={packageDescription}
                    onChangeText={setPackageDescription}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="fitness-center" size={20} color={Colors.text.tertiary} />
                    <TextInput
                      style={styles.input}
                      placeholder="0.0"
                      placeholderTextColor={Colors.text.tertiary}
                      value={totalWeight}
                      onChangeText={setTotalWeight}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
                  <Text style={styles.inputLabel}>Declared Value (₹)</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="currency-rupee" size={20} color={Colors.text.tertiary} />
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      placeholderTextColor={Colors.text.tertiary}
                      value={declaredValue}
                      onChangeText={setDeclaredValue}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.switchContainer}>
                <View style={styles.switchRow}>
                  <View style={styles.switchLabelContainer}>
                    <MaterialIcons name="warning" size={20} color={Colors.text.secondary} />
                    <Text style={styles.switchLabel}>Fragile Package</Text>
                  </View>
                  <Switch
                    value={isFragile}
                    onValueChange={setIsFragile}
                    trackColor={{ false: Colors.ui.border, true: Colors.primary.green }}
                    thumbColor={Colors.text.white}
                  />
                </View>

                <View style={styles.switchRow}>
                  <View style={styles.switchLabelContainer}>
                    <MaterialIcons name="edit" size={20} color={Colors.text.secondary} />
                    <Text style={styles.switchLabel}>Requires Signature</Text>
                  </View>
                  <Switch
                    value={requiresSignature}
                    onValueChange={setRequiresSignature}
                    trackColor={{ false: Colors.ui.border, true: Colors.primary.green }}
                    thumbColor={Colors.text.white}
                  />
                </View>
              </View>
            </View>

            {/* Pickup Schedule */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pickup Schedule</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Expected Pickup Date <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={styles.inputWrapper}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons name="calendar-today" size={20} color={Colors.text.tertiary} />
                  <Text style={styles.dateText}>
                    {expectedPickupDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Feather name="chevron-down" size={16} color={Colors.text.tertiary} />
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={expectedPickupDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Special Instructions</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <MaterialIcons 
                    name="note-add" 
                    size={20} 
                    color={Colors.text.tertiary}
                    style={styles.textAreaIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Any special handling instructions"
                    placeholderTextColor={Colors.text.tertiary}
                    value={specialInstructions}
                    onChangeText={setSpecialInstructions}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information (Optional)</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="phone" size={20} color={Colors.text.tertiary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    placeholderTextColor={Colors.text.tertiary}
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={20} color={Colors.text.tertiary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    placeholderTextColor={Colors.text.tertiary}
                    value={customerEmail}
                    onChangeText={setCustomerEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <TouchableOpacity 
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.text.white} />
                ) : (
                  <>
                    <MaterialIcons name="check-circle" size={20} color={Colors.text.white} />
                    <Text style={styles.submitButtonText}>Create Order</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
  },
  header: {
    backgroundColor: Colors.primary.teal,
    ...createElevation(2),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  section: {
    backgroundColor: Colors.background.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.text.error,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.inputBar,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  pickerWrapper: {
    backgroundColor: Colors.background.inputBar,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  textAreaWrapper: {
    height: 'auto',
    minHeight: 80,
    paddingVertical: Spacing.sm,
    alignItems: 'flex-start',
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
  },
  textArea: {
    textAlignVertical: 'top',
    height: '100%',
    paddingTop: 0,
  },
  row: {
    flexDirection: 'row',
  },
  dateText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
  },
  switchContainer: {
    marginTop: Spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchLabel: {
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
  },
  submitContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.green,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    height: 48,
    ...createElevation(2),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text.white,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
  },
});

export default CreateOrder;

