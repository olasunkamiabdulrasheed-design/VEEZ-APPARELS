"""
Bespoke/Custom outfit request models.
"""

import uuid
from django.db import models


class BespokeRequest(models.Model):
    """Custom outfit request model."""
    
    OUTFIT_TYPE_CHOICES = [
        ('agbada', 'Agbada'),
        ('kaftan', 'Kaftan'),
        ('native', 'Native Wear'),
        ('senator', 'Senator'),
        ('wedding', 'Wedding Outfit'),
        ('traditional', 'Traditional Outfit'),
        ('other', 'Other'),
    ]
    
    OCCASION_CHOICES = [
        ('wedding', 'Wedding'),
        ('birthday', 'Birthday'),
        ('party', 'Party'),
        ('ceremony', 'Ceremony'),
        ('corporate', 'Corporate'),
        ('religious', 'Religious'),
        ('casual', 'Casual'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('contacted', 'Contacted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Request identification
    reference = models.CharField(max_length=50, unique=True)
    
    # Customer information
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    # Request details
    outfit_type = models.CharField(max_length=20, choices=OUTFIT_TYPE_CHOICES)
    occasion = models.CharField(max_length=20, choices=OCCASION_CHOICES)
    colour = models.CharField(max_length=100, blank=True)
    fabric = models.CharField(max_length=100, blank=True)
    style_description = models.TextField()
    
    # Measurements
    measurements = models.TextField(help_text="Customer measurements as provided")
    
    # Reference image (for inspiration)
    reference_image = models.ImageField(upload_to='bespoke/reference/', null=True, blank=True)
    
    # Additional notes
    notes = models.TextField(blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.reference} - {self.name}"
    
    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = f"VEEZ-BSP-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
