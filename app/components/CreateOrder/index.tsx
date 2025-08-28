// app/CreateOrder/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Address, Contract, CreateOrderData, orderService } from '../../services/OrderService';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import { CustomHeader } from '../CustomHeader';
import GoogleAddressSearchable from '../GoogleAddressSearchable/index';
import SearchableDropdown from '../common/SearchableDropdown';
import { useCreateOrderStyles } from './createOrder.styles';

// Add your Google Places API key here
const GOOGLE_PLACES_API_KEY = 'AIzaSyDRlCuBdFQ8bdlhdYTAkLhXe0BakGC1SBQ';

interface CreateOrderProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'CreateOrder'>;
}

const CreateOrder: React.FC<CreateOrderProps> = ({ navigation }) => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const styles = useCreateOrderStyles(theme);
  
  // Form state
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [selectedPickupAddress, setSelectedPickupAddress] = useState<string>('');
  const [selectedDropAddress, setSelectedDropAddress] = useState<string>('');
  const [dropAddressText, setDropAddressText] = useState('');
  const [dropAddressPlaceId, setDropAddressPlaceId] = useState<string>(''); // New field for Google Place ID
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
      resetFormFields();
      
      return () => {
        console.log('[CreateOrder] Screen unfocused');
      };
    }, [])
  );

  const loadInitialData = async () => {
    try {
      setIsLoadingData(true);
      
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
    setDropAddressPlaceId('');
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

  const handleDropAddressSelect = useCallback((address: string, placeId?: string) => {
    setDropAddressText(address);
    setDropAddressPlaceId(placeId || '');
  }, []);

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
        drop_address_place_id: dropAddressPlaceId || undefined, // Include Google Place ID if available
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
              loadInitialData();
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
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary.main} barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <CustomHeader
          navigation={navigation}
          title="Create Order"
          showBack={true}
          showMenu={false}
        />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
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
                      color: isSelected ? theme.colors.primary.dark : theme.colors.text.primary,
                      fontWeight: isSelected ? '600' : '400',
                    }}>
                      {contract.contract_number}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: theme.colors.text.secondary,
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
                      color: isSelected ? theme.colors.primary.dark : theme.colors.text.primary,
                      fontWeight: isSelected ? '600' : '400',
                    }}>
                      {address.address_line_1}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: theme.colors.text.secondary,
                      marginTop: 2,
                    }}>
                      {address.city}, {address.state} - {address.pincode}
                    </Text>
                  </View>
                )}
              />

              {/* Google Address Searchable Drop Address */}
              <GoogleAddressSearchable
                label="Drop Address"
                value={dropAddressText}
                onSelect={handleDropAddressSelect}
                placeholder="Search for drop address using Google"
                googleApiKey={GOOGLE_PLACES_API_KEY}
              />
            </View>

            {/* Package Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Package Information</Text>
              
              <View style={{ flexDirection: 'row' }}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>
                    Boxes <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity 
                      style={styles.counterButton}
                      onPress={() => setNumberOfBoxes(String(Math.max(0, parseInt(numberOfBoxes) - 1)))}
                    >
                      <Feather name="minus" size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.counterInput}
                      value={numberOfBoxes}
                      onChangeText={setNumberOfBoxes}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity 
                      style={styles.counterButton}
                      onPress={() => setNumberOfBoxes(String(parseInt(numberOfBoxes) + 1))}
                    >
                      <Feather name="plus" size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>
                    Invoices <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity 
                      style={styles.counterButton}
                      onPress={() => setNumberOfInvoices(String(Math.max(0, parseInt(numberOfInvoices) - 1)))}
                    >
                      <Feather name="minus" size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.counterInput}
                      value={numberOfInvoices}
                      onChangeText={setNumberOfInvoices}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity 
                      style={styles.counterButton}
                      onPress={() => setNumberOfInvoices(String(parseInt(numberOfInvoices) + 1))}
                    >
                      <Feather name="plus" size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Package Description</Text>
                <View style={[styles.formInput, styles.formInputMultiline]}>
                  <TextInput
                    placeholder="Describe the package contents"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={packageDescription}
                    onChangeText={setPackageDescription}
                    multiline
                    numberOfLines={3}
                    style={{ color: theme.colors.text.primary }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.0"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={totalWeight}
                    onChangeText={setTotalWeight}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>Declared Value (₹)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={declaredValue}
                    onChangeText={setDeclaredValue}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.toggleContainer}>
                <View style={styles.toggleLabel}>
                  <MaterialIcons name="warning" size={20} color={theme.colors.semantic.warning} />
                  <Text style={styles.toggleLabel}>Fragile Package</Text>
                </View>
                <Switch
                  value={isFragile}
                  onValueChange={setIsFragile}
                  trackColor={{ 
                    false: theme.colors.neutral[300], 
                    true: theme.colors.primary.light 
                  }}
                  thumbColor={isFragile ? theme.colors.primary.main : theme.colors.neutral[100]}
                />
              </View>

              <View style={styles.toggleContainer}>
                <View style={styles.toggleLabel}>
                  <MaterialIcons name="edit" size={20} color={theme.colors.primary.main} />
                  <Text style={styles.toggleLabel}>Requires Signature</Text>
                </View>
                <Switch
                  value={requiresSignature}
                  onValueChange={setRequiresSignature}
                  trackColor={{ 
                    false: theme.colors.neutral[300], 
                    true: theme.colors.primary.light 
                  }}
                  thumbColor={requiresSignature ? theme.colors.primary.main : theme.colors.neutral[100]}
                />
              </View>
            </View>

            {/* Pickup Schedule */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pickup Schedule</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Expected Pickup Date <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons name="calendar-today" size={20} color={theme.colors.text.secondary} />
                  <Text style={styles.datePickerText}>
                    {expectedPickupDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Feather name="chevron-down" size={16} color={theme.colors.text.tertiary} />
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

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Special Instructions</Text>
                <View style={[styles.formInput, styles.formInputMultiline]}>
                  <TextInput
                    placeholder="Any special handling instructions"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={specialInstructions}
                    onChangeText={setSpecialInstructions}
                    multiline
                    numberOfLines={3}
                    style={{ color: theme.colors.text.primary }}
                  />
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information (Optional)</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter phone number"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Address</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter email address"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={customerEmail}
                  onChangeText={setCustomerEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Submit Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryActionButton]}
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              >
                <Text style={styles.secondaryActionButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.primaryActionButton, 
                  isLoading && styles.disabledActionButton
                ]} 
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.text.onPrimary} />
                ) : (
                  <>
                    <MaterialIcons name="check-circle" size={20} color={theme.colors.text.onPrimary} />
                    <Text style={styles.primaryActionButtonText}> Create Order</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default CreateOrder;