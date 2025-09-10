import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState('products');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeApp = async () => {
    setLoading(true);
    try {
      // Check if user is already logged in
      const token = localStorage.getItem('authToken');
      if (token) {
        ApiService.setToken(token);
        try {
          const userProfile = await ApiService.getUserProfile();
          setUser(userProfile);
          
          // Load user's cart and wishlist
          await Promise.all([
            loadCart(),
            loadWishlist()
          ]);
        } catch (error) {
          // Token might be expired, remove it
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          ApiService.setToken(null);
        }
      }

      // Load products and categories
      await Promise.all([
        loadProducts(),
        loadCategories()
      ]);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setError('Failed to load application data');
    } finally {
      setLoading(false);
    }
  };

  // Initialize app data on mount
  useEffect(() => {
    initializeApp();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = async () => {
    console.log('Loading products...');
    try {
      const data = await ApiService.getProducts();
      console.log('Products API response:', data);
      setProducts(data.results || data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Failed to load products:', error);
      setError(`Failed to load products: ${error.message}`);
    }
  };

  const loadCategories = async () => {
    console.log('Loading categories...');
    try {
      const data = await ApiService.getCategories();
      console.log('Categories API response:', data);
      setCategories(data.results || data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError(`Failed to load categories: ${error.message}`);
    }
  };

  const loadCart = async () => {
    if (!user) return;
    try {
      setError(null); // Clear any previous errors
      const data = await ApiService.getCart();
      console.log('Raw cart data:', data);
      const normalizedItems = (data.items || []).map(item => ({
        id: item.id,
        item: item.item,
        name: item.item_name || item.name,
        price: parseFloat(item.item_price || item.price || 0),
        image: item.item_image || item.image,
        category: item.category_name || item.category,
        quantity: item.quantity || 1,
        total_price: item.total_price || (parseFloat(item.item_price || item.price || 0) * (item.quantity || 1))
      }));
      console.log('Normalized cart items:', normalizedItems);
      setCart(normalizedItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const loadWishlist = async () => {
    if (!user) return;
    try {
      setError(null); // Clear any previous errors
      const data = await ApiService.getWishlist();
      setWishlist(data.items || []);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      setError('Please login to add items to cart');
      return false;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      await ApiService.addToCart(product.id, quantity);
      await loadCart(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setError('Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return false;

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      await ApiService.removeFromCart(productId);
      await loadCart(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setError('Failed to remove item from cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return false;

    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      await ApiService.updateCartItem(productId, quantity);
      await loadCart(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setError('Failed to update item quantity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      setError('Please login to add items to wishlist');
      return false;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      await ApiService.addToWishlist(product.id);
      await loadWishlist(); // Refresh wishlist
      return true;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      setError('Failed to add item to wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return false;

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      await ApiService.removeFromWishlist(productId);
      await loadWishlist(); // Refresh wishlist
      return true;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      setError('Failed to remove item from wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.login(email, password);
      
      // Store refresh token
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      }
      
      // Get user profile
      const userProfile = await ApiService.getUserProfile();
      setUser(userProfile);
      
      // Load user data
      await Promise.all([
        loadCart(),
        loadWishlist()
      ]);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await ApiService.register(name, email, password);
      
      // Auto-login after successful registration
      return await login(email, password);
    } catch (error) {
      console.error('Signup failed:', error);
      setError(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    ApiService.logout();
    setUser(null);
    setCart([]);
    setWishlist([]);
    setCurrentPage('products');
  };

  const searchProducts = async (query, filters = {}) => {
    try {
      setLoading(true);
      const params = { search: query, ...filters };
      const data = await ApiService.getProducts(params);
      setProducts(data.results || data);
      return data.results || data;
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    cart,
    products,
    categories,
    currentPage,
    wishlist,
    loading,
    error,
    setUser,
    addToCart,
    removeFromCart,
    updateQuantity,
    setCurrentPage,
    login,
    signup,
    logout,
    addToWishlist,
    removeFromWishlist,
    searchProducts,
    loadProducts,
    loadCategories,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};