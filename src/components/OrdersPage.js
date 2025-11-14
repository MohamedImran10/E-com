import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { ArrowRight, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    loadOrders();
  }, [user, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://e-com-mw57.onrender.com/api/orders/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock size={20} className="text-warning" />;
      case 'processing':
        return <Package size={20} className="text-info" />;
      case 'shipped':
        return <Truck size={20} className="text-primary" />;
      case 'delivered':
        return <CheckCircle size={20} className="text-success" />;
      default:
        return <Clock size={20} className="text-muted" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">Please log in to view your orders</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-gradient mb-3">My Orders</h1>
          <p className="text-muted">Track and manage your orders</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
          <Button variant="outline-danger" size="sm" className="ms-3" onClick={loadOrders}>
            Retry
          </Button>
        </Alert>
      )}

      {orders.length === 0 ? (
        <Row>
          <Col md={8} className="mx-auto">
            <Card className="text-center py-5">
              <Card.Body>
                <Package size={60} className="text-muted mb-3 mx-auto d-block" />
                <h5>No Orders Yet</h5>
                <p className="text-muted">Start shopping to place your first order</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/')}
                  className="d-flex align-items-center mx-auto"
                >
                  Continue Shopping <ArrowRight size={16} className="ms-2" />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={8} className="mx-auto">
            {orders.map((order) => (
              <Card key={order.id} className="mb-4 shadow-sm hover-card">
                <Card.Body>
                  <Row className="align-items-center mb-3">
                    <Col md={8}>
                      <div className="d-flex align-items-center mb-2">
                        {getStatusIcon(order.order_status)}
                        <span className="ms-3">
                          <strong>Order #{order.order_number}</strong>
                        </span>
                      </div>
                      <small className="text-muted">
                        Placed on {formatDate(order.created_at)}
                      </small>
                    </Col>
                    <Col md={4} className="text-end">
                      <Badge bg={getStatusBadge(order.order_status)} className="me-2">
                        {order.order_status_display}
                      </Badge>
                      <Badge bg={order.payment_status === 'completed' ? 'success' : 'warning'}>
                        {order.payment_status_display}
                      </Badge>
                    </Col>
                  </Row>

                  <hr />

                  <div className="mb-3">
                    <h6>Items</h6>
                    {order.items.map((item) => (
                      <Row key={item.id} className="mb-2">
                        <Col md={2}>
                          <img 
                            src={item.item_image} 
                            alt={item.item_name}
                            style={{ width: '100%', maxWidth: '80px', borderRadius: '8px' }}
                          />
                        </Col>
                        <Col md={7}>
                          <p className="mb-0 fw-bold">{item.item_name}</p>
                          <small className="text-muted">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </small>
                        </Col>
                        <Col md={3} className="text-end">
                          <strong>{formatPrice(item.total_price)}</strong>
                        </Col>
                      </Row>
                    ))}
                  </div>

                  <hr />

                  <Row className="mb-3">
                    <Col md={8}>
                      <small className="text-muted">Shipping Address:</small>
                      <p className="mb-0 small">{order.shipping_address}</p>
                    </Col>
                    <Col md={4} className="text-end">
                      <h5 className="text-primary mb-0">
                        Total: {formatPrice(order.total_amount)}
                      </h5>
                    </Col>
                  </Row>

                  {order.payment_status !== 'completed' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate(`/payment/${order.id}`)}
                    >
                      Complete Payment
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OrdersPage;
