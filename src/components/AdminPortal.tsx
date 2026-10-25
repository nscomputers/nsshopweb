import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Package, 
  Receipt, 
  Cloud, 
  Github, 
  Settings as SettingsIcon, 
  Plus, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  MessageCircle, 
  Check, 
  AlertTriangle, 
  RotateCcw, 
  DollarSign, 
  Boxes, 
  LogOut,
  RefreshCw,
  ExternalLink,
  Save,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Product, Order, StoreSettings, FirebaseConfig, OrderStatus } from '../types';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts';
import { StorageService } from '../services/storage';

interface AdminPortalProps {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onViewInvoice: (order: Order) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenDeployGuide: () => void;
  isCloudConnected: boolean;
  setIsCloudConnected: (connected: boolean) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  orders,
  settings,
  isLoggedIn,
  onLogin,
  onLogout,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateSettings,
  onViewInvoice,
  onShowToast,
  onOpenDeployGuide,
  isCloudConnected,
  setIsCloudConnected,
}) => {
  // Login State
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('DsL5151#');
  const [loginError, setLoginError] = useState(false);

  // Admin Tab State
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'cloud' | 'github' | 'settings'>('inventory');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    category: 'Laptops',
    price: 0,
    stock: 5,
    image: '',
    description: '',
    specs: '',
    featured: false
  });

  // Orders Filter
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('All');
  const [inventorySearch, setInventorySearch] = useState('');

  // Firebase Config State
  const [fbConfig, setFbConfig] = useState<FirebaseConfig>(() => {
    return StorageService.getFirebaseConfig() || {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    };
  });
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      usernameInput === settings.adminUsername &&
      (passwordInput === settings.adminPasswordHash || passwordInput === 'DsL5151#')
    ) {
      setLoginError(false);
      onLogin();
      onShowToast('Welcome to NS Computers Admin Dashboard!');
    } else {
      setLoginError(true);
    }
  };

  // Open Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      id: `prod-${Date.now()}`,
      name: '',
      category: 'Laptops',
      price: 99.99,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
      description: '',
      specs: '',
      featured: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      image: p.image,
      description: p.description,
      specs: p.specs ? p.specs.join('\n') : '',
      featured: !!p.featured
    });
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const specsList = productForm.specs
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const savedProduct: Product = {
      id: productForm.id || `prod-${Date.now()}`,
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      image: productForm.image.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      description: productForm.description.trim(),
      specs: specsList.length > 0 ? specsList : undefined,
      featured: productForm.featured
    };

    await StorageService.saveProduct(savedProduct);
    onUpdateProducts(StorageService.getLocalProducts());
    setIsProductModalOpen(false);
    onShowToast(`Product "${savedProduct.name}" saved successfully!`);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the inventory?`)) {
      await StorageService.deleteProduct(id);
      onUpdateProducts(StorageService.getLocalProducts());
      onShowToast(`Product deleted`);
    }
  };

  // Order Status Change
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await StorageService.updateOrderStatus(orderId, newStatus);
    onUpdateOrders(StorageService.getLocalOrders());
    onShowToast(`Order ${orderId} marked as ${newStatus}`);
  };

  // Save Firebase Config
  const handleSaveFirebaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncingCloud(true);
    StorageService.saveFirebaseConfig(fbConfig);

    const { db, error } = StorageService.initFirebase();
    if (db) {
      setIsCloudConnected(true);
      onShowToast('Firebase Firestore Connected Successfully!');
    } else {
      setIsCloudConnected(false);
      onShowToast(error || 'Failed to connect with provided config', 'error');
    }
    setIsSyncingCloud(false);
  };

  const handlePushToCloud = async () => {
    setIsSyncingCloud(true);
    const res = await StorageService.syncToCloud();
    setIsSyncingCloud(false);
    if (res.success) {
      onShowToast(`Uploaded ${res.count} items/orders to Firestore!`);
    } else {
      onShowToast(res.error || 'Upload failed', 'error');
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncingCloud(true);
    const res = await StorageService.pullFromCloud();
    setIsSyncingCloud(false);
    if (res.success) {
      onUpdateProducts(res.products);
      onUpdateOrders(res.orders);
      onShowToast(`Synchronized ${res.products.length} products and ${res.orders.length} orders from Cloud!`);
    } else {
      onShowToast(res.error || 'Failed to pull cloud data', 'error');
    }
  };

  const handleDisconnectCloud = () => {
    StorageService.saveFirebaseConfig(null);
    setIsCloudConnected(false);
    onShowToast('Cloud synchronization disconnected. Reverted to Local storage.');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoreSettings = {
      ...settingsForm,
      adminPasswordHash: newAdminPassword.trim() || settingsForm.adminPasswordHash
    };
    StorageService.saveLocalSettings(updated);
    onUpdateSettings(updated);
    setNewAdminPassword('');
    onShowToast('Store settings updated successfully!');
  };

  // Backup & Import
  const handleExportDatabase = () => {
    StorageService.exportFullBackup();
    onShowToast('Complete database downloaded as JSON backup');
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importFullBackup(content);
      if (res.success) {
        onUpdateProducts(StorageService.getLocalProducts());
        onUpdateOrders(StorageService.getLocalOrders());
        onUpdateSettings(StorageService.getLocalSettings());
        onShowToast(res.message);
      } else {
        onShowToast(res.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockItems = products.filter(p => p.stock <= 3);

  // Filtered lists
  const filteredProducts = products.filter(p => {
    return p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
           p.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
           p.id.toLowerCase().includes(inventorySearch.toLowerCase());
  });

  const filteredOrders = orders.filter(o => {
    if (orderFilterStatus === 'All') return true;
    return o.status === orderFilterStatus;
  });

  // IF NOT LOGGED IN -> RENDER LOGIN FORM
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">NS Computers Admin Access</h2>
          <p className="text-xs text-slate-500 mt-1">
            Store & Cloud Inventory Management Portal
          </p>

          <div className="mt-3 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100 text-[11px] text-blue-900">
            <span>Default credentials from source:</span>
            <div className="font-mono mt-0.5">
              User: <strong className="text-blue-700">admin</strong> &bull; Pass: <strong className="text-blue-700">DsL5151#</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Username</label>
            <input
              type="text"
              required
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Admin Password</label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {loginError && (
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-2 border border-rose-200">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Invalid username or password. Please use admin / DsL5151#</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition"
          >
            Log In to Admin Dashboard
          </button>
        </form>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Admin & Cloud Management Portal
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
              NS Computers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Helpline: <strong className="text-slate-800">{settings.phone}</strong> &bull; Permanent Database: <span className={isCloudConnected ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>{isCloudConnected ? "Cloud Sync (Firestore Active)" : "Local Storage Mode"}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenDeployGuide}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Github className="w-4 h-4 text-sky-400" />
            <span>GitHub Pages Guide</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {settings.currency}{totalRevenue.toFixed(2)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Across {orders.length} orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Orders</span>
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {orders.length}
          </p>
          <span className="text-[11px] text-blue-600 font-medium">
            {orders.filter(o => o.status === 'Pending').length} pending dispatch
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Items</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {products.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Live store items</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className={`text-2xl font-black ${lowStockItems.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {lowStockItems.length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Items need restock</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'inventory' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Product Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'orders' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'cloud' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Cloud & Permanent Save</span>
          {isCloudConnected && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
        </button>

        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'github' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Github className="w-4 h-4" />
          <span>GitHub Pages Hosting</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'settings' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Store Settings & Backup</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Inventory Items</h3>
              <p className="text-xs text-slate-500">Add, edit stock, prices, or export to CSV</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenAddProduct}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              <button
                onClick={() => StorageService.exportProductsCSV()}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportDatabase}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>

              <label className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 cursor-pointer transition flex items-center gap-1.5">
                <Upload className="w-4 h-4" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportDatabase}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Search Inventory */}
          <div className="max-w-md">
            <input
              type="text"
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              placeholder="Filter products by name, category, or ID..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {p.category}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {settings.currency}{p.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                        p.stock <= 0
                          ? 'bg-rose-100 text-rose-700'
                          : p.stock <= 3
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="px-2.5 py-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg font-semibold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="px-2.5 py-1 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg font-semibold transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Customer Orders</h3>
              <p className="text-xs text-slate-500">Review pending orders, print invoices, and update shipping progress</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => StorageService.exportOrdersCSV()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Orders CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold mr-1">Filter:</span>
            {['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderFilterStatus(st)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  orderFilterStatus === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Info</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No orders found matching status "{orderFilterStatus}".
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const cleanPhone = o.phone.replace(/[^0-9]/g, '');
                    const waNum = cleanPhone.startsWith('0') ? `94${cleanPhone.slice(1)}` : cleanPhone;

                    return (
                      <tr key={o.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-blue-600 block">{o.id}</span>
                          <span className="text-[11px] text-slate-400">{o.date}</span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{o.customerName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <a
                              href={`tel:${o.phone}`}
                              className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                            >
                              <Phone className="w-3 h-3" /> {o.phone}
                            </a>
                            <a
                              href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Hello ${o.customerName}, this is NS Computers regarding your order ${o.id}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 hover:underline flex items-center gap-0.5"
                            >
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </a>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{o.address}</p>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-extrabold text-slate-900 block">
                            {settings.currency}{o.total.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {o.items?.reduce((s, i) => s + i.qty, 0) || 0} items
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {o.paymentMethod}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                              o.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : o.status === 'Shipped'
                                ? 'bg-blue-50 text-blue-700 border-blue-300'
                                : o.status === 'Processing'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                : o.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                : 'bg-amber-50 text-amber-700 border-amber-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onViewInvoice(o)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CLOUD PERSISTENCE (FIREBASE) */}
      {activeTab === 'cloud' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Permanent Cloud Storage & Live Multi-Device Sync
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Connect a free Firebase Firestore project to synchronize products and orders in real-time across all devices on GitHub Pages.
            </p>
          </div>

          {/* Status Alert */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isCloudConnected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isCloudConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-sm">
                {isCloudConnected ? "Real-time Cloud Database is ACTIVE" : "Operating in Local Storage Mode"}
              </h4>
              <p>
                {isCloudConnected
                  ? "Orders placed by any customer on your GitHub Pages site are saved straight to Firestore and reflected on your dashboard instantly."
                  : "Changes are currently saved only to your local browser. To share catalog edits and receive orders globally on GitHub Pages, connect Firebase Firestore below."}
              </p>
            </div>
          </div>

          {/* Cloud Sync Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handlePushToCloud}
              disabled={isSyncingCloud || !isCloudConnected}
              className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-left hover:bg-blue-100 transition disabled:opacity-50"
            >
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Push Local Data to Cloud</span>
              </div>
              <p className="text-[11px] text-blue-600">
                Uploads all local products & orders to Firestore database.
              </p>
            </button>

            <button
              onClick={handlePullFromCloud}
              disabled={isSyncingCloud || !isCloudConnected}
              className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 text-left hover:bg-purple-100 transition disabled:opacity-50"
            >
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <RefreshCw className={`w-4 h-4 text-purple-600 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                <span>Pull from Cloud Database</span>
              </div>
              <p className="text-[11px] text-purple-600">
                Downloads the latest orders & inventory from Firestore to this device.
              </p>
            </button>
          </div>

          {/* Firebase Credentials Form */}
          <form onSubmit={handleSaveFirebaseConfig} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">Firebase Firestore Configuration:</h4>
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Free Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">API Key</label>
                <input
                  type="text"
                  value={fbConfig.apiKey}
                  onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Project ID</label>
                <input
                  type="text"
                  value={fbConfig.projectId}
                  onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                  placeholder="ns-computers-12345"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Auth Domain (Optional)</label>
                <input
                  type="text"
                  value={fbConfig.authDomain}
                  onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value })}
                  placeholder="ns-computers.firebaseapp.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">App ID (Optional)</label>
                <input
                  type="text"
                  value={fbConfig.appId}
                  onChange={(e) => setFbConfig({ ...fbConfig, appId: e.target.value })}
                  placeholder="1:12345:web:abcdef"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSyncingCloud}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save & Test Connection</span>
              </button>

              {isCloudConnected && (
                <button
                  type="button"
                  onClick={handleDisconnectCloud}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition"
                >
                  Disconnect Cloud
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: GITHUB PAGES DEPLOYMENT */}
      {activeTab === 'github' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-600">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Github className="w-5 h-5 text-sky-500" />
                <span>Host on GitHub Pages (Publicly Accessible)</span>
              </h3>
              <p className="text-slate-500 mt-1">
                Your repository is already pre-configured with <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-600">.github/workflows/deploy.yml</code> and relative base path <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-600">base: './'</code>.
              </p>
            </div>

            <button
              onClick={onOpenDeployGuide}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-xs"
            >
              Open Interactive Guide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">1</span>
              <h4 className="font-bold text-slate-900">Create GitHub Repo</h4>
              <p className="text-slate-500 text-[11px]">
                Create a public repository at <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">github.com/new</a>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <h4 className="font-bold text-slate-900">Push Workspace</h4>
              <p className="text-slate-500 text-[11px]">
                Push your code using <code className="bg-slate-100 px-1 rounded font-mono">git push -u origin main</code>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <h4 className="font-bold text-slate-900">Enable Pages</h4>
              <p className="text-slate-500 text-[11px]">
                In Repo Settings &rarr; Pages &rarr; Source, pick <strong>GitHub Actions</strong>. It will deploy automatically!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STORE SETTINGS & BACKUP */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Store Settings & Database Backup</h3>
            <p className="text-xs text-slate-500 mt-1">Configure business phone, address, currency, and download safety backups</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Store Helpline / WhatsApp</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold text-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Physical Address</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Change Admin Password</label>
              <input
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </form>

          {/* Database Backup & Factory Reset */}
          <div className="pt-6 border-t border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Database Maintenance & Backups:</h4>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportDatabase}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Full Database Backup (JSON)</span>
              </button>

              <label className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 cursor-pointer transition flex items-center gap-1.5">
                <Upload className="w-4 h-4" />
                <span>Restore Database from Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportDatabase}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  if (window.confirm('Reset all catalog products to standard factory defaults? Your custom changes will be overwritten.')) {
                    StorageService.saveLocalProducts(DEFAULT_PRODUCTS as any);
                    onUpdateProducts(StorageService.getLocalProducts());
                    onShowToast('Products reset to factory defaults!');
                  }
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Catalog</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 my-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
              >
                <RotateCcw className="w-4 h-4 hidden" />
                &times;
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. ASUS ROG Strix Gaming Laptop"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    list="cat-options"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                  <datalist id="cat-options">
                    <option value="Laptops" />
                    <option value="Monitors" />
                    <option value="Gaming Peripherals" />
                    <option value="Components" />
                    <option value="Accessories" />
                  </datalist>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ({settings.currency}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="font-bold text-slate-700">Mark as Top Pick</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Key Specs (One per line)
                </label>
                <textarea
                  rows={3}
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  placeholder="Intel i7 13th Gen&#10;16GB DDR5 RAM&#10;1TB NVMe SSD"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
