import React, { useState, useEffect } from 'react';
import api from '../api';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, ListGroup, Spinner } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboardPage = () => {
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for the complaint form
  const [department, setDepartment] = useState('Hostel');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // State for the image file
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/complaints/my-complaints');
        setMyComplaints(data);
      } catch (err) {
        setError('Failed to fetch your complaints.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyComplaints();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!description.trim()) {
      setFormError('Description cannot be empty.');
      return;
    }

    setIsSubmitting(true); // Disable button

    // FormData is required for file uploads
    const formData = new FormData();
    formData.append('department', department);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const { data: newComplaint } = await api.post('/complaints', formData);
      setMyComplaints(prev => [newComplaint, ...prev]);
      // Reset form fields
      setDescription('');
      setDepartment('Hostel');
      setImage(null);
      e.target.reset(); // This clears the file input
    } catch (err) {
      setFormError('Failed to submit complaint.');
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  // Data for Stats and Chart
  const pendingCount = myComplaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = myComplaints.filter(c => c.status === 'In Progress').length;
  const closedCount = myComplaints.filter(c => c.status === 'Closed').length;

  const chartData = {
    labels: ['Pending', 'In Progress', 'Closed'],
    datasets: [{
      label: 'Complaint Statuses',
      data: [pendingCount, inProgressCount, closedCount],
      backgroundColor: ['#ffc107', '#0dcaf0', '#198754'],
      borderColor: ['#fff'],
      borderWidth: 2,
    }],
  };
  
  const getBadgeVariant = (status) => ({
      'Pending': 'warning',
      'In Progress': 'info',
      'Closed': 'success'
  }[status] || 'secondary');

  return (
    <Container fluid>
      <h2 className="mb-4">My Dashboard 👋</h2>
      
      {/* Stat Cards */}
      <Row className="mb-4">
        <Col md={4}><Card bg="primary" text="white" className="shadow-sm"><Card.Body><Card.Title>{myComplaints.length}</Card.Title><Card.Text>Total Complaints</Card.Text></Card.Body></Card></Col>
        <Col md={4}><Card bg="warning" text="dark" className="shadow-sm"><Card.Body><Card.Title>{pendingCount}</Card.Title><Card.Text>Pending Issues</Card.Text></Card.Body></Card></Col>
        <Col md={4}><Card bg="success" text="white" className="shadow-sm"><Card.Body><Card.Title>{closedCount}</Card.Title><Card.Text>Resolved Issues</Card.Text></Card.Body></Card></Col>
      </Row>

      <Row>
        {/* Left Column: Form & Recent Complaints */}
        <Col lg={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h4">Submit a New Complaint</Card.Header>
            <Card.Body>
              {formError && <Alert variant="danger">{formError}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3"><Form.Label>Department</Form.Label><Form.Select value={department} onChange={e => setDepartment(e.target.value)}><option>Hostel</option><option>Internet</option><option>Classroom</option><option>Faculty</option><option>Other</option></Form.Select></Col>
                  <Col md={6} className="mb-3"><Form.Label>Attach an Image (Optional)</Form.Label><Form.Control type="file" onChange={handleImageChange} /></Col>
                  <Col md={12}><Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} required /></Form.Group></Col>
                </Row>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Submitting...</> : 'Submit Complaint'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header as="h4">Complaint History</Card.Header>
            <ListGroup variant="flush">
              {loading ? <ListGroup.Item className="text-center"><Spinner animation="border" /></ListGroup.Item> : myComplaints.length > 0 ? myComplaints.map(c => (
                <ListGroup.Item key={c._id} className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{c.department}</div>
                    {c.description}
                    {/* Display image if it exists */}
                    {c.image && (
                        <div className="mt-2">
                            <a href={`http://localhost:5000${c.image}`} target="_blank" rel="noopener noreferrer">
                                <img src={`http://localhost:5000${c.image}`} alt="Complaint attachment" style={{ maxWidth: '100px', borderRadius: '5px' }} />
                            </a>
                        </div>
                    )}
                    <div className="text-muted small mt-1">{new Date(c.submittedAt).toLocaleString()}</div>
                  </div>
                  <Badge bg={getBadgeVariant(c.status)} pill>{c.status}</Badge>
                </ListGroup.Item>
              )) : <ListGroup.Item>No complaints submitted yet.</ListGroup.Item>}
            </ListGroup>
          </Card>
        </Col>

        {/* Right Column: Chart */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header as="h4">Status Overview</Card.Header>
            <Card.Body>
              {myComplaints.length > 0 ? <Doughnut data={chartData} options={{ maintainAspectRatio: true }}/> : <p className="text-center text-muted">No data to display.</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboardPage;