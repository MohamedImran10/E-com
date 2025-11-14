from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Item, Cart, CartItem, Wishlist, UserProfile, Order, OrderItem
from .serializers import (
    UserRegistrationSerializer, UserSerializer, CategorySerializer,
    ItemSerializer, CartSerializer, CartItemSerializer, WishlistSerializer,
    UserProfileSerializer, OrderSerializer, CreateOrderSerializer, OrderItemSerializer
)

# Authentication Views
class CustomTokenObtainPairView(TokenObtainPairView):
    pass

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# Category Views
class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# Item Views
class ItemListView(generics.ListCreateAPIView):
    queryset = Item.objects.filter(is_active=True)
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.filter(is_active=True)
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class FeaturedItemsView(generics.ListAPIView):
    queryset = Item.objects.filter(is_active=True, is_featured=True)
    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]

# Cart Views
class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_cart(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity', 1)

    try:
        item = Item.objects.get(id=item_id, is_active=True)
    except Item.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

    if quantity > item.stock_quantity:
        return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, item=item)

    if not created:
        if cart_item.quantity + quantity > item.stock_quantity:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity

    cart_item.save()

    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_cart_item(request, item_id):
    quantity = request.data.get('quantity', 1)

    try:
        cart = Cart.objects.get(user=request.user)
        cart_item = CartItem.objects.get(cart=cart, item_id=item_id)
    except (Cart.DoesNotExist, CartItem.DoesNotExist):
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    if quantity <= 0:
        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)

    if quantity > cart_item.item.stock_quantity:
        return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

    cart_item.quantity = quantity
    cart_item.save()

    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_cart(request, item_id):
    try:
        cart = Cart.objects.get(user=request.user)
        cart_item = CartItem.objects.get(cart=cart, item_id=item_id)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
    except (Cart.DoesNotExist, CartItem.DoesNotExist):
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_cart(request):
    try:
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'message': 'Cart is already empty'}, status=status.HTTP_200_OK)

# Wishlist Views
class WishlistView(generics.RetrieveAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        wishlist, created = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_wishlist(request):
    item_id = request.data.get('item_id')

    try:
        item = Item.objects.get(id=item_id, is_active=True)
    except Item.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

    wishlist, created = Wishlist.objects.get_or_create(user=request.user)
    
    if item in wishlist.items.all():
        return Response({'message': 'Item already in wishlist'}, status=status.HTTP_200_OK)

    wishlist.items.add(item)
    return Response({'message': 'Item added to wishlist'}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_wishlist(request, item_id):
    try:
        wishlist = Wishlist.objects.get(user=request.user)
        item = Item.objects.get(id=item_id)
        wishlist.items.remove(item)
        return Response({'message': 'Item removed from wishlist'}, status=status.HTTP_200_OK)
    except (Wishlist.DoesNotExist, Item.DoesNotExist):
        return Response({'error': 'Item not found in wishlist'}, status=status.HTTP_404_NOT_FOUND)

# User Profile Views
class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

# Order Views
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_order(request):
    serializer = CreateOrderSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart = Cart.objects.get(user=request.user)
        cart_items = cart.items.all()
        
        if not cart_items:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_amount=cart.total_price,
            shipping_address=serializer.validated_data['shipping_address'],
            payment_method=serializer.validated_data.get('payment_method', 'online'),
            notes=serializer.validated_data.get('notes', '')
        )

        # Create order items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                item=cart_item.item,
                quantity=cart_item.quantity,
                price=cart_item.item.price
            )

        # Clear cart after order creation
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def simulate_payment(request, order_id):
    """Simulate payment processing"""
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        
        # Simulate payment success (you can add logic to randomly succeed/fail)
        payment_success = True  # In real app, this would be from payment gateway
        
        if payment_success:
            order.payment_status = 'completed'
            order.order_status = 'processing'
            order.save()
            
            return Response({
                'message': 'Payment successful',
                'order_number': order.order_number,
                'payment_status': order.payment_status
            }, status=status.HTTP_200_OK)
        else:
            order.payment_status = 'failed'
            order.save()
            return Response({
                'error': 'Payment failed',
                'order_number': order.order_number
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
