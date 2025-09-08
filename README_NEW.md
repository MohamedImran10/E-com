# E-commerce Full Stack Application

A modern, full-stack e-commerce application built with React frontend and Django REST API backend.

## 🚀 Features

### Frontend (React)
- **Modern UI/UX** with Bootstrap and custom styling
- **Product Catalog** with search, filters, and categories
- **Shopping Cart** with add/remove/update functionality
- **Wishlist** for saving favorite items
- **User Authentication** (login/signup)
- **Responsive Design** for all devices
- **Real-time Updates** with API integration

### Backend (Django REST API)
- **JWT Authentication** for secure user management
- **RESTful API** with full CRUD operations
- **Product Management** with categories
- **Cart & Wishlist** endpoints
- **Admin Interface** for backend management
- **CORS Configuration** for frontend integration
- **Sample Data** for immediate testing

## 🛠️ Technology Stack

**Frontend:**
- React 18
- Bootstrap 5
- Lucide React (icons)
- Fetch API for HTTP requests

**Backend:**
- Django 4.2
- Django REST Framework
- JWT Authentication
- SQLite Database
- CORS Headers

## 📁 Project Structure

```
E-com/
├── ecom_backend/           # Django REST API
│   ├── ecom_project/       # Django project settings
│   ├── store/              # Main app with models/views
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   └── db.sqlite3          # SQLite database
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── contexts/           # React context (state management)
│   ├── services/           # API service layer
│   └── styles/             # Custom CSS
├── public/                 # React public assets
├── package.json            # Frontend dependencies
├── .env                    # Environment variables
└── vercel.json            # Deployment configuration
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd ecom_backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create sample data:**
   ```bash
   python create_sample_data.py
   ```

5. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

   Frontend will be available at: `http://localhost:3000`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - Login (get JWT tokens)
- `POST /api/auth/refresh/` - Refresh token
- `GET/PUT /api/auth/profile/` - User profile

### Products
- `GET /api/items/` - List products (with search & filters)
- `GET /api/items/featured/` - Featured products
- `GET /api/categories/` - List categories

### Cart (requires authentication)
- `GET /api/cart/` - Get user cart
- `POST /api/cart/add/` - Add to cart
- `PUT /api/cart/update/{id}/` - Update quantity
- `DELETE /api/cart/remove/{id}/` - Remove item

### Wishlist (requires authentication)
- `GET /api/wishlist/` - Get wishlist
- `POST /api/wishlist/add/` - Add to wishlist
- `DELETE /api/wishlist/remove/{id}/` - Remove from wishlist

## 🧪 Testing

### Test the Complete Application

1. **Start Backend:**
   ```bash
   cd ecom_backend
   python manage.py runserver
   ```

2. **Start Frontend (in new terminal):**
   ```bash
   npm start
   ```

3. **Test Flow:**
   - Visit `http://localhost:3000`
   - Browse products
   - Register a new account
   - Login with your credentials
   - Add products to cart and wishlist
   - Manage cart items

### API Testing with curl
```bash
# Get products
curl http://localhost:8000/api/items/

# Register user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

## 🌐 Deployment

### Backend Deployment (Render/Heroku)

1. **Deploy to Render:**
   - Create new Web Service
   - Connect GitHub repository
   - Select `ecom_backend` folder
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `gunicorn ecom_project.wsgi:application`

### Frontend Deployment (Vercel/Netlify)

1. **Deploy to Vercel:**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Update API URL:**
   - Set `REACT_APP_API_URL` to your deployed backend URL

## 👥 Admin Access

- **URL:** `http://localhost:8000/admin/`
- **Username:** `admin`
- **Password:** Set using `python manage.py changepassword admin`

## 📱 Features Walkthrough

1. **Browse Products:** View all products with search and filter options
2. **User Registration:** Create new account with email verification
3. **User Login:** Secure JWT-based authentication
4. **Add to Cart:** Add products with quantity selection
5. **Manage Cart:** Update quantities, remove items
6. **Wishlist:** Save favorite products for later
7. **Responsive Design:** Works on desktop, tablet, and mobile

---

**Your E-commerce Application is Ready! 🎉**

Start both servers and visit `http://localhost:3000` to see your full-stack e-commerce application in action!
