from django.core.management.base import BaseCommand
from authentication.models import Shopper

class Command(BaseCommand):
    help = 'Seeds initial demo shoppers for Bolt 1-Click Checkout testing'

    def handle(self, *args, **options):
        demo_shoppers = [
            {
                'email': 'alex.merchant@bolt.com',
                'first_name': 'Alex',
                'last_name': 'Merchant',
                'otp_code': '482910'
            },
            {
                'email': 'sarah.connor@example.com',
                'first_name': 'Sarah',
                'last_name': 'Connor',
                'otp_code': '930182'
            },
            {
                'email': 'john.doe@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'otp_code': '123456'
            }
        ]

        count = 0
        for shopper_data in demo_shoppers:
            shopper, created = Shopper.objects.update_or_create(
                email=shopper_data['email'],
                defaults=shopper_data
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} new demo shoppers.'))
