"""
Views for Products app.
"""

from django.db import models
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Collection, Product, ProductVariant
from .serializers import (
    CategorySerializer, CollectionSerializer, ProductListSerializer,
    ProductDetailSerializer, ProductVariantSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for product categories."""
    
    queryset = Category.objects.filter(active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for product collections."""
    
    queryset = Collection.objects.filter(active=True)
    serializer_class = CollectionSerializer
    lookup_field = 'slug'
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured collections."""
        collections = Collection.objects.filter(active=True, featured=True)
        serializer = self.get_serializer(collections, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for products with filtering and search."""
    
    queryset = Product.objects.filter(available=True).select_related('category', 'collection').prefetch_related('images', 'variants')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'collection__slug', 'audience', 'new_arrival', 'featured']
    search_fields = ['name', 'sku', 'description', 'category__name']
    ordering_fields = ['created_at', 'base_price', 'name']
    ordering = ['-created_at']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        """Return different serializers based on action."""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products."""
        featured_products = self.queryset.filter(featured=True)[:6]
        serializer = ProductListSerializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def new_arrivals(self, request):
        """Get new arrival products."""
        new_arrivals = self.queryset.filter(new_arrival=True)[:8]
        serializer = ProductListSerializer(new_arrivals, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def check_availability(self, request, slug=None):
        """Check availability of a specific variant."""
        product = self.get_object()
        size = request.data.get('size')
        colour = request.data.get('colour')
        
        if not size or not colour:
            return Response(
                {'error': 'size and colour are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            variant = ProductVariant.objects.get(
                product=product,
                size=size,
                colour=colour
            )
            serializer = ProductVariantSerializer(variant)
            return Response(serializer.data)
        except ProductVariant.DoesNotExist:
            return Response(
                {'error': 'Variant not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ProductVariantViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for product variants."""
    
    queryset = ProductVariant.objects.filter(available=True)
    serializer_class = ProductVariantSerializer
    
    @action(detail=False, methods=['get'])
    def by_product(self, request):
        """Get variants for a specific product."""
        product_id = request.query_params.get('product_id')
        product_slug = request.query_params.get('product_slug')
        
        if product_id:
            variants = self.queryset.filter(product_id=product_id)
        elif product_slug:
            variants = self.queryset.filter(product__slug=product_slug)
        else:
            return Response(
                {'error': 'product_id or product_slug parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(variants, many=True)
        return Response(serializer.data)


class SearchViewSet(viewsets.ViewSet):
    """Custom search endpoint for combined product search."""
    
    @action(detail=False, methods=['get'])
    def products(self, request):
        """Search products by name, SKU, category, and description."""
        query = request.query_params.get('q', '').strip()
        
        if not query or len(query) < 2:
            return Response(
                {'error': 'Query must be at least 2 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        products = Product.objects.filter(
            available=True
        ).filter(
            models.Q(name__icontains=query) |
            models.Q(sku__icontains=query) |
            models.Q(category__name__icontains=query) |
            models.Q(description__icontains=query)
        ).select_related('category', 'collection').prefetch_related('images', 'variants')[:20]
        
        serializer = ProductListSerializer(products, many=True)
        return Response({
            'query': query,
            'count': len(products),
            'results': serializer.data
        })
