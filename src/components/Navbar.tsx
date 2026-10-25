import React from 'react';
import { 
  Laptop, 
  ShoppingCart, 
  ShieldCheck, 
  Store, 
  Phone, 
  Search, 
  Truck, 
  Cloud, 
  CloudOff,
  Github,
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
  isCloudConnected: boolean;
  isAdminLoggedIn: boolean;
  onOpenDeployGuide: () => void;
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
  isCloudConnected,
  isAdminLoggedIn,
  onOpenDeployGuide
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Info Bar */}
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
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Islandwide Fast Courier Delivery</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Cloud Status indicator */}
            <div 
              title={isCloudConnected ? "Real-time Cloud Database Active" : "Local Storage Active (Connect Cloud in Admin to sync across devices)"}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                isCloudConnected 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {isCloudConnected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <Cloud className="w-3 h-3 text-emerald-400" />
                  <span>Cloud Synced</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <CloudOff className="w-3 h-3 text-amber-400" />
                  <span>Local Mode</span>
                </>
              )}
            </div>

            <button
              onClick={onOpenDeployGuide}
              className="hidden sm:flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded border border-slate-700 transition"
              title="GitHub Pages Deployment Guide"
            >
              <Github className="w-3 h-3 text-sky-400" />
              <span>GitHub Pages</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Switch Views */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentView('store')}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition flex items-center gap-1 ${
                  currentView === 'store'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Store</span>
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition flex items-center gap-1 ${
                  currentView === 'admin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
              </button>
            </div>
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
                placeholder="Search laptops, components, monitors, RTX GPUs..."
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

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {currentView === 'store' ? (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition font-medium text-sm group shadow-xs"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-extrabold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                {settings.currency}{cartTotal.toFixed(2)}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('store')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
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
