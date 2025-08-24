// app/types/order.ts
export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  amount: string;
  items?: OrderItem[];
  address?: Address;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}