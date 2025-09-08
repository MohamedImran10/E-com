#!/bin/bash

echo "🧹 Cleaning up project for production..."

# Remove duplicate frontend folder since we're using root-level structure
if [ -d "frontend" ]; then
    echo "📂 Removing duplicate frontend folder..."
    rm -rf frontend/
fi

# Remove test files and development artifacts
echo "🗑️ Removing development artifacts..."
rm -f test_backend.py

# Remove unnecessary files
echo "📋 Removing unnecessary files..."
rm -f .nvmrc

# Create production-ready structure
echo "📁 Final project structure:"
echo "├── ecom_backend/          # Django REST API"
echo "├── src/                   # React frontend source"
echo "├── public/                # React public assets"
echo "├── package.json           # Frontend dependencies"
echo "├── .env                   # Environment variables"
echo "└── vercel.json           # Deployment config"

echo ""
echo "✅ Project cleaned for production!"
echo ""
echo "📦 To deploy:"
echo "1. Backend: Deploy ecom_backend/ to Render/Heroku"
echo "2. Frontend: Deploy root folder to Vercel/Netlify"
