"""
Product models for Veez Apparels e-commerce platform.
"""

from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator


class Category(models.Model):
    """Product categories like Agbada, Kaftan, etc."""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Collection(models.Model):
    """Collections like New Arrivals, Signature Collection, etc."""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='collections/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Product model for individual clothing items."""
    
    AUDIENCE_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('children', 'Children'),
        ('unisex', 'Unisex'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    
    # Pricing
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    currency = models.CharField(max_length=3, default='NGN')
    
    # Status
    featured = models.BooleanField(default=False)
    new_arrival = models.BooleanField(default=False)
    available = models.BooleanField(default=True)
    audience = models.CharField(max_length=10, choices=AUDIENCE_CHOICES, default='unisex')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'available']),
            models.Index(fields=['collection']),
            models.Index(fields=['slug']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def current_price(self):
        """Return sale price if available, otherwise base price."""
        return self.sale_price if self.sale_price else self.base_price
    
    @property
    def is_on_sale(self):
        """Check if product has a sale price."""
        return self.sale_price is not None and self.sale_price < self.base_price


class ProductImage(models.Model):
    """Product images with alt text and ordering."""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['sort_order', 'created_at']
    
    def __str__(self):
        return f"{self.product.name} - Image {self.sort_order}"


class ProductVariant(models.Model):
    """Product variants (size, color combinations)."""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=50)
    colour = models.CharField(max_length=50)
    sku = models.CharField(max_length=50, unique=True)
    price_override = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Leave blank to use product base price"
    )
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('product', 'size', 'colour')
        ordering = ['size', 'colour']
    
    def __str__(self):
        return f"{self.product.name} - {self.size}/{self.colour}"
    
    @property
    def price(self):
        """Return override price if set, otherwise product's current price."""
        if self.price_override is not None:
            return self.price_override
        return self.product.current_price
    
    def has_stock(self):
        """Check if variant is in stock."""
        return self.available and self.stock > 0
    
    def decrease_stock(self, quantity):
        """Safely decrease stock after order confirmation."""
        if self.stock >= quantity:
            self.stock -= quantity
            self.available = self.stock > 0
            self.save()
            return True
        return False
