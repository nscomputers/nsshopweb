import React, { useState } from 'react';
import { X, ShoppingCart, MessageCircle, ShieldCheck, Check, Truck, Zap } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currency: string;
  onAddToCart: (p: Product, qty: number) => void;
  phone: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currency,
  onAddToCart,
  phone
}) => {
  if (!product) return null;

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.startsWith('0') ? `94${cleanPhone.slice(1)}` : cleanPhone;
  const waMessage = encodeURIComponent(
    `Hello NS Computers! I am inquiring about the ${product.name} (Code: ${product.id}) priced at ${currency}${product.price.toFixed(2)}. Is it in stock and can I arrange delivery?`
  );

  const isOutOfStock = product.stock <= 0;
  const maxAvailable = Math.max(1, product.stock);

  const handleAddToCart = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white flex items-center justify-center transition backdrop-blur-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Category banner */}
          <div className="relative bg-slate-900 aspect-square md:aspect-auto flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <span className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-lg">
              {product.category}
            </span>
          </div>

          {/* Details Column */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isOutOfStock 
                    ? 'bg-rose-100 text-rose-700' 
                    : product.stock <= 3 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : `${product.stock} Units Available`}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {product.id}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug mb-2">
                {product.name}
              </h2>

              <div className="text-2xl font-black text-blue-600 mb-4">
                {currency}{product.price.toFixed(2)}
              </div>

              <div className="border-t border-slate-100 pt-3 mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Technical Specifications */}
              {product.specs && product.specs.length > 0 && (
                <div className="border-t border-slate-100 pt-3 mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Specifications
                  </h4>
                  <ul className="space-y-1.5">
                    {product.specs.map((spec, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Store Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Genuine Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Islandwide Shipping</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              {!isOutOfStock && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-600">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty <= 1}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-40 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-800 bg-white min-w-[32px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(maxAvailable, qty + 1))}
                      disabled={qty >= maxAvailable}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-40 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Sold Out' : `Add ${qty > 1 ? `(${qty})` : ''} to Cart`}</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${waNumber}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Inquire</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
