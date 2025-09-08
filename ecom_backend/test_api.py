#!/usr/bin/env python3
import os
import sys
import django
import json

# Add the project directory to the Python path
project_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(project_dir)

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecom_project.settings')
django.setup()

from store.models import Item, Category
from store.serializers import ItemSerializer

def test_api_data():
    print("=== Backend API Test ===")
    
    # Test items
    items = Item.objects.all()
    print(f"Total items in database: {items.count()}")
    
    if items.exists():
        print("\nSample items:")
        for item in items[:3]:
            print(f"- {item.name}: ₹{item.price}")
    
    # Test categories
    categories = Category.objects.all()
    print(f"\nTotal categories: {categories.count()}")
    for cat in categories:
        print(f"- {cat.name}")
    
    # Test serializer
    print("\n=== Testing Serializer ===")
    if items.exists():
        serializer = ItemSerializer(items.first())
        print("Sample serialized item:")
        print(json.dumps(serializer.data, indent=2))

if __name__ == "__main__":
    test_api_data()
