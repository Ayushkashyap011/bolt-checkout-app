import React from 'react';
import { NavLink } from 'react-router-dom';
import { Zap, ShoppingCart, UserCheck, Database } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-[#0A0F24]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Bolt Branding */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-bolt-500 flex items-center justify-center shadow-lg shadow-bolt-500/30 group-hover:bg-bolt-600 transition-colors">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-100 tracking-tight">BOLT</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-bolt-400 bg-bolt-500/10 border border-bolt-500/30 px-2 py-0.5 rounded-full">
                Checkout
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">1-Click OTP Recognition</p>
          </div>
        </NavLink>

        {/* Multi-Page Navigation Links */}
        <div className="flex items-center bg-[#121936] p-1 rounded-xl border border-slate-800">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-bolt-500 text-white shadow-md shadow-bolt-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In / Sign Up</span>
          </NavLink>

          <NavLink
            to="/checkout"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-bolt-500 text-white shadow-md shadow-bolt-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>1-Click Checkout</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-bolt-500 text-white shadow-md shadow-bolt-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Database className="w-3.5 h-3.5" />
            <span>DB Orders</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};
