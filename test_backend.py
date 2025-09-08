#!/usr/bin/env python3
"""
Test script to verify Django backend is working
"""
import os
import sys
import subprocess
import time
import requests

def test_backend():
    print("Testing Django E-commerce Backend...")
    
    # Change to backend directory
    backend_dir = "/home/imran/Desktop/E-com/ecom_backend"
    os.chdir(backend_dir)
    
    # Test if manage.py exists
    if not os.path.exists("manage.py"):
        print("❌ manage.py not found!")
        return False
    
    print("✅ Backend directory found")
    
    # Check if server is already running
    try:
        response = requests.get("http://localhost:8000/api/items/", timeout=2)
        print("✅ Backend server is already running")
        return True
    except:
        print("📡 Starting backend server...")
    
    # Start the server
    try:
        # Run migrations first
        print("🔄 Running migrations...")
        subprocess.run([sys.executable, "manage.py", "migrate"], check=True)
        
        # Create sample data if it doesn't exist
        print("📦 Creating sample data...")
        subprocess.run([sys.executable, "create_sample_data.py"], check=False)
        
        # Test API endpoints
        print("🧪 Testing API endpoints...")
        
        # Start server in background for testing
        server_process = subprocess.Popen([sys.executable, "manage.py", "runserver"])
        time.sleep(3)  # Wait for server to start
        
        # Test endpoints
        endpoints = [
            "/api/items/",
            "/api/categories/",
        ]
        
        for endpoint in endpoints:
            try:
                response = requests.get(f"http://localhost:8000{endpoint}", timeout=5)
                if response.status_code == 200:
                    print(f"✅ {endpoint} - OK")
                else:
                    print(f"⚠️ {endpoint} - Status: {response.status_code}")
            except Exception as e:
                print(f"❌ {endpoint} - Error: {e}")
        
        server_process.terminate()
        return True
        
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return False

if __name__ == "__main__":
    test_backend()
