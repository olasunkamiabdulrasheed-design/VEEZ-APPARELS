from django.admin import ModelAdmin, register
from .models import Appointment

@register(Appointment)
class AppointmentAdmin(ModelAdmin):
    list_display = ('name', 'email', 'preferred_date', 'preferred_time', 'purpose', 'status', 'created_at')
    list_filter = ('status', 'preferred_date', 'created_at')
    search_fields = ('name', 'email', 'phone')
    readonly_fields = ('created_at', 'updated_at')
