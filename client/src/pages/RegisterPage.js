import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import '../App.css';
const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    try {
      await api.post('/auth/register', { email, password });
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Container className="auth-container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-lg border-0 auth-card">
        <Row className="g-0">
          {/* Image Section */}
          <Col md={6} className="auth-image-section d-none d-md-flex">
            <h2 className="fw-bold">Make Your Voice Heard</h2>
            <p style={{ marginTop: '16px', marginLeft: '16px' }}>Join a community dedicated to improving campus life, one complaint at a time.</p>
          </Col>

          {/* Form Section */}
          <Col md={6}>
            <Card.Body className="p-4 p-sm-5">
              <h3 className="text-center mb-4">Create Your Account</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </Form.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit">Register</Button>
                </div>
              </Form>
              <div className="text-center mt-3">
                <small>Already have an account? <Link to="/login">Log In</Link></small>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default RegisterPage;