import React from 'react';
import { 
  Laptop, 
  ShoppingCart, 
  ShieldCheck, 
  Store, 
  Phone, 
  Search, 
  Truck, 
  Clock,
  X
} from 'lucide-react';
import { StoreSettings } from '../types';

interface NavbarProps {
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  settings: StoreSettings;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  settings,
  isAdminLoggedIn
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Customer Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <a 
              href={`tel:${settings.phone}`} 
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Call / WhatsApp: <strong className="text-white underline">{settings.phone}</strong></span>
            </a>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Islandwide Delivery Available</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Mon - Sat: 9:00 AM - 7:30 PM</span>
            </span>

            {/* If admin is currently logged in, show toggle back and forth */}
            {isAdminLoggedIn && (
              <div className="flex items-center gap-1 ml-2 border-l border-slate-700 pl-3">
                <button
                  onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
                  className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentView === 'store' ? 'Admin Portal' : 'View Storefront'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setCurrentView('store')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                NS <span className="text-blue-600">Computers</span>
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                & Electronics
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {settings.tagline || 'Tech Store & Service Hub'}
            </p>
          </div>
        </div>

        {/* Global Search Bar (Storefront View) */}
        {currentView === 'store' && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search laptops, components, monitors, accessories..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Action: Customer Cart Button */}
        <div className="flex items-center gap-3">
          {currentView === 'store' ? (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-medium text-sm group shadow-sm active:scale-98"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-white group-hover:scale-110 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-bold">
                Cart {cartCount > 0 ? `(${cartCount})` : ''} &bull; {settings.currency}{cartTotal.toFixed(2)}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('store')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              <Store className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
