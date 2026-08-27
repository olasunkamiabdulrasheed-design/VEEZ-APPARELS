"""
Order models for Veez Apparels e-commerce platform.
"""

import uuid
from django.db import models
from django.contrib.auth.models import User
from veez_store.apps.products.models import Product, ProductVariant


class Customer(models.Model):
    """Customer profile model."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    name = models.CharField(max_length=200)
    
    # Address (can be used as default)
    address = models.CharField(max_length=500, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='Nigeria')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name or self.email


class Order(models.Model):
    """Order model for tracking customer purchases."""
    
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('ready', 'Ready'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Order identification
    order_number = models.CharField(max_length=50, unique=True)
    reference = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    # Customer information
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='orders')
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    # Delivery address
    delivery_address = models.CharField(max_length=500)
    delivery_city = models.CharField(max_length=100)
    delivery_state = models.CharField(max_length=100)
    delivery_country = models.CharField(max_length=100, default='Nigeria')
    delivery_notes = models.TextField(blank=True)
    
    # Pricing (in smallest currency unit - kobo for NGN)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='NGN')
    
    # Status
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    
    # Metadata
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['reference']),
            models.Index(fields=['customer', 'created_at']),
            models.Index(fields=['order_status']),
        ]
    
    def __str__(self):
        return self.order_number
    
    def calculate_totals(self):
        """Calculate subtotal and total from order items."""
        self.subtotal = sum(item.subtotal for item in self.items.all())
        self.total = self.subtotal + self.delivery_fee
        self.save()
    
    @property
    def can_be_cancelled(self):
        """Check if order can still be cancelled."""
        return self.order_status in ['pending', 'confirmed']


class OrderItem(models.Model):
    """Individual items in an order."""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, null=True, blank=True)
    
    # Snapshot of data at time of order (for historical accuracy)
    product_name_snapshot = models.CharField(max_length=200)
    product_sku_snapshot = models.CharField(max_length=50)
    size_snapshot = models.CharField(max_length=50, blank=True)
    colour_snapshot = models.CharField(max_length=50, blank=True)
    
    # Pricing snapshot
    unit_price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.product_name_snapshot} x{self.quantity}"
    
    def save(self, *args, **kwargs):
        """Auto-calculate subtotal."""
        if not self.subtotal:
            self.subtotal = self.unit_price_snapshot * self.quantity
        super().save(*args, **kwargs)


class OrderStatusHistory(models.Model):
    """Track order status changes for audit trail."""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    from_status = models.CharField(max_length=20)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.order.order_number}: {self.from_status} → {self.to_status}"
