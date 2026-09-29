import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { apiService } from '../../services/apiClient';
import { Shopper } from '../../types';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  firstName?: string;
  onSkip: () => void;
  onSuccess: (shopper: Shopper) => void;
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  firstName = 'Shopper',
  onSkip,
  onSuccess,
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setErrorMessage(null);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Handle pasted 6-digit code
    if (value.length > 1) {
      const digits = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || '';
      }
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage(null);

    // Auto-advance focus to next digit field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your numeric passcode.');
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMessage(null);
      const res = await apiService.verifyOtp(email, fullOtp);

      if (res.success && res.shopper) {
        onSuccess(res.shopper);
      } else {
        setErrorMessage(res.error || 'Invalid passcode. Please check your code and try again.');
        // Focus first box on error
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      const serverErr = err.response?.data?.error || 'Verification failed. Please check your code and try again.';
      setErrorMessage(serverErr);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleVerify} className="space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-bolt-500/20 border border-bolt-500/40 text-bolt-400 mx-auto flex items-center justify-center shadow-lg shadow-bolt-500/10">
            <ShieldCheck className="w-6 h-6 text-bolt-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Welcome Back, {firstName}!</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            We found your Bolt account for <span className="text-bolt-300 font-medium">{email}</span>. Enter your 6-digit numeric passcode to log in.
          </p>
        </div>

        {/* 6-Digit Passcode Input Fields */}
        <div className="flex justify-center gap-2 py-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-11 h-12 text-center text-lg font-bold bg-[#121936] border text-slate-100 rounded-lg outline-none transition-all duration-200
                ${errorMessage ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30' : 'border-slate-700 focus:border-bolt-500 focus:ring-2 focus:ring-bolt-500/30'}
                ${digit ? 'border-bolt-500 bg-bolt-500/10' : ''}`}
            />
          ))}
        </div>

        {/* Error Alert Box inside Modal */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Button
            type="submit"
            className="w-full text-sm font-semibold py-3"
            isLoading={isVerifying}
            disabled={otp.join('').length !== 6}
          >
            <KeyRound className="w-4 h-4 mr-2" />
            <span>Verify & Log In</span>
          </Button>

          <button
            type="button"
            onClick={onSkip}
            className="w-full text-xs text-slate-400 hover:text-slate-200 py-2 flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Skip login & continue as guest</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
