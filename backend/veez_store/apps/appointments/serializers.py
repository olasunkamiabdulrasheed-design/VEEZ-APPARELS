from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'name', 'email', 'phone', 'preferred_date', 'preferred_time', 'purpose', 'notes', 'status', 'created_at']
        read_only_fields = ['created_at']
