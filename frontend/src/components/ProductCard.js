import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  
  const isInWishlist = wishlist.some(item => item.id === product.id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product);
    setIsAdding(false);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < Math.floor(rating) ? 'text-warning' : 'text-muted'}
        fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <Card className="h-100 shadow-sm hover-card position-relative">
      <div className="position-relative overflow-hidden">
        <Card.Img 
          variant="top" 
          src={product.image} 
          style={{ height: '200px', objectFit: 'cover' }}
          className="product-image"
        />
        <Button
          variant={isInWishlist ? "danger" : "outline-light"}
          size="sm"
          className="position-absolute top-0 end-0 m-2 rounded-circle p-2"
          onClick={handleWishlistToggle}
        >
          <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
        </Button>
        <Badge 
          bg="success" 
          className="position-absolute top-0 start-0 m-2"
        >
          {product.category}
        </Badge>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6 fw-bold text-truncate">{product.name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {product.description}
        </Card.Text>
        
        <div className="d-flex align-items-center mb-2">
          <div className="me-2">
            {renderStars(product.rating)}
          </div>
          <small className="text-muted">({product.rating})</small>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <span className="fs-5 fw-bold text-primary">{formatPrice(product.price)}</span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="d-flex align-items-center"
          >
            <ShoppingCart size={16} className="me-1" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
