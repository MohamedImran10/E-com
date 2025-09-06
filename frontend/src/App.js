import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

import { AppProvider, useApp } from './contexts/AppContext';
import Navigation from './components/Navigation';
import ProductListPage from './components/ProductListPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import WishlistPage from './components/WishlistPage';

const AppContent = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'cart':
        return <CartPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'products':
      default:
        return <ProductListPage />;
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navigation />
      <main className="flex-grow-1">
        {renderPage()}
      </main>
      <footer className="footer py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="fw-bold">E-Shop</h5>
              <p className="mb-0">Your premium shopping destination</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">&copy; 2025 E-Shop. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
