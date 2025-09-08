#!/usr/bin/env python
import os
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecom_project.settings')
    django.setup()
    
    from store.models import Category, Item
    from django.contrib.auth.models import User
    
    # Create sample data
    print("Creating sample data...")
    
    # Create categories
    categories_data = [
        {"name": "Electronics", "description": "Electronic devices and gadgets", "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400"},
        {"name": "Clothing", "description": "Fashion and apparel", "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"},
        {"name": "Books", "description": "Books and educational materials", "image": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"},
        {"name": "Home & Garden", "description": "Home decor and garden supplies", "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"},
        {"name": "Sports", "description": "Sports equipment and accessories", "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"},
    ]
    
    categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data["name"],
            defaults=cat_data
        )
        categories.append(category)
        if created:
            print(f"Created category: {category.name}")
    
    # Create items
    items_data = [
        # Electronics
        {"name": "iPhone 15 Pro", "description": "Latest Apple smartphone with advanced features", "price": 79999.00, "category": "Electronics", "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", "stock_quantity": 50, "is_featured": True},
        {"name": "Samsung Galaxy Watch", "description": "Smartwatch with health tracking", "price": 24999.00, "category": "Electronics", "image": "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400", "stock_quantity": 30},
        {"name": "MacBook Air M2", "description": "Apple laptop with M2 chip", "price": 119999.00, "category": "Electronics", "image": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400", "stock_quantity": 25, "is_featured": True},
        {"name": "Sony Headphones", "description": "Noise-cancelling wireless headphones", "price": 15999.00, "category": "Electronics", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "stock_quantity": 40},
        
        # Clothing
        {"name": "Cotton T-Shirt", "description": "Comfortable cotton t-shirt", "price": 799.00, "category": "Clothing", "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", "stock_quantity": 100},
        {"name": "Denim Jeans", "description": "Classic blue denim jeans", "price": 2499.00, "category": "Clothing", "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", "stock_quantity": 75},
        {"name": "Winter Jacket", "description": "Warm winter jacket", "price": 4999.00, "category": "Clothing", "image": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400", "stock_quantity": 35, "is_featured": True},
        
        # Books
        {"name": "Python Programming", "description": "Learn Python programming", "price": 1299.00, "category": "Books", "image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400", "stock_quantity": 60},
        {"name": "Data Science Handbook", "description": "Complete guide to data science", "price": 1999.00, "category": "Books", "image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", "stock_quantity": 45},
        
        # Home & Garden
        {"name": "Ceramic Vase", "description": "Beautiful ceramic vase for home decor", "price": 1599.00, "category": "Home & Garden", "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "stock_quantity": 20},
        {"name": "Garden Tools Set", "description": "Complete set of garden tools", "price": 3499.00, "category": "Home & Garden", "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", "stock_quantity": 15},
        
        # Sports
        {"name": "Yoga Mat", "description": "Non-slip yoga mat", "price": 999.00, "category": "Sports", "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", "stock_quantity": 80},
        {"name": "Basketball", "description": "Professional basketball", "price": 1299.00, "category": "Sports", "image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400", "stock_quantity": 50, "is_featured": True},
    ]
    
    for item_data in items_data:
        category = Category.objects.get(name=item_data["category"])
        item_data["category"] = category
        
        item, created = Item.objects.get_or_create(
            name=item_data["name"],
            defaults=item_data
        )
        if created:
            print(f"Created item: {item.name}")
    
    print("Sample data created successfully!")
    print("You can now run: python manage.py runserver")
