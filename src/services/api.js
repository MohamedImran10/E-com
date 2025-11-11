const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
    
    // Debug logging to verify correct API URL
    console.log('API Configuration:', {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      baseURL: this.baseURL,
      isDevelopment: process.env.NODE_ENV === 'development'
    });
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      mode: 'cors',
      headers: this.getHeaders(),
      ...options,
    };

    console.log('Making API request to:', url);
    console.log('Request config:', config);

    try {
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('URL:', url);
      console.error('Config:', config);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to the backend server at ${this.baseURL}`);
      }
      
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username: email, password }),
    });
    
    this.setToken(response.access);
    return response;
  }

  async register(name, email, password) {
    const payload = {
      username: email,
      email,
      password,
      password_confirm: password,
      first_name: name.split(' ')[0] || '',
      last_name: name.split(' ').slice(1).join(' ') || '',
    };
    
    console.log('Registration payload:', payload);
    
    const response = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  }

  async getUserProfile() {
    return await this.request('/auth/profile/');
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    this.setToken(response.access);
    return response;
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('refreshToken');
  }

  // Products/Items
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/items/?${queryString}` : '/items/';
    return await this.request(endpoint);
  }

  async getProduct(id) {
    return await this.request(`/items/${id}/`);
  }

  async getFeaturedProducts() {
    return await this.request('/items/featured/');
  }

  // Categories
  async getCategories() {
    return await this.request('/categories/');
  }

  async getCategory(id) {
    return await this.request(`/categories/${id}/`);
  }

  // Cart
  async getCart() {
    return await this.request('/cart/');
  }

  async addToCart(itemId, quantity = 1) {
    return await this.request('/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, quantity }),
    });
  }

  async updateCartItem(itemId, quantity) {
    return await this.request(`/cart/update/${itemId}/`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId) {
    return await this.request(`/cart/remove/${itemId}/`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return await this.request('/cart/clear/', {
      method: 'DELETE',
    });
  }

  // Wishlist
  async getWishlist() {
    return await this.request('/wishlist/');
  }

  async addToWishlist(itemId) {
    return await this.request('/wishlist/add/', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId }),
    });
  }

  async removeFromWishlist(itemId) {
    return await this.request(`/wishlist/remove/${itemId}/`, {
      method: 'DELETE',
    });
  }
}

const apiService = new ApiService();
export default apiService;
