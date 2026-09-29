export interface Shopper {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  otp_code: string;
  created_at: string;
}

export interface RecognitionResult {
  exists: boolean;
  email: string;
  first_name: string;
  last_name: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  shopper?: Shopper;
}

export interface CheckoutFormData {
  email: string;
  phone_number: string;
  shipping_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface Order {
  id: number;
  order_number: string;
  email: string;
  phone_number: string;
  shipping_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  total_amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  is_guest: boolean;
  created_at: string;
}

export interface RegistrationFormData {
  email: string;
  first_name: string;
  last_name: string;
}
