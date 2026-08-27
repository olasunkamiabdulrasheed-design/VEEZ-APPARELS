from rest_framework import serializers
from .models import Lookbook, Testimonial, SiteSettings

class LookbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lookbook
        fields = ['id', 'title', 'description', 'image', 'collection']

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'quote', 'rating', 'created_at']

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = ['whatsapp_number', 'business_email', 'business_phone', 'business_address', 
                  'instagram_url', 'facebook_url', 'default_delivery_fee', 'currency']
