import React from 'react';
import { CheckCircle, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';
import { Button } from '../ui/Button';

interface OrderSuccessViewProps {
  order: Order;
  onNewOrder: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order, onNewOrder }) => {
  return (
    <div className="max-w-xl mx-auto glass-panel rounded-2xl p-8 border border-emerald-500/30 text-center space-y-6 animate-slide-up shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
        <CheckCircle className="w-10 h-10 text-emerald-400" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> Order Recorded Successfully
        </span>
        <h2 className="text-2xl font-extrabold text-slate-100">Thank You for Your Order!</h2>
        <p className="text-xs text-slate-400">
          Your order has been recorded in the database table with reference number:
        </p>
        <div className="bg-[#121936] border border-slate-700/80 rounded-lg p-3 inline-block font-mono text-lg font-bold text-bolt-300 tracking-wider">
          {order.order_number}
        </div>
      </div>

      <div className="bg-slate-900/60 rounded-xl p-4 text-left border border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between border-b border-slate-800 pb-2 font-medium text-slate-300">
          <span>Customer Email</span>
          <span className="text-slate-100">{order.email}</span>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-300">
          <span>Checkout Type</span>
          <span className={order.is_guest ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
            {order.is_guest ? 'Guest Checkout' : '1-Click Bolt Shopper'}
          </span>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-300">
          <span>Shipping Address</span>
          <span className="text-slate-100">{order.shipping_address}, {order.city}</span>
        </div>
        <div className="flex justify-between text-slate-300 pt-1 font-bold">
          <span>Total Paid</span>
          <span className="text-bolt-400 text-sm">${order.total_amount}</span>
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={onNewOrder} className="w-full text-sm font-semibold py-3">
          <ShoppingBag className="w-4 h-4 mr-2" />
          <span>Place Another Order</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
