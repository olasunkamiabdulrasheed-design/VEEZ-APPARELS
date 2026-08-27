"""
Serializers for Products app.
"""

from rest_framework import serializers
from .models import Category, Collection, Product, ProductImage, ProductVariant


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for product images."""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'sort_order']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer for product variants."""
    
    price = serializers.SerializerMethodField()
    has_stock = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'colour', 'sku', 'price', 'stock', 'available', 'has_stock']
    
    def get_price(self, obj):
        return str(obj.price)
    
    def get_has_stock(self, obj):
        return obj.has_stock()


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for product categories."""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image']


class CollectionSerializer(serializers.ModelSerializer):
    """Serializer for product collections."""
    
    class Meta:
        model = Collection
        fields = ['id', 'name', 'slug', 'description', 'image', 'featured']


class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for product listings."""
    
    category = CategorySerializer(read_only=True)
    current_price = serializers.SerializerMethodField()
    is_on_sale = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'category', 'current_price', 
            'base_price', 'sale_price', 'currency', 'available', 
            'is_on_sale', 'featured', 'new_arrival', 'audience', 'primary_image'
        ]
    
    def get_current_price(self, obj):
        return str(obj.current_price)
    
    def get_is_on_sale(self, obj):
        return obj.is_on_sale
    
    def get_primary_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            return ProductImageSerializer(first_image).data
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Complete serializer for product detail page."""
    
    category = CategorySerializer(read_only=True)
    collection = CollectionSerializer(read_only=True, required=False)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    current_price = serializers.SerializerMethodField()
    is_on_sale = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'category', 'collection',
            'base_price', 'sale_price', 'current_price', 'currency', 'is_on_sale',
            'featured', 'new_arrival', 'available', 'audience', 'images', 'variants',
            'created_at', 'updated_at'
        ]
    
    def get_current_price(self, obj):
        return str(obj.current_price)
    
    def get_is_on_sale(self, obj):
        return obj.is_on_sale
