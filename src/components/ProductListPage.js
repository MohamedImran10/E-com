import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Filter, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ProductCard from './ProductCard';

const ProductListPage = () => {
  const { products } = useApp();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
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
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, searchTerm, sortBy]);

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
                  {categories.map(category => (
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
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                </Form.Select>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Products</h2>
            <p className="text-muted mb-0">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <Row>
              {filteredProducts.map(product => (
                <Col key={product.id} sm={6} lg={4} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <Search size={64} className="text-muted" />
              </div>
              <h4 className="text-muted">No products found</h4>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPage;
