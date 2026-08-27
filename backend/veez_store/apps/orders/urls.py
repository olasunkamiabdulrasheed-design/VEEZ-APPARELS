"""
URL configuration for orders app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CustomerViewSet

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')
router.register(r'customers', CustomerViewSet, basename='customer')

urlpatterns = [
    path('', include(router.urls)),
]
