"""
Django admin configuration for Orders app.
"""

from django.admin import ModelAdmin, TabularInline, register
from .models import Customer, Order, OrderItem, OrderStatusHistory


class OrderItemInline(TabularInline):
    model = OrderItem
    extra = 0
    fields = ('product_name_snapshot', 'size_snapshot', 'colour_snapshot', 'unit_price_snapshot', 'quantity', 'subtotal')
    readonly_fields = ('product_name_snapshot', 'size_snapshot', 'colour_snapshot', 'unit_price_snapshot', 'subtotal')


class OrderStatusHistoryInline(TabularInline):
    model = OrderStatusHistory
    extra = 0
    fields = ('from_status', 'to_status', 'notes', 'created_at')
    readonly_fields = ('from_status', 'to_status', 'notes', 'created_at')


@register(Customer)
class CustomerAdmin(ModelAdmin):
    list_display = ('name', 'email', 'phone', 'city', 'country', 'created_at')
    list_filter = ('country', 'created_at')
    search_fields = ('name', 'email', 'phone')
    readonly_fields = ('created_at', 'updated_at')


@register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ('order_number', 'customer', 'email', 'total', 'order_status', 'created_at')
    list_filter = ('order_status', 'currency', 'created_at')
    search_fields = ('order_number', 'email', 'phone', 'customer__name')
    readonly_fields = ('order_number', 'reference', 'subtotal', 'total', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'reference', 'customer', 'order_status')
        }),
        ('Customer Details', {
            'fields': ('email', 'phone')
        }),
        ('Delivery Address', {
            'fields': ('delivery_address', 'delivery_city', 'delivery_state', 'delivery_country', 'delivery_notes')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'delivery_fee', 'total', 'currency')
        }),
        ('Notes', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [OrderItemInline, OrderStatusHistoryInline]


@register(OrderItem)
class OrderItemAdmin(ModelAdmin):
    list_display = ('product_name_snapshot', 'size_snapshot', 'colour_snapshot', 'quantity', 'unit_price_snapshot', 'subtotal')
    list_filter = ('created_at', 'order')
    search_fields = ('product_name_snapshot', 'order__order_number')
    readonly_fields = ('product_name_snapshot', 'product_sku_snapshot', 'size_snapshot', 'colour_snapshot', 'unit_price_snapshot', 'subtotal', 'created_at')


@register(OrderStatusHistory)
class OrderStatusHistoryAdmin(ModelAdmin):
    list_display = ('order', 'from_status', 'to_status', 'changed_by', 'created_at')
    list_filter = ('from_status', 'to_status', 'created_at')
    search_fields = ('order__order_number', 'notes')
    readonly_fields = ('created_at',)
