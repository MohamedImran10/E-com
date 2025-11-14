import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Nav, Tab } from 'react-bootstrap';
import { User, MapPin, Mail, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    date_of_birth: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://e-com-mw57.onrender.com/api/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setFormData({
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        date_of_birth: data.date_of_birth || '',
      });
    } catch (err) {
      setError(err.message);
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('authToken');
      const response = await fetch('https://e-com-mw57.onrender.com/api/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      setSuccess('Profile updated successfully!');
      await loadProfile();
    } catch (err) {
      setError(err.message);
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">Please log in to view your profile</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div 
                className="bg-gradient-primary rounded-circle p-4 me-3"
                style={{ width: '80px', height: '80px' }}
              >
                <User size={40} className="text-white" />
              </div>
              <div>
                <h2 className="mb-0">{user.username}</h2>
                <p className="text-muted mb-0">{user.email}</p>
              </div>
            </div>
            <Button 
              variant="outline-danger"
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <LogOut size={18} className="me-2" />
              Logout
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      <Tab.Container defaultActiveKey="profile">
        <Row className="mb-3">
          <Col md={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="profile" className="d-flex align-items-center">
                  <User size={18} className="me-2" />
                  Profile Info
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="account" className="d-flex align-items-center">
                  <Mail size={18} className="me-2" />
                  Account
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <Card>
                  <Card.Header className="bg-light">
                    <h6 className="mb-0 d-flex align-items-center">
                      <MapPin size={18} className="me-2" />
                      Delivery Address
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSaveProfile}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="address"
                          placeholder="Enter your full address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              placeholder="City"
                              value={formData.city}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              name="state"
                              placeholder="State"
                              value={formData.state}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          placeholder="6-digit Pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          maxLength="6"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <Button 
                        variant="primary" 
                        type="submit"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="account">
                <Card>
                  <Card.Header className="bg-light">
                    <h6 className="mb-0 d-flex align-items-center">
                      <Mail size={18} className="me-2" />
                      Account Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={6}>
                        <p className="text-muted mb-1">Username</p>
                        <p className="fw-bold">{user.username}</p>
                      </Col>
                      <Col md={6}>
                        <p className="text-muted mb-1">Email</p>
                        <p className="fw-bold">{user.email}</p>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <p className="text-muted mb-1">First Name</p>
                        <p className="fw-bold">{user.first_name || 'Not provided'}</p>
                      </Col>
                      <Col md={6}>
                        <p className="text-muted mb-1">Last Name</p>
                        <p className="fw-bold">{user.last_name || 'Not provided'}</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <p className="text-muted mb-1">Member Since</p>
                        <p className="fw-bold">
                          {new Date(user.date_joined).toLocaleDateString('en-IN')}
                        </p>
                      </Col>
                    </Row>

                    <hr />

                    <Alert variant="warning" className="mt-4">
                      <strong>Note:</strong> To change your email or password, please use the account settings in your profile or contact support.
                    </Alert>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default ProfilePage;
