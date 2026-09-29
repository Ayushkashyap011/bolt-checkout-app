import React from 'react';
import { Phone, MapPin, Building, Globe, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui/Input';
import type { CheckoutFormData } from '../../types';

interface ShippingAddressFormProps {
  formData: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  errors?: Record<string, string>;
}

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  formData,
  onChange,
  errors = {},
}) => {
  // Sanitize phone number to prevent alphabetic characters as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Only allow numbers, +, -, spaces, and parentheses
    const sanitized = raw.replace(/[^0-9\+\-\s\(\)]/g, '');
    onChange('phone_number', sanitized);
  };

  const isPhoneValid = Boolean(
    formData.phone_number &&
    formData.phone_number.length >= 7 &&
    /[0-9]/.test(formData.phone_number)
  );
  const isAddressValid = Boolean(formData.shipping_address && formData.shipping_address.trim().length >= 3);
  const isCityValid = Boolean(formData.city && formData.city.trim().length >= 2);
  const isStateValid = Boolean(formData.state && formData.state.trim().length >= 2);
  const isZipValid = Boolean(formData.zip_code && formData.zip_code.trim().length >= 3);

  return (
    <div className="space-y-4 pt-2">
      <div className="border-b border-slate-800/80 pb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-bolt-400" />
          <span>Shipping & Contact Details</span>
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">
          Step 2 of 2
        </span>
      </div>

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 019-2834 or 9876543210"
        value={formData.phone_number}
        onChange={handlePhoneChange}
        leftIcon={<Phone className="w-4 h-4" />}
        rightIcon={
          isPhoneValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : null
        }
        error={errors.phone_number}
        helperText="Only digits, +, -, and spaces are allowed."
      />

      <Input
        label="Street Shipping Address"
        type="text"
        placeholder="500 Howard Street, Suite 400"
        value={formData.shipping_address}
        onChange={(e) => onChange('shipping_address', e.target.value)}
        leftIcon={<MapPin className="w-4 h-4" />}
        rightIcon={
          isAddressValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : null
        }
        error={errors.shipping_address}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="City"
          type="text"
          placeholder="San Francisco"
          value={formData.city}
          onChange={(e) => onChange('city', e.target.value)}
          leftIcon={<Building className="w-4 h-4" />}
          rightIcon={
            isCityValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : null
          }
          error={errors.city}
        />

        <Input
          label="State / Region"
          type="text"
          placeholder="CA"
          value={formData.state}
          onChange={(e) => onChange('state', e.target.value)}
          rightIcon={
            isStateValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : null
          }
          error={errors.state}
        />

        <Input
          label="ZIP / Postal Code"
          type="text"
          placeholder="94105"
          value={formData.zip_code}
          onChange={(e) => onChange('zip_code', e.target.value)}
          rightIcon={
            isZipValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : null
          }
          error={errors.zip_code}
        />
      </div>

      <Input
        label="Country"
        type="text"
        placeholder="United States"
        value={formData.country}
        onChange={(e) => onChange('country', e.target.value)}
        leftIcon={<Globe className="w-4 h-4" />}
        error={errors.country}
      />
    </div>
  );
};
