import random
import string
from django.db import models

def generate_order_number():
    """Generates a unique 9-character order reference number (e.g. ORD-482910)."""
    random_digits = ''.join(random.choices(string.digits, k=6))
    return f"ORD-{random_digits}"

class Shopper(models.Model):
    """
    Represents a registered user in Bolt's system.
    Stores basic profile info and their generated 6-digit OTP login code.
    """
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shoppers'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class CheckoutOrder(models.Model):
    """
    Represents a completed checkout order.
    Stores user info, shipping details, and order metadata.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    order_number = models.CharField(max_length=32, unique=True, default=generate_order_number, db_index=True)
    shopper = models.ForeignKey(Shopper, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    email = models.EmailField(db_index=True)
    phone_number = models.CharField(max_length=30)
    shipping_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='United States')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=99.99)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='COMPLETED')
    is_guest = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'checkout_orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.order_number} - {self.email} (${self.total_amount})"
