"""
Serializers for Orders app.
"""

from rest_framework import serializers
from .models import Customer, Order, OrderItem, OrderStatusHistory


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for customer profiles."""
    
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone', 'address', 'city', 'state', 'country']


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items."""
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_name_snapshot', 'product_sku_snapshot', 
            'size_snapshot', 'colour_snapshot', 'unit_price_snapshot',
            'quantity', 'subtotal'
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single order view."""
    
    items = OrderItemSerializer(many=True, read_only=True)
    customer = CustomerSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'reference', 'customer', 'email', 'phone',
            'delivery_address', 'delivery_city', 'delivery_state', 'delivery_country',
            'delivery_notes', 'subtotal', 'delivery_fee', 'total', 'currency',
            'order_status', 'items', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['order_number', 'reference', 'subtotal', 'total']


class OrderListSerializer(serializers.ModelSerializer):
    """Simplified serializer for order listings."""
    
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'reference', 'email', 'total', 'currency',
            'order_status', 'item_count', 'created_at'
        ]
        read_only_fields = ['order_number', 'reference']
    
    def get_item_count(self, obj):
        return obj.items.count()


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new orders."""
    
    class Meta:
        model = Order
        fields = [
            'email', 'phone', 'delivery_address', 'delivery_city',
            'delivery_state', 'delivery_country', 'delivery_notes', 'delivery_fee'
        ]


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    """Serializer for order status history."""
    
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = OrderStatusHistory
        fields = ['id', 'from_status', 'to_status', 'changed_by_name', 'notes', 'created_at']
