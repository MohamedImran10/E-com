import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Filter, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ProductCard from './ProductCard';

const ProductListPage = () => {
  const { products, categories, loading, error, loadProducts } = useApp();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const categoryOptions = ['all', ...categories.map(cat => cat.name || cat)];

  // Update filtered products when products or filters change
  useEffect(() => {
    if (!Array.isArray(products)) return;
    
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => {
        const productCategory = p.category_name || p.category?.name || p.category;
        return productCategory === selectedCategory;
      });
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
    }

    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, searchTerm, sortBy]);

  // Handle retry loading
  const handleRetry = () => {
    if (loadProducts) {
      loadProducts();
    }
  };

  return (
    <Container className="py-4">
      {/* Hero Section */}
      <Row className="mb-5">
        <Col>
          <div className="text-center bg-gradient-primary text-white rounded-4 p-5 mb-4">
            <h1 className="display-4 fw-bold mb-3">Welcome to E-Shop</h1>
            <p className="lead mb-4">Discover amazing products at unbeatable prices</p>
            <div className="d-flex justify-content-center">
              <div className="input-group" style={{ maxWidth: '400px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-lg"
                />
                <Button variant="light">
                  <Search size={20} />
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Display */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Error loading products:</strong> {error}
              </div>
              <Button variant="outline-danger" size="sm" onClick={handleRetry}>
                Retry
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        {/* Filters Sidebar */}
        <Col lg={3} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0 d-flex align-items-center">
                <Filter size={18} className="me-2" />
                Filters
              </h6>
            </Card.Header>
            <Card.Body>
              {/* Category Filter */}
              <div className="mb-4">
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-4">
                <Form.Label className="fw-semibold">Price Range (₹)</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </Col>
                </Row>
              </div>

              {/* Sort By */}
              <div>
                <Form.Label className="fw-semibold">Sort By</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </Form.Select>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Products</h2>
              <p className="text-muted mb-0">
                {loading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
              </p>
            </div>
            {loading && (
              <Spinner animation="border" variant="primary" />
            )}
          </div>

          {/* Loading State */}
          {loading && products.length === 0 && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="text-muted">Loading products...</p>
            </div>
          )}

          {/* No Products */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-5">
              <h4 className="text-muted mb-3">No products available</h4>
              <p className="text-muted">Check your backend connection or try again later.</p>
              <Button variant="primary" onClick={handleRetry}>
                Reload Products
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && filteredProducts.length > 0 && (
            <Row>
              {filteredProducts.map(product => (
                <Col key={product.id} sm={6} lg={4} xl={3} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}

          {/* No Filtered Results */}
          {!loading && filteredProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-5">
              <h4 className="text-muted mb-3">No products found</h4>
              <p className="text-muted">Try adjusting your filters or search term.</p>
              <Button variant="outline-primary" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange({ min: '', max: '' });
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPage;
