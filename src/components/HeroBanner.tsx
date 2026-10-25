import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  Cpu, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroBannerProps {
  settings: StoreSettings;
  onExploreClick: () => void;
  isCloudConnected: boolean;
  onOpenDeployGuide: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  onExploreClick,
  isCloudConnected,
  onOpenDeployGuide
}) => {
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  // Format for Sri Lanka international WhatsApp if starts with 07: e.g. 0717592590 -> 94717592590
  const whatsappNumber = cleanPhone.startsWith('0') ? `94${cleanPhone.slice(1)}` : cleanPhone;

  return (
    <div className="space-y-6 mb-8">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        {/* Background glow decoration */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-400/30">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Official Computer & Electronics Store
            </span>
            <button
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium rounded-full border border-white/15 transition cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span>{isCloudConnected ? 'Cloud Sync Active' : 'Permanent Save & GitHub Pages Ready'}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-3">
            High Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">Hardware & Rigs</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
            Upgrade your battlestation and productivity setup. Premier source for genuine gaming laptops, RTX GPUs, high-refresh monitors, and computer accessories.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello NS Computers! I'm interested in ordering hardware/laptops.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Store: {settings.phone}</span>
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-md transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call Helpline</span>
            </a>

            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm rounded-xl border border-slate-700 transition backdrop-blur-sm"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative Watermark Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block text-slate-300">
          <Cpu className="w-64 h-64" />
        </div>
      </div>

      {/* Trust Badges Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Genuine Tech</h4>
            <p className="text-[11px] text-slate-500">Verified manufacturer stock</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Official Warranty</h4>
            <p className="text-[11px] text-slate-500">Comprehensive hardware cover</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Islandwide Dispatch</h4>
            <p className="text-[11px] text-slate-500">Cash on delivery available</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Custom Rigs & Builds</h4>
            <p className="text-[11px] text-slate-500">Call for tailored specs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
