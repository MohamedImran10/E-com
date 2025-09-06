import React from 'react';
import { Container, Row, Col, Card, Button, Image, Alert } from 'react-bootstrap';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, setCurrentPage } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 100; // Free shipping over ₹2000
  const total = subtotal + shipping;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="mb-4">
              <ShoppingCart size={80} className="text-muted" />
            </div>
            <h2 className="fw-bold mb-3">Your cart is empty</h2>
            <p className="text-muted mb-4">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setCurrentPage('products')}
              className="d-flex align-items-center mx-auto"
            >
              <ArrowLeft size={20} className="me-2" />
              Start Shopping
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex align-items-center mb-4">
            <Button 
              variant="outline-secondary" 
              className="me-3"
              onClick={() => setCurrentPage('products')}
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="fw-bold mb-0">Shopping Cart</h1>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Cart Items */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Cart Items ({cart.length})</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {cart.map(item => (
                <div key={item.id} className="border-bottom p-4">
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-100 rounded"
                        style={{ height: '80px', objectFit: 'cover' }}
                      />
                    </Col>
                    
                    <Col md={4}>
                      <h6 className="fw-semibold mb-1">{item.name}</h6>
                      <p className="text-muted small mb-0">{item.category}</p>
                    </Col>
                    
                    <Col md={2} className="text-center">
                      <span className="fw-bold">{formatPrice(item.price)}</span>
                    </Col>
                    
                    <Col md={3}>
                      <div className="d-flex align-items-center justify-content-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="mx-3 fw-semibold">{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </Col>
                    
                    <Col md={1} className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="shadow-sm position-sticky" style={{ top: '20px' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className={shipping === 0 ? 'text-success' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              
              {shipping > 0 && (
                <Alert variant="info" className="small p-2">
                  Add {formatPrice(2000 - subtotal)} more for free shipping!
                </Alert>
              )}
              
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 mt-3"
                onClick={() => alert('Checkout functionality would be implemented here!')}
              >
                Proceed to Checkout
              </Button>
              
              <Button 
                variant="outline-primary" 
                className="w-100 mt-2"
                onClick={() => setCurrentPage('products')}
              >
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
