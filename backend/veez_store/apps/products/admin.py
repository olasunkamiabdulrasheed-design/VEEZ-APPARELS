"""
Django admin configuration for Products app.
"""

from django.admin import ModelAdmin, TabularInline, register
from .models import Category, Collection, Product, ProductImage, ProductVariant


@register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ('name', 'slug', 'active', 'created_at')
    list_filter = ('active', 'created_at')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')


@register(Collection)
class CollectionAdmin(ModelAdmin):
    list_display = ('name', 'slug', 'featured', 'active', 'created_at')
    list_filter = ('featured', 'active', 'created_at')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')


class ProductImageInline(TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'sort_order')


class ProductVariantInline(TabularInline):
    model = ProductVariant
    extra = 1
    fields = ('size', 'colour', 'sku', 'price_override', 'stock', 'available')


@register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ('name', 'sku', 'category', 'current_price', 'available', 'featured', 'new_arrival', 'created_at')
    list_filter = ('category', 'collection', 'audience', 'available', 'featured', 'new_arrival', 'created_at')
    search_fields = ('name', 'sku', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'sku', 'description')
        }),
        ('Categorization', {
            'fields': ('category', 'collection', 'audience')
        }),
        ('Pricing', {
            'fields': ('base_price', 'sale_price', 'currency')
        }),
        ('Status', {
            'fields': ('available', 'featured', 'new_arrival')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [ProductImageInline, ProductVariantInline]


@register(ProductImage)
class ProductImageAdmin(ModelAdmin):
    list_display = ('product', 'sort_order', 'alt_text', 'created_at')
    list_filter = ('product__category', 'created_at')
    search_fields = ('product__name', 'alt_text')
    readonly_fields = ('created_at',)


@register(ProductVariant)
class ProductVariantAdmin(ModelAdmin):
    list_display = ('product', 'size', 'colour', 'sku', 'price', 'stock', 'available')
    list_filter = ('available', 'created_at', 'product__category')
    search_fields = ('product__name', 'size', 'colour', 'sku')
    readonly_fields = ('created_at', 'updated_at')
