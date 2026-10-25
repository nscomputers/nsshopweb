export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  specs?: string[];
  featured?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  maxStock: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  timestamp: number;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'Card Payment at Store';
  items: {
    id: string;
    name: string;
    price: number;
    qty: number;
    image: string;
  }[];
  total: number;
  status: OrderStatus;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  announcement: string;
  adminUsername: string;
  adminPasswordHash: string; // or plain text for local validation
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'connected' | 'error' | 'offline';
