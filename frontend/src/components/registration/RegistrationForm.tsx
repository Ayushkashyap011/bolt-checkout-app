import React, { useState } from 'react';
import { UserPlus, Mail, User, ShieldCheck, Copy, Check, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { apiService } from '../../services/apiClient';
import type { Shopper } from '../../types';

interface RegistrationFormProps {
  onSuccess?: (shopper: Shopper) => void;
  onGoToCheckout?: (email: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, onGoToCheckout }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredShopper, setRegisteredShopper] = useState<Shopper | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName) {
      setErrorMessage('Please complete all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const res = await apiService.registerShopper({
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      setRegisteredShopper(res.shopper);
      if (onSuccess) onSuccess(res.shopper);
    } catch (err: any) {
      const msg = err.response?.data?.errors?.email?.[0] || 'Registration failed. Please check details.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (registeredShopper?.otp_code) {
      navigator.clipboard.writeText(registeredShopper.otp_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-bolt-500/20 border border-bolt-500/40 text-bolt-400 mx-auto flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-bolt-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Bolt Shopper Registration</h2>
        <p className="text-xs text-slate-400">
          Create an account to receive a 6-digit passcode for 1-Click login.
        </p>
      </div>

      {!registeredShopper ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="alex.merchant@bolt.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              type="text"
              placeholder="Alex"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label="Last Name"
              type="text"
              placeholder="Merchant"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              ⚠️ {errorMessage}
            </p>
          )}

          <Button type="submit" className="w-full py-3 text-sm font-semibold" isLoading={isSubmitting}>
            <UserPlus className="w-4 h-4 mr-2" />
            <span>Register & Issue Code</span>
          </Button>
        </form>
      ) : (
        /* Generated 6-digit Code Display Card */
        <div className="space-y-4 bg-bolt-900/40 border border-bolt-500/30 rounded-xl p-5 text-center animate-slide-up">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Registration Successful!</span>
          </div>

          <p className="text-xs text-slate-300">
            Your unique 6-digit passcode for <span className="text-bolt-300 font-semibold">{registeredShopper.email}</span> is:
          </p>

          <div className="flex items-center justify-center gap-3 bg-[#0A0F24] border border-bolt-500/50 rounded-xl p-4">
            <span className="font-mono text-3xl font-extrabold text-bolt-400 tracking-widest">
              {registeredShopper.otp_code}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Copy passcode"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            💡 Copy your 6-digit code! Click below to test 1-Click Checkout with this registered shopper.
          </p>

          <div className="space-y-2 pt-1">
            {onGoToCheckout && (
              <Button
                onClick={() => onGoToCheckout(registeredShopper.email)}
                className="w-full text-xs font-semibold py-2.5"
              >
                <span>Test 1-Click Checkout Now</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            )}

            <button
              onClick={() => {
                setRegisteredShopper(null);
                setEmail('');
                setFirstName('');
                setLastName('');
              }}
              className="w-full text-xs text-slate-400 hover:text-slate-200 py-1.5 transition-colors"
            >
              Register Another Shopper
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
