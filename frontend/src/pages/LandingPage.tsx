import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, Mail, User, ShieldCheck, Copy, Check, ArrowRight, Zap } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { OTPVerificationModal } from '../components/checkout/OTPVerificationModal';
import { apiService } from '../services/apiClient';
import type { Shopper, RecognitionResult } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');

  // Sign Up State
  const [signupEmail, setSignupEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredShopper, setRegisteredShopper] = useState<Shopper | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sign In State
  const [signinEmail, setSigninEmail] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [signinError, setSigninError] = useState<string | null>(null);

  // Handle Sign Up Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !firstName || !lastName) {
      setSignupError('Please complete all required fields.');
      return;
    }

    try {
      setIsRegistering(true);
      setSignupError(null);
      const res = await apiService.registerShopper({
        email: signupEmail.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      setRegisteredShopper(res.shopper);
    } catch (err: any) {
      const msg = err.response?.data?.errors?.email?.[0] || 'An account with this email address already exists. Please Sign In.';
      setSignupError(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle Sign In Recognition Check
  const handleSignInCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signinEmail) return;

    try {
      setIsRecognizing(true);
      setSigninError(null);
      const result = await apiService.recognizeShopper(signinEmail.trim());
      setRecognitionResult(result);

      if (result.exists) {
        setIsOtpModalOpen(true);
      } else {
        setSigninError('No Bolt account found for this email. Please Sign Up first!');
      }
    } catch (err) {
      setSigninError('Failed to check email. Please try again.');
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleCopyCode = () => {
    if (registeredShopper?.otp_code) {
      navigator.clipboard.writeText(registeredShopper.otp_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLoginSuccess = (shopper: Shopper) => {
    setIsOtpModalOpen(false);
    navigate('/checkout', { state: { loggedInShopper: shopper } });
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-8 animate-fade-in">
      {/* Hero Welcome Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-bolt-500/20 border border-bolt-500/40 text-bolt-400 mx-auto flex items-center justify-center shadow-lg shadow-bolt-500/10">
          <Zap className="w-8 h-8 fill-bolt-500 text-bolt-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          Welcome to <span className="bolt-gradient-text">Bolt 1-Click Checkout</span>
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Sign up to create your Bolt account and receive a 6-digit passcode, or sign in to verify your account and jump to 1-Click checkout!
        </p>
      </div>

      {/* Main Tabbed Portal Box */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
        {/* Toggle Controls */}
        <div className="flex bg-[#121936] p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setSignupError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === 'signup'
                ? 'bg-bolt-500 text-white shadow-md shadow-bolt-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account (Sign Up)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setSigninError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === 'signin'
                ? 'bg-bolt-500 text-white shadow-md shadow-bolt-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In (1-Click OTP)</span>
          </button>
        </div>

        {/* TAB 1: SIGN UP */}
        {activeTab === 'signup' && (
          <div>
            {!registeredShopper ? (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="alex.merchant@bolt.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
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

                {signupError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                    <span>⚠️</span>
                    <div>
                      <p>{signupError}</p>
                      {signupError.includes('already exists') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSigninEmail(signupEmail);
                            setActiveTab('signin');
                          }}
                          className="text-bolt-300 font-bold underline hover:text-white mt-1 block"
                        >
                          Click here to Sign In with {signupEmail}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full py-3.5 text-sm font-semibold" isLoading={isRegistering}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span>Create Account & Get 6-Digit Code</span>
                </Button>
              </form>
            ) : (
              /* Passcode Card Display after Registration */
              <div className="space-y-5 bg-bolt-900/40 border border-bolt-500/30 rounded-xl p-6 text-center animate-slide-up">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold text-xs">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Account Created Successfully!</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Your 6-digit login code for <span className="text-bolt-300 font-bold">{registeredShopper.email}</span> is:
                </p>

                <div className="flex items-center justify-center gap-3 bg-[#0A0F24] border border-bolt-500/50 rounded-xl p-4">
                  <span className="font-mono text-3xl font-extrabold text-bolt-400 tracking-widest">
                    {registeredShopper.otp_code}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Copy passcode"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => navigate('/checkout', { state: { email: registeredShopper.email, loggedInShopper: registeredShopper } })}
                    className="w-full py-3 text-sm font-bold"
                  >
                    <span>Proceed to 1-Click Checkout</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegisteredShopper(null);
                      setSignupEmail('');
                      setFirstName('');
                      setLastName('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Register Another Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SIGN IN */}
        {activeTab === 'signin' && (
          <div className="space-y-5">
            {/* Quick Demo Account Box styled like user request */}
            <div className="bg-bolt-950/70 border border-bolt-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Quick Demo Account:</span>
                </div>
                <p className="text-slate-300 font-medium">
                  Shopper: <span className="text-bolt-300 font-semibold">alex.merchant@bolt.com</span> &nbsp; (Passcode: <span className="text-bolt-400 font-mono font-bold">482910</span>)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSigninEmail('alex.merchant@bolt.com')}
                className="shrink-0 text-xs font-bold text-bolt-300 hover:text-white bg-bolt-500/20 hover:bg-bolt-500/40 border border-bolt-500/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                Fill Demo
              </button>
            </div>

            <form onSubmit={handleSignInCheck} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="alex.merchant@bolt.com"
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="Enter your email to verify your 6-digit OTP code."
                required
              />

              {signinError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{signinError}</span>
                </div>
              )}

              <Button type="submit" className="w-full py-3.5 text-sm font-semibold" isLoading={isRecognizing}>
                <LogIn className="w-4 h-4 mr-2" />
                <span>Verify & Sign In with OTP</span>
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* OTP Modal Prompt */}
      <OTPVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={signinEmail}
        firstName={recognitionResult?.first_name || 'Shopper'}
        onSkip={() => {
          setIsOtpModalOpen(false);
          navigate('/checkout', { state: { email: signinEmail } });
        }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};
