# E-commerce Django Backend

This is a Django REST API backend for an e-commerce application with JWT authentication, product management, cart functionality, and wishlist features.

## Features

- **Authentication**: JWT-based authentication with user registration and login
- **Product Management**: Categories and items with filtering, search, and pagination
- **Cart System**: Add, update, remove items from cart with stock validation
- **Wishlist**: Save items for later purchase
- **Admin Interface**: Django admin for managing products and orders
- **CORS Support**: Configured for frontend integration
- **PostgreSQL Database**: Production-ready database configuration

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (get JWT tokens)
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET/PUT /api/auth/profile/` - Get/update user profile

### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create new category (admin)
- `GET /api/categories/{id}/` - Get category details
- `PUT/DELETE /api/categories/{id}/` - Update/delete category (admin)

### Items
- `GET /api/items/` - List all items (with filtering and search)
- `POST /api/items/` - Create new item (admin)
- `GET /api/items/{id}/` - Get item details
- `PUT/DELETE /api/items/{id}/` - Update/delete item (admin)
- `GET /api/items/featured/` - Get featured items

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/{item_id}/` - Update cart item quantity
- `DELETE /api/cart/remove/{item_id}/` - Remove item from cart
- `DELETE /api/cart/clear/` - Clear entire cart

### Wishlist
- `GET /api/wishlist/` - Get user's wishlist
- `POST /api/wishlist/add/` - Add item to wishlist
- `DELETE /api/wishlist/remove/{item_id}/` - Remove item from wishlist

## Installation

1. **Clone and setup virtual environment:**
   ```bash
   cd ecom_backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

5. **Create sample data (optional):**
   ```bash
   python create_sample_data.py
   ```

6. **Run development server:**
   ```bash
   python manage.py runserver
   ```

## Deployment to Render

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure environment variables:**
   - `SECRET_KEY`: Your Django secret key
   - `DEBUG`: False
   - `DATABASE_NAME`: Your PostgreSQL database name
   - `DATABASE_USER`: Your PostgreSQL username
   - `DATABASE_PASSWORD`: Your PostgreSQL password
   - `DATABASE_HOST`: Your PostgreSQL host
   - `DATABASE_PORT`: 5432

4. **Build and Deploy:**
   - Render will automatically detect the `requirements.txt` and `Procfile`
   - The service will run migrations and start the server

## Frontend Integration

The backend is configured to work with the React frontend at:
- Local development: `http://localhost:3000`
- Production: `https://e-com-cyan-one.vercel.app`

### Example API Usage

**User Registration:**
```javascript
const response = await fetch('YOUR_BACKEND_URL/api/auth/register/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'secure_password',
    password_confirm: 'secure_password',
    first_name: 'John',
    last_name: 'Doe'
  })
});
```

**Get Products:**
```javascript
const response = await fetch('YOUR_BACKEND_URL/api/items/?category=1&search=phone');
const products = await response.json();
```

**Add to Cart (requires authentication):**
```javascript
const response = await fetch('YOUR_BACKEND_URL/api/cart/add/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    item_id: 1,
    quantity: 2
  })
});
```

## Project Structure

```
ecom_backend/
├── ecom_project/
│   ├── settings.py          # Django settings
│   ├── urls.py             # Main URL configuration
│   └── wsgi.py             # WSGI configuration
├── store/
│   ├── models.py           # Database models
│   ├── serializers.py      # DRF serializers
│   ├── views.py            # API views
│   ├── urls.py             # Store app URLs
│   └── admin.py            # Admin configuration
├── requirements.txt        # Python dependencies
├── Procfile               # Render deployment config
├── runtime.txt            # Python version for Render
└── create_sample_data.py  # Sample data creation script
```

## Technologies Used

- **Django 4.2.7**: Web framework
- **Django REST Framework**: API development
- **SimpleJWT**: JWT authentication
- **PostgreSQL**: Database
- **Gunicorn**: WSGI server for production
- **WhiteNoise**: Static file serving
- **CORS Headers**: Cross-origin resource sharing

## License

This project is licensed under the MIT License.
