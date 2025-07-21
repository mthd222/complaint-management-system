import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Card, Alert, Container, Row, Col, InputGroup } from 'react-bootstrap';
import '../App.css';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for a success message from the registration page
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      // New Redirect Logic
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'staff') {
        navigate('/staff-dashboard');
      } else {
        navigate('/dashboard');
      }
    }catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Container className="auth-container">
      <Card className="shadow-lg border-0 auth-card">
        <Row className="g-0">
          {/* Image Section */}
          <Col md={6} className="auth-image-section d-none d-md-flex">
            <h2 className="fw-bold">Welcome Back!</h2>
            <p style={{ marginTop: '16px', marginLeft: '16px' }}>Log in to manage your complaints and see the progress we're making together.</p>
          </Col>

          {/* Form Section */}
          <Col md={6}>
            <Card.Body className="p-4 p-sm-5">
              <h3 className="text-center mb-4">Log In to Your Account</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control 
                      type={showPassword ? 'text' : 'password'}
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                    {/* <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </Button> */}
                  </InputGroup>
                </Form.Group>
                
                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Log In
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                <small>Don't have an account? <Link to="/register">Sign Up</Link></small>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default LoginPage;