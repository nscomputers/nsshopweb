import React, { useState } from 'react';
import { ShoppingCart, Eye, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  currency: string;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
  phone: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onAddToCart,
  onViewDetails,
  phone
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.startsWith('0') ? `94${cleanPhone.slice(1)}` : cleanPhone;
  const waMessage = encodeURIComponent(`Hi NS Computers! I have a question about ${product.name} (${currency}${product.price.toFixed(2)}). Is this available?`);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image Area */}
        <div className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80')}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Category Badge */}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold rounded-lg shadow-xs">
            {product.category}
          </span>

          {/* Featured pill if any */}
          {product.featured && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs">
              Top Pick
            </span>
          )}

          {/* Quick View Button overlay on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="absolute inset-x-4 bottom-3 py-2 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Specs & Details</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 
              onClick={() => onViewDetails(product)}
              className="font-bold text-slate-900 text-sm hover:text-blue-600 transition cursor-pointer line-clamp-1"
              title={product.name}
            >
              {product.name}
            </h3>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Key specs pills if provided */}
          {product.specs && product.specs.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.specs.slice(0, 2).map((s, idx) => (
                <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium truncate max-w-full">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Pricing & Actions */}
      <div className="p-4 pt-0 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between my-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              {currency}{product.price.toFixed(2)}
            </span>
          </div>

          <div className="text-right">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                <AlertCircle className="w-3 h-3" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {product.stock} in stock
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`col-span-4 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-98 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
              </>
            )}
          </button>

          {/* Quick WhatsApp Inquiry */}
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Ask about this product on WhatsApp"
            className="col-span-1 flex items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
