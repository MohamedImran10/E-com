#!/bin/bash

echo "🔧 Starting Backend Server Only for Testing"

cd /home/imran/Desktop/E-com/ecom_backend

# Kill any existing Django server
pkill -f "python manage.py runserver" 2>/dev/null || true

# Activate virtual environment
source venv/bin/activate

echo "📦 Installing any missing dependencies..."
pip install -r requirements.txt -q

echo "🗄️ Running database migrations..."
python manage.py migrate

echo "🚀 Starting Django server on http://localhost:8000"
echo "📊 Admin panel: http://localhost:8000/admin"
echo "🔌 API endpoints: http://localhost:8000/api/"
echo ""
echo "Press Ctrl+C to stop the server"

python manage.py runserver 8000
