from django.db import models
from veez_store.apps.products.models import Collection, Product

class Lookbook(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='lookbook/')
    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['sort_order', '-created_at']
    
    def __str__(self):
        return self.title

class LookbookProduct(models.Model):
    lookbook = models.ForeignKey(Lookbook, on_delete=models.CASCADE, related_name='products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    sort_order = models.PositiveIntegerField(default=0)
    
    class Meta:
        unique_together = ('lookbook', 'product')
        ordering = ['sort_order']

class Testimonial(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    quote = models.TextField()
    rating = models.PositiveIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.rating}⭐"

class SiteSettings(models.Model):
    whatsapp_number = models.CharField(max_length=20, blank=True)
    business_email = models.EmailField(blank=True)
    business_phone = models.CharField(max_length=20, blank=True)
    business_address = models.TextField(blank=True)
    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    default_delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=5000)
    currency = models.CharField(max_length=3, default='NGN')
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Site Settings'
    
    def __str__(self):
        return 'Site Settings'
