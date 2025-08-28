// app/screens/BankAccounts/index.tsx
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
import { useAuth } from '../../contexts/AuthContext';
import {
  BankAccount,
  CreateBankAccountData,
  profileService
} from '../../services/ProfileService';
import { useTheme } from '../../theme/themeContext';
import { useBankAccountsStyles } from './bankAccounts.styles';

const BankAccounts: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = useBankAccountsStyles(theme);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState<CreateBankAccountData>({
    account_holder_name: '',
    account_number: '',
    bank_name: '',
    branch_name: '',
    ifsc_code: '',
    account_type: 'Current',
    is_primary: false,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      const data = await profileService.getClientBankAccounts();
      setBankAccounts(data || []);
    } catch (error) {
      console.error('Failed to fetch bank accounts:', error);
      Alert.alert('Error', 'Failed to load bank accounts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddNew = () => {
    setEditingAccount(null);
    setFormData({
      account_holder_name: '',
      account_number: '',
      bank_name: '',
      branch_name: '',
      ifsc_code: '',
      account_type: 'Current',
      is_primary: bankAccounts.length === 0,
      is_active: true,
    });
    setModalVisible(true);
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      account_holder_name: account.account_holder_name,
      account_number: account.account_number || '',
      bank_name: account.bank_name,
      branch_name: account.branch_name,
      ifsc_code: account.ifsc_code,
      account_type: account.account_type,
      is_primary: account.is_primary,
      is_active: account.is_active,
    });
    setModalVisible(true);
  };

  const handleDelete = (account: BankAccount) => {
    if (account.is_primary) {
      Alert.alert('Cannot Delete', 'Cannot delete primary bank account. Please set another account as primary first.');
      return;
    }

    Alert.alert(
      'Delete Bank Account',
      `Are you sure you want to delete the account ending in ${account.account_number_masked || profileService.maskAccountNumber(account.account_number || '')}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await profileService.deleteBankAccount(account.id);
              fetchBankAccounts();
              Alert.alert('Success', 'Bank account deleted successfully');
            } catch (error) {
              console.error('Failed to delete bank account:', error);
              Alert.alert('Error', 'Failed to delete bank account');
            }
          },
        },
      ]
    );
  };

  const handleSetPrimary = async (account: BankAccount) => {
    if (account.is_primary) return;

    try {
      await profileService.setPrimaryBankAccount(account.id);
      fetchBankAccounts();
      Alert.alert('Success', 'Primary bank account updated');
    } catch (error) {
      console.error('Failed to update primary account:', error);
      Alert.alert('Error', 'Failed to update primary account');
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.account_holder_name || !formData.account_number || 
        !formData.bank_name || !formData.branch_name || !formData.ifsc_code) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    // Validate IFSC code format
    if (!profileService.validateIFSC(formData.ifsc_code)) {
      Alert.alert('Validation Error', 'Invalid IFSC code format. Example: SBIN0000123');
      return;
    }

    // Validate account number
    if (!profileService.validateAccountNumber(formData.account_number)) {
      Alert.alert('Validation Error', 'Account number should be between 8-18 digits');
      return;
    }

    try {
      setSaving(true);
      const clientId = user?.id;
      
      if (editingAccount) {
        // Update existing account
        await profileService.updateBankAccount(editingAccount.id, formData);
        Alert.alert('Success', 'Bank account updated successfully');
      } else {
        // Create new account
        const newAccount = await profileService.createBankAccount(formData);
        
        // Add to client's bank accounts
        if (clientId) {
          await profileService.addBankAccountToClient(clientId, newAccount.id);
        }
        Alert.alert('Success', 'Bank account added successfully');
      }

      setModalVisible(false);
      fetchBankAccounts();
    } catch (error: any) {
      console.error('Failed to save bank account:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save bank account';
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const getAccountTypeIcon = (type: string): keyof typeof MaterialIcons.glyphMap => {
    switch (type) {
      case 'Savings':
        return 'savings';
      case 'Current':
      default:
        return 'account-balance';
    }
  };

  const renderBankAccountItem = ({ item }: { item: BankAccount }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountTypeContainer}>
          <MaterialIcons 
            name={getAccountTypeIcon(item.account_type)} 
            size={24} 
            color={theme.colors.primary.main} 
          />
          <View style={styles.accountInfo}>
            <Text style={styles.bankName}>{item.bank_name}</Text>
            <Text style={styles.accountType}>{item.account_type} Account</Text>
          </View>
        </View>
        {item.is_primary && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryText}>Primary</Text>
          </View>
        )}
      </View>

      <View style={styles.accountDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Holder</Text>
          <Text style={styles.detailValue}>{item.account_holder_name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Number</Text>
          <Text style={styles.detailValue}>
            {item.account_number_masked || profileService.maskAccountNumber(item.account_number || '')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Branch</Text>
          <Text style={styles.detailValue}>{item.branch_name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>IFSC Code</Text>
          <Text style={styles.detailValue}>{item.ifsc_code}</Text>
        </View>

        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={[styles.detailValue, { color: item.is_active ? theme.colors.semantic.success : theme.colors.text.tertiary }]}>
            {item.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.accountActions}>
        {!item.is_primary && item.is_active && (
          <TouchableOpacity 
            style={styles.setPrimaryButton}
            onPress={() => handleSetPrimary(item)}
          >
            <Text style={styles.setPrimaryText}>Set as Primary</Text>
          </TouchableOpacity>
        )}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
            <Feather name="edit-2" size={18} color={theme.colors.primary.main} />
          </TouchableOpacity>
          {!item.is_primary && (
            <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
              <Feather name="trash-2" size={18} color={theme.colors.semantic.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>Loading bank accounts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bank Accounts</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Feather name="plus" size={20} color={theme.colors.text.onPrimary} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={bankAccounts}
        renderItem={renderBankAccountItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchBankAccounts();
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="account-balance-wallet" size={64} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyText}>No bank accounts found</Text>
            <Text style={styles.emptySubtext}>Add your first bank account to get started</Text>
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
                {editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} disabled={saving}>
                <Feather name="x" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Account Holder Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.account_holder_name || ''}
                  onChangeText={(text) => setFormData({ ...formData, account_holder_name: text })}
                  placeholder="Enter account holder name"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Account Number *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.account_number || ''}
                  onChangeText={(text) => setFormData({ ...formData, account_number: text })}
                  placeholder="Enter account number"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                  secureTextEntry={editingAccount ? true : false}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Bank Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bank_name || ''}
                  onChangeText={(text) => setFormData({ ...formData, bank_name: text })}
                  placeholder="Enter bank name"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Branch Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.branch_name || ''}
                  onChangeText={(text) => setFormData({ ...formData, branch_name: text })}
                  placeholder="Enter branch name"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>IFSC Code *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.ifsc_code || ''}
                  onChangeText={(text) => setFormData({ ...formData, ifsc_code: text.toUpperCase() })}
                  placeholder="Enter IFSC code (e.g., SBIN0000123)"
                  autoCapitalize="characters"
                  placeholderTextColor={theme.colors.text.tertiary}
                  editable={!saving}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Account Type *</Text>
                <View style={styles.typeSelector}>
                  {(['Savings', 'Current'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        formData.account_type === type && styles.typeOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, account_type: type })}
                      disabled={saving}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          formData.account_type === type && styles.typeOptionTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formSection}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Set as Primary Account</Text>
                  <Switch
                    value={formData.is_primary || false}
                    onValueChange={(value) => setFormData({ ...formData, is_primary: value })}
                    trackColor={{ 
                      false: theme.colors.border.primary, 
                      true: theme.colors.primary.main + '50' 
                    }}
                    thumbColor={formData.is_primary ? theme.colors.primary.main : theme.colors.background.primary}
                    disabled={saving}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Active Account</Text>
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
      </Modal>
    </View>
  );
};

export default BankAccounts;