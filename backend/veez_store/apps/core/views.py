from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Lookbook, Testimonial, SiteSettings
from .serializers import LookbookSerializer, TestimonialSerializer, SiteSettingsSerializer

class LookbookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lookbook.objects.filter(active=True)
    serializer_class = LookbookSerializer
    permission_classes = [AllowAny]

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(approved=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]

class SiteSettingsViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def retrieve(self, request):
        try:
            settings = SiteSettings.objects.first()
            if settings:
                serializer = SiteSettingsSerializer(settings)
                return Response(serializer.data)
        except:
            pass
        return Response({})
