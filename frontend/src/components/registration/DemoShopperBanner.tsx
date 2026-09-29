import React, { useEffect, useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { apiService } from '../../services/apiClient';
import { Shopper } from '../../types';

interface DemoShopperBannerProps {
  onSelectEmail: (email: string) => void;
}

export const DemoShopperBanner: React.FC<DemoShopperBannerProps> = ({ onSelectEmail }) => {
  const [demoUsers, setDemoUsers] = useState<Shopper[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const res = await apiService.getDemoUsers();
        setDemoUsers(res.shoppers);
      } catch (err) {
        console.error('Failed to load demo users', err);
      }
    };
    fetchDemo();
  }, []);

  const handleCopy = (shopper: Shopper, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shopper.otp_code);
    setCopiedId(shopper.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (demoUsers.length === 0) return null;

  return (
    <div className="bg-slate-900/80 border-b border-slate-800 py-2.5 px-4 text-xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-bolt-400 font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Quick Testing Demo Accounts:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {demoUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectEmail(user.email)}
              className="group flex items-center gap-2 bg-slate-800/90 hover:bg-bolt-500/20 border border-slate-700/80 hover:border-bolt-500/40 rounded-lg px-2.5 py-1 cursor-pointer transition-all duration-150"
              title={`Click to fill email: ${user.email}`}
            >
              <span className="font-medium text-slate-200 group-hover:text-bolt-300">
                {user.first_name} ({user.email})
              </span>
              <span className="font-mono text-bolt-400 font-bold bg-[#0A0F24] px-1.5 py-0.5 rounded text-[11px] border border-slate-700">
                Code: {user.otp_code}
              </span>
              <button
                onClick={(e) => handleCopy(user, e)}
                className="text-slate-400 hover:text-white p-0.5 rounded"
                title="Copy Code"
              >
                {copiedId === user.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
