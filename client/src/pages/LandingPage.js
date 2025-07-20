import React from 'react';
import { Container, Row, Col, Button, Card, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // We will update this CSS file

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section text-white text-center">
        <div className="hero-overlay"></div>
        <Container className="hero-content">
          <h1 className="display-4 fw-bold">Effortless Complaint Management</h1>
          <p className="lead my-4">
            A seamless platform for students to voice their concerns and for administrators to resolve them promptly. Your voice, heard and acted upon.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button as={Link} to="/login" variant="primary" size="lg" className="px-4 me-sm-3">
              Login
            </Button>
            <Button as={Link} to="/register" variant="outline-light" size="lg" className="px-4">
              Sign Up
            </Button>
          </div>
        </Container>
      </header>

      {/* Features Section (Existing) */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Why Choose Us?</h2>
        <Row>
          <Col md={4} className="text-center mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="feature-icon bg-primary bg-gradient text-white rounded-3 mb-3">
                  <i className="bi bi-pencil-square"></i>
                </div>
                <Card.Title as="h3">Submit Easily</Card.Title>
                <Card.Text>
                  Lodge complaints through a simple and intuitive form from anywhere, anytime.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="text-center mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="feature-icon bg-primary bg-gradient text-white rounded-3 mb-3">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <Card.Title as="h3">Track Status</Card.Title>
                <Card.Text>
                  Keep track of your submitted complaints and see their status updates in real-time.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="text-center mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="feature-icon bg-primary bg-gradient text-white rounded-3 mb-3">
                  <i className="bi bi-check2-circle"></i>
                </div>
                <Card.Title as="h3">Swift Resolution</Card.Title>
                <Card.Text>
                  Admins can view, manage, and resolve issues efficiently, ensuring timely action.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Testimonials Section (New) */}
      <section className="testimonials-section bg-light py-5">
          <Container>
              <h2 className="text-center mb-5">What Our Users Say</h2>
              <Row>
                  <Col md={4} className='mb-4'>
                      <Card className='h-100 text-center'>
                          <Card.Body>
                              <img src="https://i.pravatar.cc/100?img=1" alt="User 1" className="testimonial-avatar rounded-circle mb-3" />
                              <blockquote className="blockquote mb-0">
                                  <p>"This system made it so easy to report the Wi-Fi issue in my dorm. It was fixed the next day!"</p>
                                  <footer className="blockquote-footer mt-2">Priya Sharma, <cite title="Role">Engineering Student</cite></footer>
                              </blockquote>
                          </Card.Body>
                      </Card>
                  </Col>
                  <Col md={4} className='mb-4'>
                      <Card className='h-100 text-center'>
                          <Card.Body>
                              <img src="https://i.pravatar.cc/100?img=3" alt="User 2" className="testimonial-avatar rounded-circle mb-3" />
                              <blockquote className="blockquote mb-0">
                                  <p>"As an admin, this dashboard is a lifesaver. I can see everything in one place and prioritize effectively."</p>
                                  <footer className="blockquote-footer mt-2">Rajesh Kumar, <cite title="Role">Hostel Warden</cite></footer>
                              </blockquote>
                          </Card.Body>
                      </Card>
                  </Col>
                  <Col md={4} className='mb-4'>
                      <Card className='h-100 text-center'>
                          <Card.Body>
                              <img src="https://i.pravatar.cc/100?img=5" alt="User 3" className="testimonial-avatar rounded-circle mb-3" />
                              <blockquote className="blockquote mb-0">
                                  <p>"The email notifications are fantastic. I always knew exactly what was happening with my request."</p>
                                  <footer className="blockquote-footer mt-2">Anjali Mehta, <cite title="Role">Arts Undergraduate</cite></footer>
                              </blockquote>
                          </Card.Body>
                      </Card>
                  </Col>
              </Row>
          </Container>
      </section>

      {/* FAQ Section (New) */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Frequently Asked Questions</h2>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Who can use this system?</Accordion.Header>
            <Accordion.Body>
              This system is designed for students and staff of the institution. Any registered user can submit a complaint regarding campus facilities and services.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>How long does a resolution typically take?</Accordion.Header>
            <Accordion.Body>
              Resolution times vary depending on the nature and complexity of the complaint. However, our administration aims to acknowledge every complaint within 24 hours and provide an estimated resolution timeline.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Is my complaint submission anonymous?</Accordion.Header>
            <Accordion.Body>
              No, complaints are not anonymous. You must be logged in to submit a complaint, and your identity is linked to the submission. This ensures accountability and allows our administrative team to contact you for follow-up questions if necessary.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
      
      {/* Final CTA Section (New) */}
      <section className="cta-section text-center py-5 bg-primary text-white">
         
              <h2 className="display-6 fw-bold">Ready to Get Started?</h2>
              <p className="lead">Join now and make your voice heard. Let's build a better campus experience together.</p>
              <Button as={Link} to="/register" variant="outline-light" size="lg" className="mt-3">
                  Create Your Account
              </Button>
          
      </section>

      {/* Footer (Existing) */}
      <footer className="py-4 bg-dark text-white text-center">
        <Container>
          <p className="mb-0">Copyright &copy; Complaint Management System {new Date().getFullYear()}</p>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;