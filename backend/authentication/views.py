from rest_framework import status, views
from rest_framework.response import Response
from .serializers import (
    RegisterShopperSerializer,
    ShopperResponseSerializer,
    RecognizeRequestSerializer,
    VerifyOtpSerializer,
    CheckoutOrderSerializer
)
from .services import AuthService, OrderService
from .models import Shopper, CheckoutOrder

class RegisterShopperView(views.APIView):
    """
    POST /api/auth/register/
    Collects user's email, first name, last name.
    Generates a 6-digit OTP passcode and returns user profile.
    """
    def post(self, request):
        serializer = RegisterShopperSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        first_name = serializer.validated_data['first_name']
        last_name = serializer.validated_data['last_name']

        shopper, created = AuthService.register_shopper(email, first_name, last_name)
        response_data = ShopperResponseSerializer(shopper).data

        return Response({
            'message': 'Shopper registered successfully' if created else 'Shopper OTP updated',
            'shopper': response_data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class RecognizeShopperView(views.APIView):
    """
    POST /api/auth/recognize/
    Real-time background check on email address as user types in checkout form.
    Returns recognition status without exposing OTP code.
    """
    def post(self, request):
        serializer = RecognizeRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        result = AuthService.recognize_shopper(email)
        return Response(result, status=status.HTTP_200_OK)

class VerifyOtpView(views.APIView):
    """
    POST /api/auth/verify-otp/
    Validates submitted 6-digit passcode. Logs in user on match.
    """
    def post(self, request):
        serializer = VerifyOtpSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'error': '6-digit numeric code required.'}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']

        is_valid, shopper, message = AuthService.verify_otp(email, otp_code)

        if not is_valid:
            return Response({
                'success': False,
                'error': message
            }, status=status.HTTP_400_BAD_REQUEST)

        shopper_data = ShopperResponseSerializer(shopper).data
        return Response({
            'success': True,
            'message': message,
            'shopper': shopper_data
        }, status=status.HTTP_200_OK)

class CreateCheckoutOrderView(views.APIView):
    """
    POST /api/orders/checkout/
    Submits checkout form data, saving order into database.
    """
    def post(self, request):
        serializer = CheckoutOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        order = OrderService.process_checkout(request.data)
        order_data = CheckoutOrderSerializer(order).data

        return Response({
            'message': 'Checkout order recorded successfully.',
            'order': order_data
        }, status=status.HTTP_201_CREATED)

class DemoUsersListView(views.APIView):
    """
    GET /api/auth/demo-users/
    Returns list of registered shoppers and their OTP codes to simplify demo testing.
    """
    def get(self, request):
        shoppers = Shopper.objects.all().order_by('-created_at')
        serializer = ShopperResponseSerializer(shoppers, many=True)
        return Response({'shoppers': serializer.data}, status=status.HTTP_200_OK)

class ListOrdersView(views.APIView):
    """
    GET /api/orders/
    Returns list of all recorded checkout orders from the database table.
    """
    def get(self, request):
        orders = CheckoutOrder.objects.all().order_by('-created_at')
        serializer = CheckoutOrderSerializer(orders, many=True)
        return Response({'orders': serializer.data}, status=status.HTTP_200_OK)
