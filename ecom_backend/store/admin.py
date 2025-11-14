from django.contrib import admin
from .models import Category, Item, Cart, CartItem, Wishlist, UserProfile, Order, OrderItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock_quantity', 'is_featured', 'is_active', 'created_at')
    list_filter = ('category', 'is_featured', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('price', 'stock_quantity', 'is_featured', 'is_active')

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'total_price', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at', 'total_items', 'total_price')
    list_filter = ('created_at',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'item', 'quantity', 'total_price', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('created_at', 'updated_at', 'total_price')

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('items',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'city', 'state', 'created_at', 'updated_at')
    list_filter = ('city', 'state', 'created_at')
    search_fields = ('user__username', 'user__email', 'phone', 'city')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'total_amount', 'order_status', 'payment_status', 'created_at')
    list_filter = ('order_status', 'payment_status', 'created_at')
    search_fields = ('order_number', 'user__username', 'user__email')
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    list_editable = ('order_status', 'payment_status')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'item', 'quantity', 'price', 'total_price', 'created_at')
    list_filter = ('order__created_at',)
    search_fields = ('order__order_number', 'item__name')
    readonly_fields = ('created_at', 'total_price')
