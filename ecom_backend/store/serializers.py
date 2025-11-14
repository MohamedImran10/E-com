from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Item, Cart, CartItem, Wishlist, UserProfile, Order, OrderItem

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')

class CategorySerializer(serializers.ModelSerializer):
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'description', 'image', 'items_count', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_items_count(self, obj):
        return obj.items.filter(is_active=True).count()

class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Item
        fields = ('id', 'name', 'description', 'price', 'category', 'category_name', 
                 'image', 'stock_quantity', 'is_featured', 'is_active', 'is_in_stock',
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class CartItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_price = serializers.DecimalField(source='item.price', max_digits=10, decimal_places=2, read_only=True)
    item_image = serializers.URLField(source='item.image', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'item', 'item_name', 'item_price', 'item_image', 
                 'quantity', 'total_price', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'total_price', 'total_items', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

class WishlistSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'user', 'items', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'phone', 'address', 'city', 'state', 'pincode', 
                 'date_of_birth', 'avatar', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

class OrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_image = serializers.URLField(source='item.image', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'item', 'item_name', 'item_image', 'quantity', 'price', 'total_price')
        read_only_fields = ('id',)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    order_status_display = serializers.CharField(source='get_order_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'order_number', 'user', 'user_name', 'total_amount', 
                 'order_status', 'order_status_display', 'payment_status', 'payment_status_display',
                 'payment_method', 'shipping_address', 'notes', 'items', 'created_at', 'updated_at')
        read_only_fields = ('id', 'order_number', 'user', 'created_at', 'updated_at')

class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.CharField()
    payment_method = serializers.CharField(default='online')
    notes = serializers.CharField(required=False, allow_blank=True)
