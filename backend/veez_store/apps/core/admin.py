from django.admin import ModelAdmin, TabularInline, register
from .models import Lookbook, LookbookProduct, Testimonial, SiteSettings

class LookbookProductInline(TabularInline):
    model = LookbookProduct
    extra = 1

@register(Lookbook)
class LookbookAdmin(ModelAdmin):
    list_display = ('title', 'collection', 'active', 'sort_order')
    list_filter = ('active', 'created_at')
    search_fields = ('title',)
    inlines = [LookbookProductInline]

@register(Testimonial)
class TestimonialAdmin(ModelAdmin):
    list_display = ('name', 'rating', 'approved', 'created_at')
    list_filter = ('approved', 'rating', 'created_at')
    search_fields = ('name', 'email')

@register(SiteSettings)
class SiteSettingsAdmin(ModelAdmin):
    fields = ('whatsapp_number', 'business_email', 'business_phone', 'business_address',
              'instagram_url', 'facebook_url', 'default_delivery_fee', 'currency')
