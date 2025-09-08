#!/bin/bash

echo "🚀 Starting E-commerce Development Environment"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to start backend
start_backend() {
    echo "🔧 Starting Django Backend..."
    cd ecom_backend
    
    # Activate virtual environment
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    
    # Install dependencies
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Run migrations
    echo "Running database migrations..."
    python manage.py migrate
    
    # Start server
    echo "✅ Backend starting on http://localhost:8000"
    python manage.py runserver 8000 &
    BACKEND_PID=$!
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "⚛️ Starting React Frontend..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "Installing Node.js dependencies..."
        npm install
    fi
    
    # Start React development server
    echo "✅ Frontend starting on http://localhost:3000"
    npm start &
    FRONTEND_PID=$!
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo "✅ Development environment stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start both servers
start_backend
start_frontend

echo ""
echo "🎉 Development environment is ready!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "📊 Admin: http://localhost:8000/admin"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for servers to start
sleep 5

# Keep script running
wait
