import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Heart, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ProductCard from './ProductCard';

const WishlistPage = () => {
  const { wishlist, setCurrentPage } = useApp();

  if (wishlist.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="mb-4">
              <Heart size={80} className="text-muted" />
            </div>
            <h2 className="fw-bold mb-3">Your wishlist is empty</h2>
            <p className="text-muted mb-4">
              Save your favorite items to your wishlist for later.
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
            <h1 className="fw-bold mb-0">
              <Heart size={32} className="me-2 text-danger" />
              My Wishlist ({wishlist.length})
            </h1>
          </div>
        </Col>
      </Row>

      <Row>
        {wishlist.map(product => (
          <Col key={product.id} sm={6} lg={3} className="mb-4">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WishlistPage;
