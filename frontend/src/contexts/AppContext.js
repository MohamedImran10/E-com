import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Mock products with Indian products and pricing
const mockProducts = [
  { 
    id: 1, 
    name: 'Wireless Bluetooth Headphones', 
    price: 2999, 
    category: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', 
    rating: 4.5,
    description: 'Premium quality wireless headphones with noise cancellation'
  },
  { 
    id: 2, 
    name: 'Smart Fitness Watch', 
    price: 4999, 
    category: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop', 
    rating: 4.3,
    description: 'Track your fitness goals with this advanced smartwatch'
  },
  { 
    id: 3, 
    name: 'Running Sports Shoes', 
    price: 1999, 
    category: 'Fashion', 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop', 
    rating: 4.7,
    description: 'Comfortable running shoes for all your fitness activities'
  },
  { 
    id: 4, 
    name: 'Coffee Maker Machine', 
    price: 3499, 
    category: 'Home & Kitchen', 
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop', 
    rating: 4.2,
    description: 'Brew perfect coffee every morning with this premium machine'
  },
  { 
    id: 5, 
    name: 'Laptop Stand Adjustable', 
    price: 899, 
    category: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop', 
    rating: 4.4,
    description: 'Ergonomic laptop stand for better posture while working'
  },
  { 
    id: 6, 
    name: 'Premium Yoga Mat', 
    price: 1299, 
    category: 'Sports', 
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop', 
    rating: 4.6,
    description: 'Non-slip yoga mat for your daily meditation and exercise'
  },
  { 
    id: 7, 
    name: 'Wireless Mouse', 
    price: 799, 
    category: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1563297007-0686b4ac4de4?w=300&h=200&fit=crop', 
    rating: 4.1,
    description: 'Ergonomic wireless mouse with long battery life'
  },
  { 
    id: 8, 
    name: 'Designer Backpack', 
    price: 2499, 
    category: 'Fashion', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop', 
    rating: 4.8,
    description: 'Stylish and spacious backpack for daily use'
  }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products] = useState(mockProducts);
  const [currentPage, setCurrentPage] = useState('products');
  const [wishlist, setWishlist] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('eShopCart');
    const savedWishlist = localStorage.getItem('eShopWishlist');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eShopCart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eShopWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const addToWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (!exists) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@example.com' && password === 'password') {
      setUser({ id: 1, name: 'John Doe', email });
      return true;
    }
    return false;
  };

  const signup = async (name, email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ id: 1, name, email });
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('eShopCart');
    localStorage.removeItem('eShopWishlist');
  };

  const value = {
    user,
    cart,
    products,
    currentPage,
    wishlist,
    setUser,
    addToCart,
    removeFromCart,
    updateQuantity,
    setCurrentPage,
    login,
    signup,
    logout,
    addToWishlist,
    removeFromWishlist
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
