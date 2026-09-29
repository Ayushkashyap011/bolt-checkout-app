import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0A0F24] py-6 text-xs text-slate-400 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-bolt-400" />
          <span>Bolt 1-Click Checkout Assignment — Production-Grade Application</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using React, Django REST, & PostgreSQL</span>
        </div>
      </div>
    </footer>
  );
};
