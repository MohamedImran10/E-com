from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

# Create router for viewsets (if needed in future)
router = DefaultRouter()

urlpatterns = [
    # Authentication URLs
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.UserRegistrationView.as_view(), name='user_register'),
    path('auth/profile/', views.UserProfileView.as_view(), name='user_profile'),
    
    # Category URLs
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category_detail'),
    
    # Item URLs
    path('items/', views.ItemListView.as_view(), name='item_list'),
    path('items/<int:pk>/', views.ItemDetailView.as_view(), name='item_detail'),
    path('items/featured/', views.FeaturedItemsView.as_view(), name='featured_items'),
    
    # Cart URLs
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/update/<int:item_id>/', views.update_cart_item, name='update_cart_item'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/clear/', views.clear_cart, name='clear_cart'),
    
    # Wishlist URLs
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/add/', views.add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/remove/<int:item_id>/', views.remove_from_wishlist, name='remove_from_wishlist'),
    
    # User Profile URLs
    path('profile/', views.UserProfileDetailView.as_view(), name='user_profile_detail'),
    
    # Order URLs
    path('orders/', views.OrderListView.as_view(), name='order_list'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order_detail'),
    path('orders/create/', views.create_order, name='create_order'),
    path('orders/<int:order_id>/payment/', views.simulate_payment, name='simulate_payment'),
]

# Include router URLs
urlpatterns += router.urls
