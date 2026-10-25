import { Product, Order, StoreSettings, FirebaseConfig, SyncStatus } from '../types';
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from '../data/defaultProducts';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';

const STORAGE_KEYS = {
  PRODUCTS: 'ns_products_v2',
  ORDERS: 'ns_orders_v2',
  SETTINGS: 'ns_settings_v2',
  FIREBASE_CONFIG: 'ns_firebase_config_v2',
  CART: 'ns_cart_v2',
};

// Singleton references
let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let syncListeners: (() => void)[] = [];

export class StorageService {
  // Products
  static getLocalProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading products from localStorage:', e);
    }
    // Fallback to default products & save
    this.saveLocalProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  }

  static saveLocalProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      // Dispatch custom event for reactive tabs
      window.dispatchEvent(new Event('ns_products_updated'));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }

  // Orders
  static getLocalOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading orders from localStorage:', e);
    }
    return [];
  }

  static saveLocalOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      window.dispatchEvent(new Event('ns_orders_updated'));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }

  // Settings
  static getLocalSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        delete (parsed as any).adminPasswordHash;
        delete (parsed as any).password;
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Error reading settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  }

  static saveLocalSettings(settings: StoreSettings): void {
    try {
      const safeSettings = { ...settings };
      delete (safeSettings as any).adminPasswordHash;
      delete (safeSettings as any).password;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(safeSettings));
      window.dispatchEvent(new Event('ns_settings_updated'));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  // Firebase Config
  static getFirebaseConfig(): FirebaseConfig | null {
    // Check localStorage first
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && parsed.projectId) return parsed;
      }
    } catch (e) {
      console.warn('Error reading firebase config:', e);
    }

    // Check Vite env vars if present
    const envApiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY;
    const envProjectId = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID;
    if (envApiKey && envProjectId) {
      return {
        apiKey: envApiKey,
        authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
        projectId: envProjectId,
        storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
        messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '',
      };
    }

    return null;
  }

  static saveFirebaseConfig(config: FirebaseConfig | null): void {
    try {
      if (config && config.apiKey && config.projectId) {
        localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(config));
      } else {
        localStorage.removeItem(STORAGE_KEYS.FIREBASE_CONFIG);
      }
      this.initFirebase();
      window.dispatchEvent(new Event('ns_firebase_config_updated'));
    } catch (e) {
      console.error('Error saving firebase config:', e);
    }
  }

  // Initialize Firebase client
  static initFirebase(): { db: Firestore | null; error?: string } {
    const config = this.getFirebaseConfig();
    if (!config || !config.apiKey || !config.projectId) {
      firestoreDb = null;
      firebaseApp = null;
      return { db: null };
    }

    try {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(config);
      } else {
        firebaseApp = getApp();
      }
      firestoreDb = getFirestore(firebaseApp);
      return { db: firestoreDb };
    } catch (err: any) {
      console.error('Firebase initialization error:', err);
      return { db: null, error: err.message || 'Failed to initialize Firebase' };
    }
  }

  static isCloudConnected(): boolean {
    return firestoreDb !== null;
  }

  // Push local products & orders to Firestore
  static async syncToCloud(): Promise<{ success: boolean; count: number; error?: string }> {
    const { db, error } = this.initFirebase();
    if (!db) {
      return { success: false, count: 0, error: error || 'Firebase is not configured' };
    }

    try {
      const products = this.getLocalProducts();
      const orders = this.getLocalOrders();

      const batch = writeBatch(db);

      // Save all products
      products.forEach((p) => {
        const ref = doc(db, 'products', p.id);
        batch.set(ref, p, { merge: true });
      });

      // Save all orders
      orders.forEach((o) => {
        const ref = doc(db, 'orders', o.id);
        batch.set(ref, o, { merge: true });
      });

      await batch.commit();
      return { success: true, count: products.length + orders.length };
    } catch (err: any) {
      console.error('Cloud upload error:', err);
      return { success: false, count: 0, error: err.message };
    }
  }

  // Pull all data from Firestore to replace/merge with local
  static async pullFromCloud(): Promise<{ success: boolean; products: Product[]; orders: Order[]; error?: string }> {
    const { db, error } = this.initFirebase();
    if (!db) {
      return { success: false, products: [], orders: [], error: error || 'Firebase not configured' };
    }

    try {
      // Fetch products
      const prodSnap = await getDocs(collection(db, 'products'));
      const cloudProducts: Product[] = [];
      prodSnap.forEach((d) => cloudProducts.push(d.data() as Product));

      // Fetch orders
      const orderSnap = await getDocs(collection(db, 'orders'));
      const cloudOrders: Order[] = [];
      orderSnap.forEach((d) => cloudOrders.push(d.data() as Order));

      if (cloudProducts.length > 0) {
        this.saveLocalProducts(cloudProducts);
      }

      if (cloudOrders.length > 0) {
        cloudOrders.sort((a, b) => b.timestamp - a.timestamp);
        this.saveLocalOrders(cloudOrders);
      }

      return {
        success: true,
        products: cloudProducts.length > 0 ? cloudProducts : this.getLocalProducts(),
        orders: cloudOrders.length > 0 ? cloudOrders : this.getLocalOrders(),
      };
    } catch (err: any) {
      console.error('Cloud pull error:', err);
      return { success: false, products: [], orders: [], error: err.message };
    }
  }

  // Save product to Local and Cloud simultaneously
  static async saveProduct(product: Product): Promise<void> {
    const products = this.getLocalProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.saveLocalProducts(products);

    // If cloud connected, update in background
    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'products', product.id), product, { merge: true });
      } catch (e) {
        console.warn('Failed to sync product to cloud:', e);
      }
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    const products = this.getLocalProducts().filter((p) => p.id !== id);
    this.saveLocalProducts(products);

    if (firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, 'products', id));
      } catch (e) {
        console.warn('Failed to delete product in cloud:', e);
      }
    }
  }

  // Place/save order
  static async createOrder(order: Order): Promise<void> {
    const orders = this.getLocalOrders();
    orders.unshift(order);
    this.saveLocalOrders(orders);

    // Deduct stock locally
    const products = this.getLocalProducts();
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.qty);
      }
    });
    this.saveLocalProducts(products);

    // Update cloud if connected
    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'orders', order.id), order);
        for (const item of order.items) {
          const prod = products.find((p) => p.id === item.id);
          if (prod) {
            await setDoc(doc(firestoreDb, 'products', prod.id), { stock: prod.stock }, { merge: true });
          }
        }
      } catch (e) {
        console.warn('Failed to sync order to cloud:', e);
      }
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orders = this.getLocalOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      this.saveLocalOrders(orders);
    }

    if (firestoreDb) {
      try {
        await updateDoc(doc(firestoreDb, 'orders', orderId), { status });
      } catch (e) {
        console.warn('Failed to sync order status update:', e);
      }
    }
  }

  // Subscribe to real-time cloud changes
  static subscribeToCloudUpdates(onProductsChange: (products: Product[]) => void, onOrdersChange: (orders: Order[]) => void): () => void {
    const { db } = this.initFirebase();
    if (!db) return () => {};

    // Clear any previous listeners
    syncListeners.forEach((unsub) => unsub());
    syncListeners = [];

    try {
      const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const prods: Product[] = [];
          snapshot.forEach((d) => prods.push(d.data() as Product));
          this.saveLocalProducts(prods);
          onProductsChange(prods);
        }
      });
      syncListeners.push(unsubProducts);

      const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        if (!snapshot.empty) {
          const ords: Order[] = [];
          snapshot.forEach((d) => ords.push(d.data() as Order));
          ords.sort((a, b) => b.timestamp - a.timestamp);
          this.saveLocalOrders(ords);
          onOrdersChange(ords);
        }
      });
      syncListeners.push(unsubOrders);

      return () => {
        unsubProducts();
        unsubOrders();
      };
    } catch (e) {
      console.warn('Error setting up real-time listener:', e);
      return () => {};
    }
  }

  // Database Backup (JSON Export)
  static exportFullBackup(): void {
    const dump = {
      exportDate: new Date().toISOString(),
      store: 'NS Computers & Electronics',
      settings: this.getLocalSettings(),
      products: this.getLocalProducts(),
      orders: this.getLocalOrders(),
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ns_computers_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Database Restore (JSON Import)
  static importFullBackup(jsonContent: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed) throw new Error('Invalid JSON');

      if (Array.isArray(parsed.products)) {
        this.saveLocalProducts(parsed.products);
      }
      if (Array.isArray(parsed.orders)) {
        this.saveLocalOrders(parsed.orders);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveLocalSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }

      return {
        success: true,
        message: `Restored ${parsed.products?.length || 0} products, ${parsed.orders?.length || 0} orders successfully!`,
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to parse backup JSON' };
    }
  }

  // Export CSV
  static exportProductsCSV(): void {
    const products = this.getLocalProducts();
    const headers = ['id', 'name', 'category', 'price', 'stock', 'description', 'image'];
    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      p.price,
      p.stock,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      `"${p.image || ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ns_products_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static exportOrdersCSV(): void {
    const orders = this.getLocalOrders();
    const headers = ['id', 'date', 'customerName', 'phone', 'email', 'total', 'paymentMethod', 'status', 'itemCount'];
    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${o.date}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${(o.phone || '').replace(/"/g, '""')}"`,
      `"${(o.email || '').replace(/"/g, '""')}"`,
      o.total,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      o.items?.reduce((s, i) => s + i.qty, 0) || 0,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ns_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
