import React from 'react';
import { ShoppingBag, Lock, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

interface OrderSummaryCardProps {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isLoggedIn: boolean;
  isValidForm: boolean;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  onSubmit,
  isSubmitting,
  isLoggedIn,
  isValidForm,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 sticky top-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-bolt-400" />
          <span>Order Summary</span>
        </h3>
        <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
          1 Item
        </span>
      </div>

      {/* Cart Item Preview */}
      <div className="flex items-center gap-4 py-2">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-bolt-500/20 to-indigo-500/20 border border-bolt-500/30 flex items-center justify-center text-bolt-400 shrink-0">
          <Zap className="w-8 h-8 fill-bolt-500 text-bolt-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-200">Bolt Pro Developer Pass</h4>
          <p className="text-xs text-slate-400">1-Click Checkout Passcode Access</p>
          <p className="text-xs font-semibold text-bolt-300 mt-1">Quantity: 1</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-100">$99.99</span>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span>$99.99</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Shipping & Handling</span>
          <span className="text-emerald-400 font-medium">FREE</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Estimated Tax</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between text-base font-bold text-slate-100 pt-3 border-t border-slate-800/80">
          <span>Total</span>
          <span className="text-bolt-400">$99.99</span>
        </div>
      </div>

      {/* Checkout Submission Button */}
      <div className="space-y-3 pt-2">
        <Button
          type="button"
          onClick={onSubmit}
          className="w-full text-base font-bold py-3.5"
          isLoading={isSubmitting}
          disabled={!isValidForm}
        >
          <Lock className="w-4 h-4 mr-2" />
          <span>{isLoggedIn ? 'Complete 1-Click Order' : 'Complete Checkout'}</span>
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Encrypted & SSL Secured Checkout</span>
        </div>
      </div>
    </div>
  );
};
