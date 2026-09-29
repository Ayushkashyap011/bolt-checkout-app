import axios from 'axios';
import type {
  Shopper,
  RecognitionResult,
  VerifyOtpResponse,
  CheckoutFormData,
  Order,
  RegistrationFormData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const apiService = {
  // Register a new shopper & receive 6-digit numeric OTP code
  async registerShopper(data: RegistrationFormData): Promise<{ message: string; shopper: Shopper }> {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  // Perform background recognition check on email input
  async recognizeShopper(email: string): Promise<RecognitionResult> {
    const response = await api.post('/auth/recognize/', { email });
    return response.data;
  },

  // Verify the 6-digit OTP code submitted inside modal
  async verifyOtp(email: string, otp_code: string): Promise<VerifyOtpResponse> {
    const response = await api.post('/auth/verify-otp/', { email, otp_code });
    return response.data;
  },

  // Submit checkout form and record order
  async submitCheckout(data: CheckoutFormData & { is_guest: boolean }): Promise<{ message: string; order: Order }> {
    const response = await api.post('/orders/checkout/', data);
    return response.data;
  },

  // Fetch registered demo users for quick testing
  async getDemoUsers(): Promise<{ shoppers: Shopper[] }> {
    const response = await api.get('/auth/demo-users/');
    return response.data;
  },

  // Fetch all completed checkout orders from DB
  async getAllOrders(): Promise<{ orders: Order[] }> {
    const response = await api.get('/orders/');
    return response.data;
  },
};
