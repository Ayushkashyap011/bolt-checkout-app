import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LoggedInHeader } from './components/checkout/LoggedInHeader';
import { EmailRecognitionInput } from './components/checkout/EmailRecognitionInput';
import { OTPVerificationModal } from './components/checkout/OTPVerificationModal';
import { ShippingAddressForm } from './components/checkout/ShippingAddressForm';
import { OrderSummaryCard } from './components/checkout/OrderSummaryCard';
import { OrderSuccessView } from './components/checkout/OrderSuccessView';
import { LandingPage } from './pages/LandingPage';
import { OrdersPage } from './pages/OrdersPage';
import { useUserRecognition } from './hooks/useUserRecognition';
import { apiService } from './services/apiClient';
import type { CheckoutFormData, Order, Shopper } from './types';
import { Zap } from 'lucide-react';

const PHONE_REGEX = /^[0-9\+\-\s\(\)]{7,20}$/;

function CheckoutPage() {
  const location = useLocation();
  const passedEmail = location.state?.email || '';
  const passedShopper = location.state?.loggedInShopper as Shopper | undefined;

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: passedEmail,
    phone_number: '',
    shipping_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  const {
    isValidEmail,
    isRecognizing,
    recognitionResult,
    isModalOpen,
    setIsModalOpen,
    loggedInShopper,
    setLoggedInShopper,
    handleSkipLogin,
    handleLoginSuccess,
    handleLogout,
    handleManualOpenModal,
  } = useUserRecognition(formData.email);

  useEffect(() => {
    if (passedShopper) {
      setLoggedInShopper(passedShopper);
      setFormData((prev) => ({ ...prev, email: passedShopper.email }));
    } else if (passedEmail) {
      setFormData((prev) => ({ ...prev, email: passedEmail }));
    }
  }, [passedEmail, passedShopper, setLoggedInShopper]);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateCheckoutForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.email || !isValidEmail) {
      errors.email = 'Please provide a valid email address.';
    }

    const cleanPhone = formData.phone_number.trim();
    if (!cleanPhone || !PHONE_REGEX.test(cleanPhone) || !/[0-9]/.test(cleanPhone)) {
      errors.phone_number = 'Please enter a valid phone number (digits only, e.g. +1 555-0199).';
    }

    if (!formData.shipping_address.trim() || formData.shipping_address.trim().length < 3) {
      errors.shipping_address = 'Please enter a complete shipping address.';
    }

    if (!formData.city.trim() || formData.city.trim().length < 2) {
      errors.city = 'City name must be at least 2 characters.';
    }

    if (!formData.state.trim() || formData.state.trim().length < 2) {
      errors.state = 'State / Region must be at least 2 characters.';
    }

    if (!formData.zip_code.trim() || formData.zip_code.trim().length < 3) {
      errors.zip_code = 'ZIP / Postal Code must be at least 3 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCheckoutForm()) return;

    try {
      setIsSubmitting(true);
      const result = await apiService.submitCheckout({
        ...formData,
        is_guest: !loggedInShopper,
      });

      setSubmittedOrder(result.order);
    } catch (err: any) {
      console.error('Checkout submission error:', err);
      const serverErr = err.response?.data?.errors?.phone_number?.[0] ||
        err.response?.data?.errors?.email?.[0] ||
        'Failed to submit order. Please check all fields.';
      alert(`Checkout Error: ${serverErr}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewOrder = () => {
    setSubmittedOrder(null);
    setFormData({
      email: '',
      phone_number: '',
      shipping_address: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'United States',
    });
    handleLogout();
  };

  const isPhoneValid = Boolean(
    formData.phone_number &&
    PHONE_REGEX.test(formData.phone_number.trim()) &&
    /[0-9]/.test(formData.phone_number)
  );

  const isFormValid = Boolean(
    formData.email &&
    isValidEmail &&
    isPhoneValid &&
    formData.shipping_address.trim().length >= 3 &&
    formData.city.trim().length >= 2 &&
    formData.state.trim().length >= 2 &&
    formData.zip_code.trim().length >= 3
  );

  if (submittedOrder) {
    return <OrderSuccessView order={submittedOrder} onNewOrder={handleStartNewOrder} />;
  }

  return (
    <div className="space-y-6">
      {/* Logged In Welcome Header */}
      {loggedInShopper && (
        <LoggedInHeader shopper={loggedInShopper} onLogout={handleLogout} />
      )}

      {/* Page Title & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Bolt 1-Click Checkout
          </h1>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-bolt-400 bg-bolt-500/10 border border-bolt-500/30 px-2.5 py-0.5 rounded-full">
            <Zap className="w-3.5 h-3.5 fill-bolt-500" /> Real-Time Recognition
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Enter your email address. Registered shoppers are recognized in real-time with an instant 6-digit OTP prompt.
        </p>
      </div>

      {/* Checkout Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
          <EmailRecognitionInput
            email={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            isRecognizing={isRecognizing}
            isValidEmail={isValidEmail}
            isLoggedIn={Boolean(loggedInShopper)}
            isRecognizedShopper={Boolean(recognitionResult?.exists)}
            onOpenOtpModal={handleManualOpenModal}
          />

          <ShippingAddressForm
            formData={formData}
            onChange={handleInputChange}
            errors={formErrors}
          />
        </div>

        {/* Right Column: Order Summary & Pay */}
        <div className="lg:col-span-5">
          <OrderSummaryCard
            onSubmit={handleCheckoutSubmit}
            isSubmitting={isSubmitting}
            isLoggedIn={Boolean(loggedInShopper)}
            isValidForm={isFormValid}
          />
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={formData.email}
        firstName={recognitionResult?.first_name || 'Shopper'}
        onSkip={handleSkipLogin}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0A0F24] flex flex-col font-sans">
        {/* Main Navbar */}
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
