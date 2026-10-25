import React from 'react';
import { X, Printer, CheckCircle2, MessageCircle, Phone, Download } from 'lucide-react';
import { Order, StoreSettings } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
  settings: StoreSettings;
  currency: string;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  onClose,
  settings,
  currency
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.startsWith('0') ? `94${cleanPhone.slice(1)}` : cleanPhone;
  const waReceiptText = encodeURIComponent(
    `Hello NS Computers! Here is my Order Confirmation:\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nTotal: ${currency}${order.total.toFixed(2)}\nPayment: ${order.paymentMethod}\nStatus: ${order.status}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions (Hidden in print) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Order Invoice</h3>
              <p className="text-[11px] text-slate-500">Order ID: <span className="font-mono font-bold text-blue-600">{order.id}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <a
              href={`https://wa.me/${waNumber}?text=${waReceiptText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {settings.storeName}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {settings.tagline}
              </p>
              <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                <p><strong className="text-slate-800">Helpline:</strong> {settings.phone}</p>
                <p><strong className="text-slate-800">Email:</strong> {settings.email}</p>
                <p><strong className="text-slate-800">Address:</strong> {settings.address}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-mono font-bold text-xs rounded-lg border border-blue-200 mb-2">
                {order.id}
              </span>
              <p className="text-xs text-slate-500">
                <strong>Date:</strong> {order.date}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                <strong>Status:</strong>{' '}
                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[10px] uppercase">
                  {order.status}
                </span>
              </p>
            </div>
          </div>

          {/* Customer & Delivery Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                Customer Details
              </p>
              <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
              <p className="text-slate-600 mt-0.5 flex items-center gap-1">
                <span>Tel:</span> <strong>{order.phone}</strong>
              </p>
              <p className="text-slate-600 mt-0.5">Email: {order.email}</p>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                Shipping & Payment
              </p>
              <p className="text-slate-700 font-medium leading-relaxed">
                {order.address}
              </p>
              <p className="mt-2 text-slate-800">
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              {order.notes && (
                <p className="mt-1 text-slate-500 italic">
                  Note: {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                  <th className="py-2.5 px-4">Item & Description</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold">
                      {item.qty}
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-600">
                      {currency}{item.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {currency}{(item.price * item.qty).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Signoff */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              <p className="font-bold text-slate-700">Thank you for your business with NS Computers!</p>
              <p>For inquiries or tracking, WhatsApp / Call <strong>{settings.phone}</strong></p>
            </div>

            <div className="w-full sm:w-60 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-800">{currency}{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Islandwide Delivery:</span>
                <span className="font-bold text-emerald-600">Standard / COD</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-blue-600">{currency}{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
