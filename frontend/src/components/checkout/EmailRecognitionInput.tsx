import React from 'react';
import { Mail, Loader2, CheckCircle2, Zap, KeyRound } from 'lucide-react';
import { Input } from '../ui/Input';

interface EmailRecognitionInputProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRecognizing: boolean;
  isValidEmail: boolean;
  isLoggedIn: boolean;
  isRecognizedShopper?: boolean;
  onOpenOtpModal?: () => void;
  disabled?: boolean;
}

export const EmailRecognitionInput: React.FC<EmailRecognitionInputProps> = ({
  email,
  onChange,
  isRecognizing,
  isValidEmail,
  isLoggedIn,
  isRecognizedShopper = false,
  onOpenOtpModal,
  disabled = false,
}) => {
  const getRightIcon = () => {
    if (isRecognizing) {
      return (
        <span className="flex items-center text-bolt-400 gap-1.5 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-bolt-400" />
          <span className="hidden sm:inline text-[11px] text-slate-400">Checking...</span>
        </span>
      );
    }

    if (isLoggedIn) {
      return (
        <span className="flex items-center text-emerald-400 gap-1 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">1-Click Verified</span>
        </span>
      );
    }

    if (isValidEmail && isRecognizedShopper) {
      return (
        <span className="flex items-center text-bolt-400 text-xs font-semibold gap-1">
          <Zap className="w-4 h-4 fill-bolt-500 text-bolt-400" />
          <span className="hidden sm:inline">Shopper Found</span>
        </span>
      );
    }

    if (isValidEmail) {
      return (
        <span className="flex items-center text-slate-400 text-xs" title="1-Click recognition active">
          <Zap className="w-4 h-4 text-slate-500" />
        </span>
      );
    }

    return null;
  };

  return (
    <div className="space-y-2">
      <Input
        label="Email Address"
        type="email"
        placeholder="alex.merchant@bolt.com"
        value={email}
        onChange={onChange}
        disabled={disabled}
        leftIcon={<Mail className="w-4 h-4" />}
        rightIcon={getRightIcon()}
        helperText={
          isLoggedIn
            ? 'Account verified with Bolt 1-Click.'
            : isRecognizedShopper
            ? 'Registered Bolt shopper detected!'
            : 'Type your email address to automatically detect your Bolt account.'
        }
      />

      {/* Action banner if recognized but modal was closed or skipped */}
      {isRecognizedShopper && !isLoggedIn && onOpenOtpModal && (
        <div className="flex items-center justify-between bg-bolt-900/40 border border-bolt-500/30 rounded-xl p-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-bolt-500/20 border border-bolt-500/40 flex items-center justify-center text-bolt-400">
              <Zap className="w-3.5 h-3.5 fill-bolt-500 text-bolt-400" />
            </div>
            <span className="text-xs text-slate-200">
              Registered account recognized!
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenOtpModal}
            className="flex items-center gap-1.5 text-xs font-bold text-bolt-300 hover:text-white bg-bolt-500/20 hover:bg-bolt-500/30 border border-bolt-500/50 px-3 py-1.5 rounded-lg transition-all"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Enter OTP Code</span>
          </button>
        </div>
      )}
    </div>
  );
};
