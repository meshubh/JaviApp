// app/services/OrderService.ts
import { apiClient } from './apiClient';

export interface Contract {
  id: string;
  contract_number: string;
  title: string;
  pricing_model: string;
  value: number;
  client: string;
  rate_per_box?: number;
  rate_per_bundle?: number;
  status: string;
}

export interface Address {
  id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  contact_person_name?: string;
  contact_person_phone?: string;
  is_active: boolean;
}

export interface OrderListItem {
  id: string;
  order_id: string;
  order_number: string;
  client_name: string;
  pickup_city: string;
  drop_city: string;
  pickup_address_text?: string;
  drop_address_text?: string;
  number_of_boxes: number;
  number_of_bundles: number;
  number_of_invoices: number;
  total_packages: number;
  status: string;
  priority: 'Normal' | 'Urgent' | 'High';
  created_at: string;
  expected_pickup_date?: string;
  expected_delivery_date?: string;
  order_amount?: number;
  cod_amount?: number;
  payment_mode: string;
  is_overdue?: boolean;
  time_since_creation?: string;
}

export interface OrderDetail extends OrderListItem {
  pickup_address: Address;
  drop_address: Address;
  contract: Contract;
  total_weight?: number;
  declared_value?: number;
  package_description?: string;
  special_instructions?: string;
  is_fragile: boolean;
  requires_signature: boolean;
  customer_phone?: string;
  customer_email?: string;
  internal_notes?: string;
  pickup_confirmed_at?: string;
  pickup_maps_url?: string;
  drop_maps_url?: string;
  pickup_completed_at?: string;
  delivery_attempted_at?: string;
  delivery_completed_at?: string;
  order_image_url?: string;
  delivery_proof_url?: string;
  status_timeline?: Array<{
    status: string;
    changed_at: string;
    reason: string;
  }>;
  latest_tracking?: {
    activity: string;
    timestamp: string;
    location_address?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface CreateOrderData {
  contract_id: string;
  pickup_address_id: string;
  drop_address_id?: string;
  drop_address_text?: string;
  drop_address_place_id?: string;
  number_of_boxes: number;
  number_of_bundles: number;
  number_of_invoices: number;
  expected_pickup_date: string;
  package_description?: string;
  special_instructions?: string;
  declared_value?: number;
  total_weight?: number;
  is_fragile?: boolean;
  requires_signature?: boolean;
  customer_phone?: string;
  customer_email?: string;
}

export interface OrderStats {
  total_orders: number;
  active_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_spent: number;
  this_month_orders: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DashboardStats {
  // Main stats
  total_orders: number;
  pending_orders: number;
  in_transit_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  
  // Trends
  orders_trend: number;
  pending_trend: number;
  
  // Time-based
  today_orders: number;
  this_week_orders: number;
  this_month_orders: number;
  
  // Financial
  total_revenue: number;
  pending_revenue: number;
  
  // Packages
  total_boxes: number;
  total_bundles: number;
  
  // Recent activity
  recent_activity: Array<{
    order_id: string;
    order_number: string;
    status: string;
    icon: string;
    icon_color: string;
    description: string;
    time_ago: string;
    created_at: string;
  }>;
  
  // Chart data
  monthly_trend: Array<{
    month: string;
    orders: number;
  }>;
  
  // Insights
  insights: {
    most_common_status: string;
    average_delivery_time: number | null;
    on_time_delivery_rate: number | null;
  };
}

class OrderService {
  // Client endpoints
  async getClientOrders(params?: {
    status?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<OrderListItem>> {
    const queryParams = new URLSearchParams();
    console.log('Fetching client orders with params:', params);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/v1/orders/client_orders${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<PaginatedResponse<OrderListItem>>(endpoint);
  }

  async getOrderDetail(orderId: string): Promise<OrderDetail> {
    return apiClient.get<OrderDetail>(`/api/v1/orders/${orderId}/client_order_detail`);
  }

  async createOrder(data: CreateOrderData): Promise<OrderDetail> {
    console.log('Creating order with data:', data);
    return apiClient.post<OrderDetail>('/api/v1/orders/client_create_order', data);
  }

  async cancelOrder(orderId: string, reason: string): Promise<OrderDetail> {
    return apiClient.post<OrderDetail>(
      `/api/v1/orders/${orderId}/client_cancel_order`,
      { cancellation_reason: reason }
    );
  }

  async getOrderStats(): Promise<OrderStats> {
    return apiClient.get<OrderStats>('/api/v1/orders/client_order_stats');
  }

  async getActiveContracts(): Promise<Contract[]> {
    return apiClient.get<Contract[]>('/api/v1/orders/client_contracts');
  }

  async getPickupAddresses(): Promise<Address[]> {
    return apiClient.get<Address[]>('/api/v1/orders/client_addresses');
  }

  // Helper methods
  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      'Created': '#6B7280',
      'Ready to Pick': '#3B82F6',
      'Picked': '#8B5CF6',
      'In Transit': '#F59E0B',
      'Out for Delivery': '#EF4444',
      'Delivered': '#10B981',
      'Cancelled': '#DC2626',
    };
    return statusColors[status] || '#6B7280';
  }

  getStatusIcon(status: string): string {
    const statusIcons: Record<string, string> = {
      'Created': 'file-text',
      'Ready to Pick': 'package',
      'Picked': 'check-circle',
      'In Transit': 'truck',
      'Out for Delivery': 'navigation',
      'Delivered': 'check-square',
      'Cancelled': 'x-circle',
    };
    return statusIcons[status] || 'info';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/api/v1/orders/client_dashboard_stats');
  }

  // Helper method to format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Helper to get trend indicator
  getTrendIndicator(trend: number): { icon: string; color: string; text: string } {
    if (trend > 0) {
      return {
        icon: 'trending-up',
        color: '#10B981',
        text: `+${trend.toFixed(1)}%`
      };
    } else if (trend < 0) {
      return {
        icon: 'trending-down',
        color: '#EF4444',
        text: `${trend.toFixed(1)}%`
      };
    } else {
      return {
        icon: 'minus',
        color: '#6B7280',
        text: '0%'
      };
    }
  }
}

export const orderService = new OrderService();