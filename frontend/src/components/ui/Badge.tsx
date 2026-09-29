import React from 'react';

interface BadgeProps {
  variant?: 'bolt' | 'success' | 'warning' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'bolt',
  children,
  className = '',
}) => {
  const variants = {
    bolt: 'bg-bolt-500/15 text-bolt-400 border border-bolt-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
