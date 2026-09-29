import re
from rest_framework import serializers
from .models import Shopper, CheckoutOrder

PHONE_REGEX = r'^[0-9\+\-\s\(\)]{7,20}$'

class RegisterShopperSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100, min_length=1)
    last_name = serializers.CharField(max_length=100, min_length=1)

    def validate_email(self, value):
        clean_email = value.strip().lower()
        if Shopper.objects.filter(email=clean_email).exists():
            raise serializers.ValidationError("An account with this email address already exists. Please Sign In or use 1-Click Checkout.")
        return clean_email

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        return value.strip()

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        return value.strip()

class ShopperResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shopper
        fields = ['id', 'email', 'first_name', 'last_name', 'otp_code', 'created_at']

class RecognizeRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6)

    def validate_otp_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("OTP code must contain only numeric digits.")
        return value

class CheckoutOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckoutOrder
        fields = [
            'id', 'order_number', 'email', 'phone_number',
            'shipping_address', 'city', 'state', 'zip_code',
            'country', 'total_amount', 'status', 'is_guest', 'created_at'
        ]
        read_only_fields = ['id', 'order_number', 'status', 'created_at']

    def validate_phone_number(self, value):
        clean = value.strip()
        if not re.match(PHONE_REGEX, clean) or not any(char.isdigit() for char in clean):
            raise serializers.ValidationError("Please enter a valid phone number containing digits (e.g. +1 555-0199 or 9876543210).")
        return clean

    def validate_shipping_address(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Please enter a complete shipping address (at least 3 characters).")
        return value.strip()

    def validate_city(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("City name must be at least 2 characters.")
        return value.strip()

    def validate_state(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("State name must be at least 2 characters.")
        return value.strip()

    def validate_zip_code(self, value):
        clean = value.strip()
        if len(clean) < 3:
            raise serializers.ValidationError("ZIP / Postal code must be at least 3 characters.")
        return clean
