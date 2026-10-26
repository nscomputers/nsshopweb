import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Laptop, ShieldCheck, Truck, Lock } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onSelectCategory: (cat: string) => void;
  onSwitchToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onSelectCategory,
  onSwitchToAdmin
}) => {
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.startsWith('0') ? `94${cleanPhone.slice(1)}` : cleanPhone;

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Store Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              <Laptop className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">{settings.storeName}</span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            Your trusted provider of high-performance gaming laptops, desktop components, peripherals, and official warranty electronics.
          </p>

          <div className="pt-1">
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-1.5 text-white font-bold bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800 transition"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">
            Popular Categories
          </h4>
          <ul className="space-y-1.5 text-xs">
            {['Laptops', 'Monitors', 'Gaming Peripherals', 'Components', 'Accessories'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => onSelectCategory(cat)}
                  className="hover:text-blue-400 transition"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Customer Care & Services */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">
            Customer Support
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{settings.email}</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                WhatsApp Direct Help
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Store Guarantees & Hours */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">
            Why Choose Us
          </h4>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Genuine Warranty on All Products</span>
            </li>
            <li className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Islandwide Doorstep Delivery</span>
            </li>
            <li className="text-slate-500 pt-1">
              Store Hours: Mon - Sat: 9:00 AM - 7:30 PM
            </li>
            <li className="text-slate-500">
              Payment: Cash on Delivery / Bank Transfer / Store POS
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
        <div>
          &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.
        </div>
        
        <div className="flex items-center gap-4">
          <span>Islandwide Delivery Available</span>
          <span>&bull;</span>
          <span>Helpline: {settings.phone}</span>
          <span>&bull;</span>
          {/* Subtle staff portal link */}
          <button
            onClick={onSwitchToAdmin}
            className="text-slate-600 hover:text-slate-400 flex items-center gap-1 transition"
            title="Store Administration"
          >
            <Lock className="w-3 h-3" />
            <span>Staff Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
