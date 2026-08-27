from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import BespokeRequest
from .serializers import BespokeRequestSerializer

class BespokeRequestViewSet(viewsets.ModelViewSet):
    queryset = BespokeRequest.objects.all()
    serializer_class = BespokeRequestSerializer
    lookup_field = 'reference'
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def submit_request(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
