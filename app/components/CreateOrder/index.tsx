// app/components/CreateOrder/index.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Address, Contract, CreateOrderData, orderService } from '../../services/OrderService';
import { useTheme } from '../../theme/themeContext';
import { RootStackParamList } from '../../types/navigation';
import { CustomHeader } from '../CustomHeader';
import GoogleAddressSearchable from '../GoogleAddressSearchable/index';
import SearchableDropdown from '../common/SearchableDropdown';
import { useCreateOrderStyles } from './createOrder.styles';

interface CreateOrderProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootStackParamList, 'CreateOrder'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
}

const CreateOrder: React.FC<CreateOrderProps> = ({ navigation }) => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = useCreateOrderStyles(theme);
  
  // Form state
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [selectedPickupAddress, setSelectedPickupAddress] = useState<string>('');
  const [selectedDropAddress, setSelectedDropAddress] = useState<string>('');
  const [dropAddressText, setDropAddressText] = useState('');
  const [dropAddressId, setDropAddressId] = useState<string>('');
  const [numberOfBoxes, setNumberOfBoxes] = useState('0');
  const [numberOfInvoices, setNumberOfInvoices] = useState('0');
  const [packageDescription, setPackageDescription] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  const [requiresSignature, setRequiresSignature] = useState(false);
  const [expectedPickupDate, setExpectedPickupDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // POC fields
  const [pickupPocName, setPickupPocName] = useState('');
  const [pickupPocNumber, setPickupPocNumber] = useState('');
  const [dropAddressFirmName, setDropAddressFirmName] = useState('');
  const [dropPocName, setDropPocName] = useState('');
  const [dropPocNumber, setDropPocNumber] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Dynamic form state
  const [selectedContractData, setSelectedContractData] = useState<Contract | null>(null);
  const [isPerKmContract, setIsPerKmContract] = useState(false);
  const [isPerShipmentContract, setIsPerShipmentContract] = useState(false);

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

  useEffect(() => {
    if (selectedContract) {
      const contract = contracts.find(c => c.id === selectedContract);
      setSelectedContractData(contract || null);
      
      if (contract) {
        const isPKM = contract.pricing_model?.toLowerCase().includes('km') || contract.pricing_model.toLowerCase().includes('distance') || contract.pricing_model?.toLowerCase().includes('per km');
        const isPS = contract.pricing_model?.toLowerCase().includes('shipment') || contract.pricing_model?.toLowerCase().includes('per shipment');

        console.log(`Selected contract: ${contract.title} (${contract.pricing_model}) - isPerKm: ${isPKM}, isPerShipment: ${isPS}`);
        
        setIsPerKmContract(isPKM);
        setIsPerShipmentContract(isPS);
        
        if (!isPKM) {
          setDropAddressText('');
          setDropAddressId('');
          setSelectedDropAddress('');
          setDropPocName('');
          setDropPocNumber('');
        }
        
        prefillPocInformation();
      }
    } else {
      setSelectedContractData(null);
      setIsPerKmContract(false);
      setIsPerShipmentContract(false);
    }
  }, [selectedContract, contracts]);

  const prefillPocInformation = async () => {
    // You'll need to get client data from your auth context or make an API call
    try {
      setPickupPocName(''); // Will be filled with client.poc1_name
      setPickupPocNumber(''); // Will be filled with client.poc1_number
    } catch (error) {
      console.error('Error prefilling POC info:', error);
    }
  };

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
      
      setContracts(contractsData);
      setAddresses(addressesData);
      
      // Set default selections if available
      if (contractsData && contractsData.length > 0) {
        //setSelectedContract(contractsData[0].id);
      }
      if (addressesData && addressesData.length > 0) {
        //setSelectedPickupAddress(addressesData[0].id);
      }
    } catch (error) {
      console.error('[CreateOrder] Error loading data:', error);
      Alert.alert(t('common.error.value'), t('createOrder.failedToLoad.value'));
    } finally {
      setIsLoadingData(false);
    }
  };

  const resetFormFields = () => {
    setSelectedContract('');
    setSelectedPickupAddress('');
    setSelectedDropAddress('');
    setDropAddressText('');
    setDropAddressId('');
    setNumberOfBoxes('0');
    setNumberOfInvoices('0');
    setPackageDescription('');
    setSpecialInstructions('');
    setDeclaredValue('');
    setTotalWeight('');
    setIsFragile(false);
    setRequiresSignature(false);
    setPickupPocName('');
    setPickupPocNumber('');
    setDropPocName('');
    setDropPocNumber('');
    setExpectedPickupDate(null);
  };

  const handleDropAddressSelect = useCallback((address: string, addressId?: string) => {
    setDropAddressText(address);
    if (addressId) {
      setDropAddressId(addressId);
      setSelectedDropAddress(addressId);
    } else {
      setDropAddressId('');
      setSelectedDropAddress('');
    }
    const add = addresses.find(addr => addr.id === addressId);
    if (add) {
      const contact_info = add.contact_info || '';
      const [poc_name, poc_number] = contact_info && contact_info.split(' - ');
      setDropAddressFirmName(add.firm_name || '');
      setDropPocName(poc_name || '');
      setDropPocNumber(poc_number || '');
    }
  }, [addresses]);

  const validateForm = (): boolean => {
    if (!selectedContract) {
      Alert.alert(t('createOrder.validationError.value'), t('createOrder.contractRequired.value'));
      return false;
    }
    
    if (!selectedPickupAddress) {
      Alert.alert(t('createOrder.validationError.value'), t('createOrder.pickupAddressRequired.value'));
      return false;
    }

    if (!pickupPocName) {
      Alert.alert(t('createOrder.validationError.value'), t('createOrder.pickupContactNameRequired.value'));
      return false;
    }

    if (!pickupPocNumber) {
      Alert.alert(t('createOrder.validationError.value'), t('createOrder.pickupContactNumberRequired.value'));
      return false;
    }

    if (isPerKmContract) {
      if (!dropAddressText) {
        Alert.alert(t('createOrder.validationError.value'), t('createOrder.dropAddressRequired.value'));
        return false;
      }
      if (!dropPocName) {
        Alert.alert(t('createOrder.validationError.value'), t('createOrder.dropContactNameRequired.value'));
        return false;
      }
      if (!dropPocNumber) {
        Alert.alert(t('createOrder.validationError.value'), t('createOrder.dropContactNumberRequired.value'));
        return false;
      }
    }

    if (isPerShipmentContract) {
      const boxes = parseInt(numberOfBoxes) || 0;
      const invoices = parseInt(numberOfInvoices) || 0;
      
      if (boxes === 0) {
        Alert.alert(t('createOrder.validationError.value'), t('createOrder.boxesRequired.value'));
        return false;
      }
      if (invoices === 0) {
        Alert.alert(t('createOrder.validationError.value'), t('createOrder.invoicesRequired.value'));
        return false;
      }
    }
    
    if (expectedPickupDate && expectedPickupDate < new Date()) {
      Alert.alert(t('createOrder.validationError.value'), t('createOrder.futurePickupDate.value'));
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
        drop_address_id: isPerKmContract ? selectedDropAddress || undefined : undefined,
        drop_address_text: isPerKmContract ? dropAddressText || undefined : undefined,
        pickup_poc_name: pickupPocName,
        pickup_poc_number: pickupPocNumber,
        drop_poc_name: isPerKmContract ? dropPocName || undefined : undefined,
        drop_poc_number: isPerKmContract ? dropPocNumber || undefined : undefined,
        number_of_boxes: parseInt(numberOfBoxes) || 0,
        number_of_invoices: parseInt(numberOfInvoices) || 0,
        expected_pickup_date: expectedPickupDate ? expectedPickupDate.toISOString() : '',
        package_description: packageDescription || undefined,
        special_instructions: specialInstructions || undefined,
        declared_value: declaredValue ? parseFloat(declaredValue) : undefined,
        total_weight: totalWeight ? parseFloat(totalWeight) : undefined,
        is_fragile: isFragile,
        requires_signature: requiresSignature,
      };
      
      const createdOrder = await orderService.createOrder(orderData);
      
      Alert.alert(
        t('common.success.value'),
        `${t('orders.orderNumber.value')} #${createdOrder.order_number} ${t('createOrder.orderCreatedSuccess.value')}`,
        [
          {
            text: t('createOrder.viewOrder.value'),
            onPress: () => navigation.navigate('ViewOrders', { orderId: createdOrder.id }),
          },
          {
            text: t('createOrder.createAnother.value'),
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
        t('common.error.value'),
        error.message || t('createOrder.failedToCreate.value')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateWithDefaultTime = new Date(selectedDate);
      dateWithDefaultTime.setHours(18, 0, 0, 0);
      
      setExpectedPickupDate(dateWithDefaultTime);
      setShowTimePicker(true);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && expectedPickupDate) {
      const updatedDateTime = new Date(expectedPickupDate);
      updatedDateTime.setHours(selectedTime.getHours());
      updatedDateTime.setMinutes(selectedTime.getMinutes());
      setExpectedPickupDate(updatedDateTime);
    }
  };

  const onSelectPickupAddress = (addressId: string) => {
    setSelectedPickupAddress(addressId);
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      const contact_info = address.contact_info || '';
      const [poc_name, poc_number] = contact_info && contact_info.split(' - ');
      setPickupPocName(poc_name || '');
      setPickupPocNumber(poc_number || '');
    }
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>{t('common.loading.value')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary.main} barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <CustomHeader
          navigation={navigation}
          title={t('createOrder.title.value')}
          showBack={false}
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
              <Text style={styles.sectionTitle}>{t('createOrder.contractDetails.value')}</Text>
              
              <SearchableDropdown
                label={t('createOrder.contract.value')}
                required={true}
                data={contracts}
                value={selectedContract}
                onSelect={setSelectedContract}
                displayField={(contract: Contract) => `${contract.title} - ${contract.pricing_model}`}
                searchFields={(contract: Contract) => [
                  contract.contract_number,
                  contract.client,
                  contract.status,
                ]}
                keyExtractor={(contract: Contract) => contract.id}
                placeholder={t('createOrder.selectContract.value')}
                renderItem={(contract: Contract, isSelected: boolean) => (
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      color: isSelected ? theme.colors.primary.dark : theme.colors.text.primary,
                      fontWeight: isSelected ? '600' : '400',
                    }}>
                      {contract.title}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: theme.colors.text.secondary,
                      marginTop: 2,
                    }}>
                      ₹ {contract.value} • {contract.pricing_model}
                    </Text>
                  </View>
                )}
              />

              {/* Pickup Address Searchable Dropdown */}
              <SearchableDropdown
                label={t('createOrder.pickupAddress.value')}
                required={true}
                data={addresses}
                value={selectedPickupAddress}
                onSelect={onSelectPickupAddress}
                displayField={(address: Address) => `${address.address_line_1}, ${address.city}`}
                searchFields={(address: Address) => [
                  address.address_line_1,
                  address.address_line_2 || '',
                  address.city,
                  address.state,
                  address.pincode,
                ]}
                keyExtractor={(address: Address) => address.id}
                placeholder={t('createOrder.selectPickupAddress.value')}
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

              {/* Drop Address - Only for Per KM contracts */}
              {isPerKmContract && (
                <GoogleAddressSearchable
                  label={t('createOrder.dropAddress.value')}
                  required={true}
                  value={dropAddressText}
                  onSelect={handleDropAddressSelect}
                  placeholder={t('createOrder.searchDropAddress.value')}
                />
              )}
            </View>

            {/* POC Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('createOrder.pocInformation.value')}</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  {t('createOrder.pickupContactName.value')} <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={t('createOrder.pickupContactName.value')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={pickupPocName}
                  onChangeText={setPickupPocName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  {t('createOrder.pickupContactNumber.value')} <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={t('createOrder.pickupContactNumber.value')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={pickupPocNumber}
                  onChangeText={setPickupPocNumber}
                  keyboardType="phone-pad"
                />
              </View>

              {isPerKmContract && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>
                      {t('createOrder.dropFirmName.value')} <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder={t('createOrder.dropFirmName.value')}
                      placeholderTextColor={theme.colors.text.tertiary}
                      value={dropAddressFirmName}
                      onChangeText={setDropAddressFirmName}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>
                      {t('createOrder.dropContactName.value')} <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder={t('createOrder.dropContactName.value')}
                      placeholderTextColor={theme.colors.text.tertiary}
                      value={dropPocName}
                      onChangeText={setDropPocName}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>
                      {t('createOrder.dropContactNumber.value')} <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder={t('createOrder.dropContactNumber.value')}
                      placeholderTextColor={theme.colors.text.tertiary}
                      value={dropPocNumber}
                      onChangeText={setDropPocNumber}
                      keyboardType="phone-pad"
                    />
                  </View>
                </>
              )}
            </View>

            {/* Package Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('createOrder.packageInformation.value')}</Text>
              
              <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
                <View style={[styles.formGroup, { flex: 1, marginRight: theme.spacing.sm, marginBottom: 0 }]}>
                  <Text style={styles.formLabel}>
                    {t('createOrder.invoices.value')} {isPerShipmentContract && <Text style={styles.requiredAsterisk}>*</Text>}
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

                <View style={[styles.formGroup, { flex: 1, marginLeft: theme.spacing.sm, marginBottom: 0 }]}>
                  <Text style={styles.formLabel}>
                    {t('createOrder.boxes.value')} {isPerShipmentContract && <Text style={styles.requiredAsterisk}>*</Text>}
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
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t('createOrder.packageDescription.value')}</Text>
                <View style={[styles.formInput, styles.formInputMultiline]}>
                  <TextInput
                    placeholder={t('createOrder.packageDescriptionPlaceholder.value')}
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={packageDescription}
                    onChangeText={setPackageDescription}
                    multiline
                    numberOfLines={3}
                    style={{ color: theme.colors.text.primary }}
                  />
                </View>
              </View>
            </View>

            {/* Pickup Schedule */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('createOrder.pickupSchedule.value')}</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  {t('createOrder.expectedPickupDateTime.value')} <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons name="calendar-today" size={20} color={theme.colors.text.secondary} />
                  <Text style={styles.datePickerText}>
                    {expectedPickupDate
                      ? `${expectedPickupDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })} at ${expectedPickupDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}`
                      : t('createOrder.selectDateTime.value')}
                  </Text>
                  <Feather name="chevron-down" size={16} color={theme.colors.text.tertiary} />
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={expectedPickupDate ?? new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={expectedPickupDate ?? new Date()}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t('createOrder.specialInstructions.value')}</Text>
                <View style={[styles.formInput, styles.formInputMultiline]}>
                  <TextInput
                    placeholder={t('createOrder.specialInstructionsPlaceholder.value')}
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

            {/* Submit Button */}
            <View style={styles.actionButtonsContainer}>
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
                    <Text style={styles.primaryActionButtonText}> {t('createOrder.createOrderButton.value')}</Text>
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