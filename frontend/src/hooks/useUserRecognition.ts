import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { apiService } from '../services/apiClient';
import type { Shopper, RecognitionResult } from '../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useUserRecognition(email: string) {
  const debouncedEmail = useDebounce(email, 350);

  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loggedInShopper, setLoggedInShopper] = useState<Shopper | null>(null);
  const [skippedLoginEmail, setSkippedLoginEmail] = useState<string | null>(null);
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string>('');

  const checkRecognition = useCallback(async (targetEmail: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setRecognitionResult(null);
      setIsModalOpen(false);
      return;
    }

    // Do not trigger modal if user is already logged in as this email
    if (loggedInShopper && loggedInShopper.email.toLowerCase() === cleanEmail) {
      return;
    }

    // Do not auto-reopen modal if user explicitly clicked "Skip" for this email
    if (skippedLoginEmail && skippedLoginEmail.toLowerCase() === cleanEmail) {
      return;
    }

    // Prevent duplicate background requests if already checked
    if (lastCheckedEmail === cleanEmail && recognitionResult) {
      if (recognitionResult.exists && !skippedLoginEmail && !loggedInShopper) {
        // Only open if not skipped and not logged in
      }
      return;
    }

    try {
      setIsRecognizing(true);
      const result = await apiService.recognizeShopper(cleanEmail);
      setRecognitionResult(result);
      setLastCheckedEmail(cleanEmail);

      if (result.exists) {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Recognition error:', err);
    } finally {
      setIsRecognizing(false);
    }
  }, [skippedLoginEmail, loggedInShopper, lastCheckedEmail, recognitionResult]);

  useEffect(() => {
    const clean = debouncedEmail.trim().toLowerCase();
    if (clean && EMAIL_REGEX.test(clean)) {
      checkRecognition(clean);
    } else {
      setRecognitionResult(null);
      setIsModalOpen(false);
    }
  }, [debouncedEmail, checkRecognition]);

  // Reset skipped state when email changes significantly
  useEffect(() => {
    const clean = email.trim().toLowerCase();
    if (skippedLoginEmail && skippedLoginEmail.toLowerCase() !== clean) {
      setSkippedLoginEmail(null);
      setLastCheckedEmail('');
    }
    if (loggedInShopper && loggedInShopper.email.toLowerCase() !== clean) {
      setLoggedInShopper(null);
      setLastCheckedEmail('');
    }
  }, [email, skippedLoginEmail, loggedInShopper]);

  const handleSkipLogin = () => {
    setIsModalOpen(false);
    if (debouncedEmail) {
      setSkippedLoginEmail(debouncedEmail.trim().toLowerCase());
    }
  };

  const handleLoginSuccess = (shopper: Shopper) => {
    setLoggedInShopper(shopper);
    setIsModalOpen(false);
    setSkippedLoginEmail(null);
  };

  const handleLogout = () => {
    setLoggedInShopper(null);
    setSkippedLoginEmail(null);
    setLastCheckedEmail('');
    setRecognitionResult(null);
    setIsModalOpen(false);
  };

  const handleManualOpenModal = () => {
    if (recognitionResult?.exists) {
      setIsModalOpen(true);
    }
  };

  const isValidEmail = EMAIL_REGEX.test(email.trim());

  return {
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
  };
}
