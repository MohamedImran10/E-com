import React from 'react';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { ShoppingCart, User, Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Navigation = () => {
  const { user, cart, wishlist, setCurrentPage, logout } = useApp();
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top border-bottom">
      <Container>
        <Navbar.Brand 
          href="#" 
          onClick={() => setCurrentPage('products')}
          className="fw-bold fs-3 text-primary"
          style={{ cursor: 'pointer' }}
        >
          <span className="text-gradient">E-Shop</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              href="#" 
              onClick={() => setCurrentPage('products')}
              className="fw-medium"
            >
              Products
            </Nav.Link>
            <Nav.Link 
              href="#" 
              onClick={() => setCurrentPage('categories')}
              className="fw-medium"
            >
              Categories
            </Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            {user ? (
              <>
                <Dropdown align="end" className="me-3">
                  <Dropdown.Toggle 
                    variant="outline-primary" 
                    className="border-0 d-flex align-items-center"
                  >
                    <User size={18} className="me-2" />
                    {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setCurrentPage('profile')}>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setCurrentPage('orders')}>
                      My Orders
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} className="text-danger">
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link 
                  href="#" 
                  onClick={() => setCurrentPage('login')}
                  className="btn btn-outline-primary me-2"
                >
                  Login
                </Nav.Link>
                <Nav.Link 
                  href="#" 
                  onClick={() => setCurrentPage('signup')}
                  className="btn btn-primary text-white"
                >
                  Sign Up
                </Nav.Link>
              </>
            )}
            
            <Nav.Link 
              href="#" 
              onClick={() => setCurrentPage('wishlist')}
              className="position-relative me-2"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Nav.Link>
            
            <Nav.Link 
              href="#" 
              onClick={() => setCurrentPage('cart')}
              className="position-relative"
            >
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <Badge 
                  bg="primary" 
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
