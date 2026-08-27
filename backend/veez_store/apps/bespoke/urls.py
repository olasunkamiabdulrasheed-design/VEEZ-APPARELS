from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BespokeRequestViewSet

router = DefaultRouter()
router.register(r'', BespokeRequestViewSet, basename='bespoke')

urlpatterns = [
    path('', include(router.urls)),
]
