from django.admin import ModelAdmin, register
from .models import BespokeRequest

@register(BespokeRequest)
class BespokeRequestAdmin(ModelAdmin):
    list_display = ('reference', 'name', 'email', 'outfit_type', 'occasion', 'status', 'created_at')
    list_filter = ('status', 'outfit_type', 'occasion', 'created_at')
    search_fields = ('reference', 'name', 'email', 'phone')
    readonly_fields = ('reference', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Request Info', {
            'fields': ('reference', 'name', 'email', 'phone')
        }),
        ('Outfit Details', {
            'fields': ('outfit_type', 'occasion', 'colour', 'fabric', 'style_description')
        }),
        ('Measurements & References', {
            'fields': ('measurements', 'reference_image', 'notes')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

