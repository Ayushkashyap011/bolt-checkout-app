import React from 'react';
import { Zap, CheckCircle2, LogOut } from 'lucide-react';
import { Shopper } from '../../types';

interface LoggedInHeaderProps {
  shopper: Shopper;
  onLogout: () => void;
}

export const LoggedInHeader: React.FC<LoggedInHeaderProps> = ({ shopper, onLogout }) => {
  return (
    <div className="w-full bg-gradient-to-r from-bolt-900/60 via-bolt-800/40 to-slate-900 border border-bolt-500/40 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-bolt-500/10 mb-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-bolt-500/20 border border-bolt-500/50 flex items-center justify-center text-bolt-400 font-bold">
          <Zap className="w-5 h-5 fill-bolt-500 text-bolt-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-100">
              Welcome back, {shopper.first_name} {shopper.last_name}!
            </h4>
            <span className="inline-flex items-center text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Verified 1-Click
            </span>
          </div>
          <p className="text-xs text-slate-400">Logged in as <span className="text-bolt-300 font-medium">{shopper.email}</span></p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg transition-all"
        title="Sign out of 1-Click checkout"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};
