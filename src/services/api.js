const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
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
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
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
    const response = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        username: email,
        email,
        password,
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' '),
      }),
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

export default new ApiService();
