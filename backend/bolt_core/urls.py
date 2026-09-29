from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'Bolt 1-Click Checkout API',
        'version': '1.0.0'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', api_health_check, name='api-health'),
    path('api/', include('authentication.urls')),
]
