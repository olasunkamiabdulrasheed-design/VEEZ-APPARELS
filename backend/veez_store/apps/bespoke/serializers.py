from rest_framework import serializers
from .models import BespokeRequest

class BespokeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BespokeRequest
        fields = ['id', 'reference', 'name', 'email', 'phone', 'outfit_type', 'occasion', 
                  'colour', 'fabric', 'style_description', 'measurements', 'reference_image', 
                  'notes', 'status', 'created_at']
        read_only_fields = ['reference', 'created_at']
