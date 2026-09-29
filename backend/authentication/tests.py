from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Shopper, CheckoutOrder

class BoltAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.demo_shopper = Shopper.objects.create(
            email='test.shopper@bolt.com',
            first_name='Test',
            last_name='User',
            otp_code='654321'
        )

    def test_user_registration(self):
        """Test registration creates new shopper and issues 6-digit OTP code."""
        url = reverse('register-shopper')
        payload = {
            'email': 'new.shopper@bolt.com',
            'first_name': 'New',
            'last_name': 'Shopper'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('shopper', response.data)
        self.assertEqual(len(response.data['shopper']['otp_code']), 6)
        self.assertTrue(response.data['shopper']['otp_code'].isdigit())

    def test_user_registration_duplicate_email(self):
        """Test registering duplicate email fails validation with 400 Bad Request."""
        url = reverse('register-shopper')
        payload = {
            'email': 'test.shopper@bolt.com',
            'first_name': 'Duplicate',
            'last_name': 'User'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('errors', response.data)

    def test_user_recognition_existing_email(self):
        """Test background recognition returns exists=True for registered email."""
        url = reverse('recognize-shopper')
        payload = {'email': 'test.shopper@bolt.com'}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['exists'])
        self.assertEqual(response.data['first_name'], 'Test')
        self.assertNotIn('otp_code', response.data)

    def test_user_recognition_unknown_email(self):
        """Test background recognition returns exists=False for unknown email."""
        url = reverse('recognize-shopper')
        payload = {'email': 'unknown@example.com'}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['exists'])

    def test_otp_verification_valid_code(self):
        """Test submitting correct 6-digit OTP logs user in successfully."""
        url = reverse('verify-otp')
        payload = {
            'email': 'test.shopper@bolt.com',
            'otp_code': '654321'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['shopper']['first_name'], 'Test')

    def test_otp_verification_invalid_code(self):
        """Test submitting wrong OTP returns HTTP 400 with clear error message."""
        url = reverse('verify-otp')
        payload = {
            'email': 'test.shopper@bolt.com',
            'otp_code': '000000'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('Invalid verification code', response.data['error'])

    def test_create_checkout_order_valid(self):
        """Test submitting checkout form with valid data records order in database."""
        url = reverse('create-checkout-order')
        payload = {
            'email': 'test.shopper@bolt.com',
            'phone_number': '+1 555-0199',
            'shipping_address': '500 Howard St',
            'city': 'San Francisco',
            'state': 'CA',
            'zip_code': '94105',
            'country': 'United States',
            'is_guest': False
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('order', response.data)
        self.assertEqual(response.data['order']['email'], 'test.shopper@bolt.com')
        self.assertTrue(CheckoutOrder.objects.filter(email='test.shopper@bolt.com').exists())

    def test_create_checkout_order_invalid_phone(self):
        """Test submitting order with alphabetic phone number fails validation with 400."""
        url = reverse('create-checkout-order')
        payload = {
            'email': 'test.shopper@bolt.com',
            'phone_number': 'dsfgfhghgsgds',
            'shipping_address': '500 Howard St',
            'city': 'San Francisco',
            'state': 'CA',
            'zip_code': '94105',
            'country': 'United States',
            'is_guest': False
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('errors', response.data)
        self.assertIn('phone_number', response.data['errors'])
