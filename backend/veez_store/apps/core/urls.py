from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LookbookViewSet, TestimonialViewSet, SiteSettingsViewSet

router = DefaultRouter()
router.register(r'lookbook', LookbookViewSet, basename='lookbook')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'settings', SiteSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
]
