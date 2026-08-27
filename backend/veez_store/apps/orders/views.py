"""
Views for Orders app.
"""

import uuid
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings

from veez_store.apps.products.models import ProductVariant, Product
from .models import Order, OrderItem, Customer, OrderStatusHistory
from .serializers import (
    OrderDetailSerializer, OrderListSerializer, OrderCreateSerializer,
    CustomerSerializer, OrderStatusHistorySerializer
)


class CustomerViewSet(viewsets.ModelViewSet):
    """API endpoint for customer management."""
    
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    @action(detail=False, methods=['post'])
    def get_or_create(self, request):
        """Get existing customer or create new one."""
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        customer, created = Customer.objects.get_or_create(
            email=email,
            defaults={
                'name': request.data.get('name', ''),
                'phone': request.data.get('phone', ''),
                'address': request.data.get('address', ''),
                'city': request.data.get('city', ''),
                'state': request.data.get('state', ''),
                'country': request.data.get('country', 'Nigeria'),
            }
        )
        
        serializer = self.get_serializer(customer)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class OrderViewSet(viewsets.ModelViewSet):
    """API endpoint for orders with secure backend price calculation."""
    
    queryset = Order.objects.all().select_related('customer').prefetch_related('items')
    lookup_field = 'reference'
    permission_classes = [AllowAny]  # Will be secured by reference UUID
    
    def get_serializer_class(self):
        """Return different serializers based on action."""
        if self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            return OrderDetailSerializer
        elif self.action == 'create':
            return OrderCreateSerializer
        return OrderListSerializer
    
    @transaction.atomic
    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        """
        Create an order from cart items.
        
        CRITICAL: Backend calculates all prices. Frontend sends:
        - Customer info
        - Delivery address
        - Cart items (product ID, variant ID, quantity only)
        
        Backend:
        - Retrieves current prices
        - Validates stock
        - Calculates subtotal and total
        - Creates order
        """
        
        # Validate required fields
        email = request.data.get('email', '').strip()
        phone = request.data.get('phone', '').strip()
        name = request.data.get('name', '').strip()
        delivery_address = request.data.get('delivery_address', '').strip()
        delivery_city = request.data.get('delivery_city', '').strip()
        delivery_state = request.data.get('delivery_state', '').strip()
        delivery_country = request.data.get('delivery_country', 'Nigeria').strip()
        delivery_fee = request.data.get('delivery_fee', settings.DEFAULT_DELIVERY_FEE)
        cart_items = request.data.get('items', [])
        
        # Validation
        if not all([email, phone, name, delivery_address, delivery_city, delivery_state, cart_items]):
            return Response(
                {'error': 'Missing required fields: email, phone, name, delivery address, city, state, and items'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not isinstance(cart_items, list) or len(cart_items) == 0:
            return Response(
                {'error': 'items must be a non-empty list'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create customer
        try:
            customer, _ = Customer.objects.get_or_create(
                email=email,
                defaults={
                    'name': name,
                    'phone': phone,
                    'country': delivery_country,
                }
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to create customer: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Process cart items and calculate prices securely
        order_items_data = []
        subtotal = 0
        
        for item in cart_items:
            product_id = item.get('product_id')
            variant_id = item.get('variant_id')
            quantity = item.get('quantity', 1)
            
            if not product_id or not quantity:
                return Response(
                    {'error': 'Each cart item must have product_id and quantity'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get product - will fail if not found
            try:
                product = Product.objects.get(id=product_id, available=True)
            except Product.DoesNotExist:
                return Response(
                    {'error': f'Product {product_id} not found or unavailable'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get variant if specified
            variant = None
            if variant_id:
                try:
                    variant = ProductVariant.objects.get(
                        id=variant_id,
                        product=product,
                        available=True
                    )
                    # Check stock
                    if variant.stock < quantity:
                        return Response(
                            {'error': f'{product.name} - {variant.size}/{variant.colour} only has {variant.stock} in stock'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    price = variant.price
                except ProductVariant.DoesNotExist:
                    return Response(
                        {'error': f'Variant {variant_id} not found for product {product_id}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                # Use product's current price
                price = product.current_price
            
            # Calculate item subtotal
            item_subtotal = price * quantity
            subtotal += item_subtotal
            
            order_items_data.append({
                'product': product,
                'variant': variant,
                'product_name': product.name,
                'product_sku': product.sku,
                'size': variant.size if variant else '',
                'colour': variant.colour if variant else '',
                'price': price,
                'quantity': quantity,
                'item_subtotal': item_subtotal,
            })
        
        # Create order
        order_number = f"VEEZ-{uuid.uuid4().hex[:8].upper()}"
        
        try:
            order = Order.objects.create(
                order_number=order_number,
                customer=customer,
                email=email,
                phone=phone,
                delivery_address=delivery_address,
                delivery_city=delivery_city,
                delivery_state=delivery_state,
                delivery_country=delivery_country,
                delivery_fee=delivery_fee,
                subtotal=subtotal,
                total=subtotal + delivery_fee,
                currency=settings.CURRENCY,
                order_status='pending',
            )
            
            # Create order items
            for item_data in order_items_data:
                OrderItem.objects.create(
                    order=order,
                    product=item_data['product'],
                    variant=item_data['variant'],
                    product_name_snapshot=item_data['product_name'],
                    product_sku_snapshot=item_data['product_sku'],
                    size_snapshot=item_data['size'],
                    colour_snapshot=item_data['colour'],
                    unit_price_snapshot=item_data['price'],
                    quantity=item_data['quantity'],
                    subtotal=item_data['item_subtotal'],
                )
            
            serializer = OrderDetailSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to create order: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, reference=None):
        """
        Confirm payment for an order.
        In WhatsApp flow, customer confirms via WhatsApp and admin updates status.
        This endpoint updates order status to 'confirmed'.
        """
        try:
            order = self.get_object()
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if order.order_status not in ['pending', 'confirmed']:
            return Response(
                {'error': f'Cannot confirm payment for order in {order.order_status} status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = order.order_status
        order.order_status = 'confirmed'
        order.save()
        
        # Create status history
        OrderStatusHistory.objects.create(
            order=order,
            from_status=old_status,
            to_status='confirmed',
            notes='Payment confirmed via WhatsApp'
        )
        
        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, reference=None):
        """Update order status (admin only in production)."""
        try:
            order = self.get_object()
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if new_status not in dict(Order.ORDER_STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = order.order_status
        order.order_status = new_status
        order.save()
        
        # Create status history
        OrderStatusHistory.objects.create(
            order=order,
            from_status=old_status,
            to_status=new_status,
            changed_by=request.user if request.user.is_authenticated else None,
            notes=notes
        )
        
        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def status_history(self, request, reference=None):
        """Get order status history."""
        try:
            order = self.get_object()
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        history = order.status_history.all()
        serializer = OrderStatusHistorySerializer(history, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, reference=None):
        """Cancel an order if possible."""
        try:
            order = self.get_object()
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not order.can_be_cancelled:
            return Response(
                {'error': f'Cannot cancel order in {order.order_status} status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = order.order_status
        order.order_status = 'cancelled'
        order.save()
        
        OrderStatusHistory.objects.create(
            order=order,
            from_status=old_status,
            to_status='cancelled',
            changed_by=request.user if request.user.is_authenticated else None,
            notes=request.data.get('reason', '')
        )
        
        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)
