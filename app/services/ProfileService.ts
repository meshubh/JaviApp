// app/services/ProfileService.ts
import { apiClient } from './apiClient';

// Client Profile Types
export interface ClientProfile {
  id: string;
  client_id: string;
  firm_name: string;
  gst_number: string;
  poc_name: string;
  poc_number: string;
  poc_email: string;
  secondary_poc_name?: string;
  secondary_poc_number?: string;
  secondary_poc_email?: string;
  status: string;
  business_type?: string;
  industry_sector?: string;
  company_size?: string;
  total_orders?: number;
  total_revenue?: number;
  onboarding_date: string;
  payment_terms?: number;
  credit_limit?: number;
  registered_address?: Address;
  pickup_locations?: Address[];
  contracts?: Contract[];
  bank_accounts?: BankAccount[];
  active_contracts?: Contract[];
  preferred_communication_method?: string;
  send_notifications?: boolean;
  send_marketing_emails?: boolean;
}

export interface Address {
  id: string;
  address_type: 'Registered' | 'Pickup' | 'Delivery' | 'Billing' | 'Office' | 'Warehouse';
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  name: string;
  number: string;
  contact_info?: string;
  postal_code: string;
  country: string;
  landmark?: string;
  is_active: boolean;
  created_at?: string;
  firm_name?: string;
  gst_number?: string;
}

export interface BankAccount {
  id: string;
  account_holder_name: string;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;
  swift_code?: string;
  account_type: 'Savings' | 'Current' | 'CC' | 'OD' | 'Business';
  account_number?: string;
  account_number_masked?: string;
  is_primary: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface Contract {
  id: string;
  contract_number: string;
  status: string;
  start_date: string;
  end_date?: string;
}

export interface DashboardStats {
  client: {
    name: string;
    id: string;
    status: string;
    member_since: string;
  };
  addresses: {
    total: number;
    active: number;
    has_primary: boolean;
  };
  bank_accounts: {
    total: number;
    verified: number;
    pending_verification: number;
    has_primary: boolean;
  };
  contracts: {
    total: number;
    active: number;
    expired: number;
  };
  financials: {
    credit_limit: number;
    payment_terms: string;
    total_revenue: number;
  };
}

export interface ClientNotification {
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  action?: string;
}

export interface NotificationsResponse {
  count: number;
  notifications: ClientNotification[];
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
}

// Update Payloads
export interface UpdateProfileData {
  poc_name?: string;
  poc_number?: string;
  poc_email?: string;
  secondary_poc_name?: string;
  secondary_poc_number?: string;
  secondary_poc_email?: string;
  preferred_communication_method?: string;
  send_notifications?: boolean;
  send_marketing_emails?: boolean;
  business_type?: string;
  industry_sector?: string;
  company_size?: string;
}

export interface CreateAddressData {
  address_type: 'Pickup' | 'Delivery' | 'Billing' | 'Office' | 'Warehouse' | 'Registered';
  name: string;
  number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  landmark?: string;
  is_active?: boolean;
  firm_name?: string;
  gst_number?: string;
}

export interface CreateBankAccountData {
  account_holder_name: string;
  account_number: string;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;
  swift_code?: string;
  account_type: 'Savings' | 'Current' | 'CC' | 'OD' | 'Business';
  is_primary?: boolean;
  is_active?: boolean;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface SupportRequestData {
  subject: string;
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  category?: 'general' | 'technical' | 'billing' | 'service';
}

class ProfileService {
  // ===== PROFILE ENDPOINTS =====
  
  async getClientProfile(): Promise<ClientProfile> {
    // Use the new client-specific endpoint
    return apiClient.get<ClientProfile>('/api/v1/client/profile/me');
  }

  async updateClientProfile(data: UpdateProfileData): Promise<ClientProfile> {
    // Use the new client profile update endpoint
    const response = await apiClient.patch<{ message: string; profile: ClientProfile }>(
      '/api/v1/client/profile/update_profile', 
      data
    );
    return response.profile;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    // Use the new client dashboard stats endpoint
    return apiClient.get<DashboardStats>('/api/v1/client/profile/dashboard_stats');
  }

  async getNotifications(): Promise<NotificationsResponse> {
    // Get client notifications
    return apiClient.get<NotificationsResponse>('/api/v1/client/profile/notifications');
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string; note?: string }> {
    // Change client password
    return apiClient.post<{ message: string; note?: string }>(
      '/api/v1/client/profile/change_password',
      data
    );
  }

  async requestSupport(data: SupportRequestData): Promise<{ message: string; ticket: SupportTicket }> {
    // Submit support request
    return apiClient.post<{ message: string; ticket: SupportTicket }>(
      '/api/v1/client/profile/request_support',
      data
    );
  }

  // ===== ADDRESS ENDPOINTS =====
  
  async getClientAddresses(): Promise<Address[]> {
    // Get all client addresses - updated to handle both response formats
    try {
      // First try the my_addresses endpoint
      const response = await apiClient.get<{ client: string; total: number; addresses: Address[] }>(
        '/api/v1/client/addresses/my_addresses'
      );
      return response.addresses;
    } catch (error) {
      // Fallback to the regular addresses endpoint
      return apiClient.get<Address[]>('/api/v1/addresses');
    }
  }

  async getAddressList(): Promise<Address[]> {
    // Get address list (paginated)
    return apiClient.get<Address[]>('/api/v1/client/addresses');
  }

  async getAddress(addressId: string): Promise<Address> {
    // Get specific address
    return apiClient.get<Address>(`/api/v1/client/addresses/${addressId}`);
  }

  async getPrimaryAddress(): Promise<Address | { message: string; address?: Address }> {
    // Get primary address
    return apiClient.get<Address | { message: string; address?: Address }>(
      '/api/v1/client/addresses/primary'
    );
  }

  async createAddress(data: CreateAddressData): Promise<Address> {
    // Create new address - use client endpoint
    return apiClient.post<Address>('/api/v1/client/addresses', data);
  }

  async updateAddress(addressId: string, data: Partial<CreateAddressData>): Promise<Address> {
    // Update address - use client endpoint
    return apiClient.patch<Address>(`/api/v1/client/addresses/${addressId}`, data);
  }

  async setPrimaryAddress(addressId: string): Promise<{ message: string; address: Address }> {
    // Set address as primary
    return apiClient.post<{ message: string; address: Address }>(
      `/api/v1/client/addresses/${addressId}/set_primary`,
      {}
    );
  }

  async deleteAddress(addressId: string): Promise<{ message: string }> {
    // Delete address permanently - use client endpoint
    return apiClient.delete<{ message: string }>(`/api/v1/client/addresses/${addressId}`);
  }

  async deactivateAddress(addressId: string): Promise<{ message: string }> {
    // Soft delete address (deactivate)
    return apiClient.delete<{ message: string }>(`/api/v1/client/addresses/${addressId}`);
  }

  // ===== BANK ACCOUNT ENDPOINTS =====
  
  async getClientBankAccounts(): Promise<BankAccount[]> {
    // Get all bank accounts with summary - updated to handle both response formats
    try {
      // First try the my_accounts endpoint
      const response = await apiClient.get<{
        client: string;
        summary: {
          total: number;
          verified: number;
          unverified: number;
          has_primary: boolean;
        };
        accounts: BankAccount[];
      }>('/api/v1/client/bank-accounts/my_accounts');
      return response.accounts;
    } catch (error) {
      // Fallback to get bank accounts for the client
      const profile = await this.getClientProfile();
      if (profile.bank_accounts) {
        return profile.bank_accounts;
      }
      // If no bank accounts in profile, return empty array
      return [];
    }
  }

  async getBankAccountsList(): Promise<BankAccount[]> {
    // Get bank accounts list (paginated)
    return apiClient.get<BankAccount[]>('/api/v1/client/bank-accounts');
  }

  async getBankAccount(accountId: string): Promise<BankAccount> {
    // Get specific bank account
    return apiClient.get<BankAccount>(`/api/v1/client/bank-accounts/${accountId}`);
  }

  async getVerifiedBankAccounts(): Promise<{ count: number; accounts: BankAccount[] }> {
    // Get only verified accounts
    return apiClient.get<{ count: number; accounts: BankAccount[] }>(
      '/api/v1/client/bank-accounts/verified'
    );
  }

  async getPrimaryBankAccount(): Promise<BankAccount | { message: string }> {
    // Get primary bank account
    return apiClient.get<BankAccount | { message: string }>(
      '/api/v1/client/bank-accounts/primary'
    );
  }

  async createBankAccount(data: CreateBankAccountData): Promise<BankAccount> {
    // Create new bank account - use client endpoint
    return apiClient.post<BankAccount>('/api/v1/client/bank-accounts', data);
  }

  async updateBankAccount(accountId: string, data: Partial<CreateBankAccountData>): Promise<BankAccount> {
    // Update bank account - use client endpoint
    return apiClient.patch<BankAccount>(`/api/v1/client/bank-accounts/${accountId}`, data);
  }

  async setPrimaryBankAccount(accountId: string): Promise<{ message: string; account: BankAccount }> {
    // Set bank account as primary - use client endpoint
    // First, unset all other primary accounts
    const accounts = await this.getClientBankAccounts();
    const updatePromises = accounts
      .filter(acc => acc.is_primary && acc.id !== accountId)
      .map(acc => apiClient.patch(`/api/v1/client/bank-accounts/${acc.id}`, { is_primary: false }));
    
    await Promise.all(updatePromises);

    // Then set this account as primary
    const account = await apiClient.patch<BankAccount>(`/api/v1/client/bank-accounts/${accountId}`, { is_primary: true });
    
    return { message: 'Primary bank account updated', account };
  }

  async checkVerificationStatus(accountId: string): Promise<{
    id: string;
    bank_name: string;
    account_number_masked: string;
    status: string;
    message: string;
  }> {
    // Check verification status of a bank account
    return apiClient.get(`/api/v1/client/bank-accounts/${accountId}/verification_status`);
  }

  async deleteBankAccount(accountId: string): Promise<{ message: string }> {
    // Delete bank account permanently - use client endpoint
    return apiClient.delete<{ message: string }>(`/api/v1/client/bank-accounts/${accountId}`);
  }

  async deactivateBankAccount(accountId: string): Promise<{ message: string }> {
    // Soft delete bank account (deactivate)
    return apiClient.delete<{ message: string }>(`/api/v1/client/bank-accounts/${accountId}`);
  }

  async addBankAccountToClient(clientId: string, bankAccountId: string): Promise<void> {
    // Add bank account to client's bank accounts list
    const client = await this.getClientProfile();
    const currentAccountIds = (client.bank_accounts || []).map(acc => acc.id);
    
    await apiClient.patch(`/api/v1/clients/${clientId}`, {
      bank_account_ids: [...currentAccountIds, bankAccountId],
    });
  }

  // ===== VALIDATION HELPERS =====
  
  validateGST(gst: string): boolean {
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstPattern.test(gst.toUpperCase());
  }

  validateIFSC(ifsc: string): boolean {
    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscPattern.test(ifsc.toUpperCase());
  }

  validateSWIFT(swift: string): boolean {
    const swiftPattern = /^[A-Z0-9]{8}([A-Z0-9]{3})?$/;
    return swiftPattern.test(swift.toUpperCase());
  }

  validatePhone(phone: string): boolean {
    const phonePattern = /^\+?[1-9]\d{9,14}$/;
    return phonePattern.test(phone);
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  validateAccountNumber(accountNumber: string): boolean {
    return accountNumber.length >= 8 && accountNumber.length <= 18 && /^\d+$/.test(accountNumber);
  }

  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber || accountNumber.length < 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  }

  // ===== HELPER METHODS =====
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getPasswordHint(gstNumber: string, phoneNumber: string): string {
    if (!gstNumber || !phoneNumber) return '';
    return `${gstNumber}${phoneNumber.slice(-5)}`;
  }
}

export const profileService = new ProfileService();