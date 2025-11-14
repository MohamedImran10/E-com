import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://e-com-mw57.onrender.com/api/orders/${orderId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load order');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, navigate]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }

    // Limit CVV to 3 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardDetails({
      ...cardDetails,
      [name]: formattedValue
    });
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardDetails.cardName) {
      setError('Please enter the cardholder name');
      return false;
    }
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateCardDetails()) {
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `https://e-com-mw57.onrender.com/api/orders/${orderId}/payment/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_method: 'card',
            card_last_four: cardDetails.cardNumber.slice(-4)
          })
        }
      );

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      setSuccess(true);
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
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
        <Alert variant="info">Please log in to complete payment</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading order details...</p>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Order not found</Alert>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="py-5">
        <Row>
          <Col md={6} className="mx-auto">
            <Card className="text-center py-5 border-success">
              <Card.Body>
                <CheckCircle size={80} className="text-success mb-3 mx-auto d-block" />
                <h3 className="mb-3">Payment Successful!</h3>
                <p className="text-muted mb-4">
                  Your payment has been processed successfully.
                </p>
                <p className="mb-4">
                  <strong>Order Number:</strong> {order.order_number}
                </p>
                <p className="text-muted">
                  Redirecting to orders page...
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={8} className="mx-auto">
          <h1 className="text-gradient mb-4">Payment</h1>

          {error && (
            <Alert variant="danger" className="mb-4 d-flex align-items-center">
              <AlertCircle size={20} className="me-2" />
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">Order Summary</h6>
                </Card.Header>
                <Card.Body>
                  <p className="mb-3">
                    <strong>Order Number:</strong> {order.order_number}
                  </p>
                  <p className="mb-3">
                    <strong>Status:</strong>{' '}
                    <span className="badge bg-info">{order.order_status_display}</span>
                  </p>
                  <p className="mb-0">
                    <strong>Items:</strong> {order.items.length}
                  </p>
                </Card.Body>
              </Card>

              <Card className="border-primary">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0">Amount to Pay</h6>
                </Card.Header>
                <Card.Body>
                  <h3 className="text-primary mb-0">
                    {formatPrice(order.total_amount)}
                  </h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header className="bg-light">
                  <div className="d-flex align-items-center">
                    <CreditCard size={20} className="me-2" />
                    <h6 className="mb-0">Card Details</h6>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handlePayment}>
                    <Form.Group className="mb-3">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        maxLength="19"
                        disabled={processing}
                        required
                      />
                      <small className="text-muted">16 digits required</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Cardholder Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardName"
                        placeholder="John Doe"
                        value={cardDetails.cardName}
                        onChange={handleCardChange}
                        disabled={processing}
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={handleCardChange}
                            maxLength="5"
                            disabled={processing}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV</Form.Label>
                          <Form.Control
                            type="password"
                            name="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            maxLength="3"
                            disabled={processing}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Alert variant="info" className="d-flex align-items-center mb-3">
                      <Lock size={16} className="me-2" />
                      <small>This is a demo payment page. Your card details are not stored.</small>
                    </Alert>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock size={16} className="me-2" />
                          Pay {formatPrice(order.total_amount)}
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
