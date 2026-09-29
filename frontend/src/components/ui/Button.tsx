import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-bolt-500 focus:ring-offset-2 focus:ring-offset-[#0A0F24] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-bolt-500 hover:bg-bolt-600 active:bg-bolt-700 text-white shadow-md shadow-bolt-500/20 transform hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
    outline: 'border border-bolt-500/50 text-bolt-400 hover:bg-bolt-500/10 hover:border-bolt-500',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
