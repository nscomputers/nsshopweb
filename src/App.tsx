/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  Phone, 
  MessageCircle, 
  RotateCcw, 
  Search, 
  PackageSearch,
  CheckCircle2,
  AlertTriangle,
  Github,
  Cloud
} from 'lucide-react';
import { Product, Order, CartItem, StoreSettings } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AdminPortal } from './components/AdminPortal';
import { GitHubDeployModal } from './components/GitHubDeployModal';
import { Toast, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';

export default function App() {
  // Core Data State
  const [products, setProducts] = useState<Product[]>(() => StorageService.getLocalProducts());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getLocalOrders());
  const [settings, setSettings] = useState<StoreSettings>(() => StorageService.getLocalSettings());
  
  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ns_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Modal Views
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured');

  // Toast System
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: String(Date.now()), message, type });
  };

  // Save Cart to storage on change
  useEffect(() => {
    try {
      localStorage.setItem('ns_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Check cloud connection and setup real-time listener on mount
  useEffect(() => {
    const { db } = StorageService.initFirebase();
    if (db) {
      setIsCloudConnected(true);
      // Real-time synchronization
      const unsubscribe = StorageService.subscribeToCloudUpdates(
        (updatedProducts) => setProducts(updatedProducts),
        (updatedOrders) => setOrders(updatedOrders)
      );
      return () => unsubscribe();
    } else {
      setIsCloudConnected(false);
    }
  }, []);

  // Listen to cross-tab updates
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(StorageService.getLocalProducts());
    };
    const handleOrdersUpdate = () => {
      setOrders(StorageService.getLocalOrders());
    };
    const handleSettingsUpdate = () => {
      setSettings(StorageService.getLocalSettings());
    };

    window.addEventListener('ns_products_updated', handleProductsUpdate);
    window.addEventListener('ns_orders_updated', handleOrdersUpdate);
    window.addEventListener('ns_settings_updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('ns_products_updated', handleProductsUpdate);
      window.removeEventListener('ns_orders_updated', handleOrdersUpdate);
      window.removeEventListener('ns_settings_updated', handleSettingsUpdate);
    };
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      showToast('Item is out of stock', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.qty + quantity);
        if (newQty === existing.qty) {
          showToast(`Maximum available stock reached (${product.stock})`, 'info');
          return prev;
        }
        showToast(`Updated "${product.name}" in your cart`);
        return prev.map((item) => (item.id === product.id ? { ...item, qty: newQty } : item));
      } else {
        showToast(`Added "${product.name}" to your cart`);
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: Math.min(product.stock, quantity),
            maxStock: product.stock,
          },
        ];
      }
    });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            if (nextQty <= 0) return null;
            if (nextQty > item.maxStock) {
              showToast(`Only ${item.maxStock} units in stock`, 'info');
              return item;
            }
            return { ...item, qty: nextQty };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart');
  };

  // Order Fulfillment
  const handleOrderSuccess = async (order: Order) => {
    await StorageService.createOrder(order);
    setOrders(StorageService.getLocalOrders());
    setProducts(StorageService.getLocalProducts());
    setCart([]);
    setActiveInvoiceOrder(order);
    showToast(`Order #${order.id} placed successfully! Thank you!`);
  };

  // Category counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchPrice = p.price <= maxPrice;
        const query = searchQuery.trim().toLowerCase();
        const matchSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.specs && p.specs.some((s) => s.toLowerCase().includes(query)));

        return matchCategory && matchPrice && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // Featured first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, selectedCategory, maxPrice, searchQuery, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(3000);
    setSearchQuery('');
    setSortBy('featured');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
      {/* Navbar Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        settings={settings}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        {currentView === 'store' ? (
          <div>
            {/* Hero Banner */}
            <HeroBanner
              settings={settings}
              onExploreClick={() => {
                document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Catalog Grid Section */}
            <div id="product-catalog" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Left Filters Sidebar */}
              <aside className="space-y-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Filter className="w-4 h-4 text-blue-600" />
                      <span>Filters</span>
                    </h3>
                    {(selectedCategory !== 'All' || maxPrice < 3000 || searchQuery) && (
                      <button
                        onClick={resetAllFilters}
                        className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Hardware Category
                    </label>
                    <div className="space-y-1">
                      {Object.entries(categoriesWithCounts).map(([cat, count]) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span>{cat}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Slider */}
                  <div className="border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Max Budget
                      </label>
                      <span className="text-xs font-black text-blue-600 font-mono">
                        {settings.currency}{maxPrice}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="25"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
                      <span>{settings.currency}0</span>
                      <span>{settings.currency}1,500</span>
                      <span>{settings.currency}3,000</span>
                    </div>
                  </div>
                </div>

                {/* Direct Quote Card */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-5 rounded-3xl shadow-md space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/60 border border-blue-400/30 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Need a Custom Rig or Quote?</h4>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    Chat directly with NS Computers technicians for custom gaming PCs, corporate supply, or part availability.
                  </p>
                  <a
                    href={`tel:${settings.phone}`}
                    className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Call: {settings.phone}
                  </a>
                </div>
              </aside>

              {/* Right Products Catalog Area */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search & Sorting Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-900 text-sm">{filteredProducts.length}</span>
                    <span>products found</span>
                    {searchQuery && (
                      <span className="text-slate-400">for "{searchQuery}"</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <label htmlFor="sort-select" className="text-slate-400 font-semibold whitespace-nowrap">
                      Sort by:
                    </label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Product Name (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <PackageSearch className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">No hardware products found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      We couldn't find any products matching your filters. Try widening your price range or resetting filters.
                    </p>
                    <button
                      onClick={resetAllFilters}
                      className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        currency={settings.currency}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                        onViewDetails={(p) => setSelectedProduct(p)}
                        phone={settings.phone}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : (
          /* Admin Portal View */
          <AdminPortal
            products={products}
            orders={orders}
            settings={settings}
            isLoggedIn={isAdminLoggedIn}
            onLogin={() => setIsAdminLoggedIn(true)}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setCurrentView('store');
            }}
            onUpdateProducts={(prods) => setProducts(prods)}
            onUpdateOrders={(ords) => setOrders(ords)}
            onUpdateSettings={(sett) => setSettings(sett)}
            onViewInvoice={(order) => setActiveInvoiceOrder(order)}
            onShowToast={showToast}
            onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
            isCloudConnected={isCloudConnected}
            setIsCloudConnected={setIsCloudConnected}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentView('store');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onSwitchToAdmin={() => setCurrentView('admin')}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        currency={settings.currency}
        onAddToCart={handleAddToCart}
        phone={settings.phone}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currency={settings.currency}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        phone={settings.phone}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        currency={settings.currency}
        settings={settings}
        onOrderSuccess={handleOrderSuccess}
      />

      <InvoiceModal
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
        settings={settings}
        currency={settings.currency}
      />

      <GitHubDeployModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
