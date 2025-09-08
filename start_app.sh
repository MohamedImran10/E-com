#!/bin/bash

echo "🚀 Starting E-commerce Application Stack"
echo "========================================="

# Navigate to project root
cd /home/imran/Desktop/E-com

echo "📦 Installing frontend dependencies..."
npm install

echo "🔧 Building frontend..."
npm run build

echo "📋 Project Structure:"
echo "- Frontend: React app with integrated API"
echo "- Backend: Django REST API"
echo "- Database: SQLite with sample data"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Start backend: cd ecom_backend && python manage.py runserver"
echo "2. Start frontend: npm start"
echo "3. Visit: http://localhost:3000"
