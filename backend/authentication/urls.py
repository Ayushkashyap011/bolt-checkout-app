from django.urls import path
from .views import (
    RegisterShopperView,
    RecognizeShopperView,
    VerifyOtpView,
    CreateCheckoutOrderView,
    DemoUsersListView,
    ListOrdersView
)

urlpatterns = [
    path('auth/register/', RegisterShopperView.as_view(), name='register-shopper'),
    path('auth/recognize/', RecognizeShopperView.as_view(), name='recognize-shopper'),
    path('auth/verify-otp/', VerifyOtpView.as_view(), name='verify-otp'),
    path('auth/demo-users/', DemoUsersListView.as_view(), name='demo-users'),
    path('orders/checkout/', CreateCheckoutOrderView.as_view(), name='create-checkout-order'),
    path('orders/', ListOrdersView.as_view(), name='list-orders'),
]
