import random
from typing import Dict, Any, Tuple, Optional
from django.core.exceptions import ValidationError
from .models import Shopper, CheckoutOrder

class AuthService:
    """
    Business Logic Service Layer for Shopper Authentication & OTP Operations.
    """

    @staticmethod
    def generate_6digit_otp() -> str:
        """Generates a random 6-digit numeric verification code."""
        return str(random.randint(100000, 999999))

    @classmethod
    def register_shopper(cls, email: str, first_name: str, last_name: str) -> Tuple[Shopper, bool]:
        """
        Registers a new unique shopper account and generates a 6-digit passcode.
        Raises ValidationError if email is already registered.
        """
        clean_email = email.strip().lower()
        if not clean_email:
            raise ValidationError("Email address is required.")

        if Shopper.objects.filter(email=clean_email).exists():
            raise ValidationError("An account with this email address already exists. Please Sign In or use 1-Click Checkout.")

        otp_code = cls.generate_6digit_otp()
        
        shopper = Shopper.objects.create(
            email=clean_email,
            first_name=first_name.strip(),
            last_name=last_name.strip(),
            otp_code=otp_code
        )
        return shopper, True

    @classmethod
    def recognize_shopper(cls, email: str) -> Dict[str, Any]:
        """
        Background recognition check by email.
        Does NOT expose OTP code for security reasons.
        """
        clean_email = email.strip().lower()
        shopper = Shopper.objects.filter(email=clean_email).first()

        if shopper:
            return {
                'exists': True,
                'email': shopper.email,
                'first_name': shopper.first_name,
                'last_name': shopper.last_name
            }
        
        return {
            'exists': False,
            'email': clean_email,
            'first_name': '',
            'last_name': ''
        }

    @classmethod
    def verify_otp(cls, email: str, otp_code: str) -> Tuple[bool, Optional[Shopper], str]:
        """
        Validates the submitted 6-digit numeric OTP code against stored user OTP code.
        """
        clean_email = email.strip().lower()
        clean_otp = str(otp_code).strip()

        shopper = Shopper.objects.filter(email=clean_email).first()

        if not shopper:
            return False, None, "User not found. Please register first."

        if shopper.otp_code == clean_otp:
            return True, shopper, "OTP verification successful."
        
        return False, None, "Invalid verification code. Please check your 6-digit code and try again."

class OrderService:
    """
    Business Logic Service Layer for Processing Checkout Orders.
    """

    @classmethod
    def process_checkout(cls, data: Dict[str, Any]) -> CheckoutOrder:
        """
        Creates a checkout order in the database.
        Automatically links to a registered Shopper if email exists.
        """
        clean_email = data.get('email', '').strip().lower()
        shopper = Shopper.objects.filter(email=clean_email).first()

        order = CheckoutOrder.objects.create(
            shopper=shopper,
            email=clean_email,
            phone_number=data.get('phone_number', '').strip(),
            shipping_address=data.get('shipping_address', '').strip(),
            city=data.get('city', '').strip(),
            state=data.get('state', '').strip(),
            zip_code=data.get('zip_code', '').strip(),
            country=data.get('country', 'United States').strip(),
            total_amount=data.get('total_amount', 99.99),
            is_guest=data.get('is_guest', shopper is None)
        )

        return order
