import React, { useState, useEffect } from 'react';
import api from '../api';
import { Form, Button, Table, Card, Alert, Badge } from 'react-bootstrap';

// --- Complaint Form Component (Bootstrap Version) ---
const ComplaintForm = ({ onNewComplaint }) => {
  const [department, setDepartment] = useState('Hostel');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!description.trim()) {
      setError('Please provide a description for your complaint.');
      return;
    }
    try {
      const { data: newComplaint } = await api.post('/complaints', {
        department,
        description,
      });
      // Pass the new complaint up to the parent to update the list
      onNewComplaint(newComplaint);
      alert('Complaint submitted successfully!');
      // Reset form fields
      setDescription('');
      setDepartment('Hostel');
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
      console.error('Error submitting complaint:', err);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h3">Submit a New Complaint</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="department">
            <Form.Label>Department</Form.Label>
            <Form.Select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="Hostel">Hostel</option>
              <option value="Internet">Internet</option>
              <option value="Classroom">Classroom</option>
              <option value="Faculty">Faculty</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit Complaint
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};


// --- User Dashboard Page ---
const UserDashboardPage = () => {
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleNewComplaint = (newComplaint) => {
    setMyComplaints(prev => [newComplaint, ...prev]);
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Progress': return 'info';
      case 'Closed': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <h2 className="mb-3">My Dashboard 🙋‍♂️</h2>
      <ComplaintForm onNewComplaint={handleNewComplaint} />
      
      <h3>My Submitted Complaints</h3>
      {loading && <Alert variant="info">Loading your complaints...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Department</th>
              <th>Description</th>
              <th>Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myComplaints.length > 0 ? (
              myComplaints.map((c, index) => (
                <tr key={c._id}>
                  <td>{index + 1}</td>
                  <td>{c.department}</td>
                  <td>{c.description}</td>
                  <td>{new Date(c.submittedAt).toLocaleString()}</td>
                  <td>
                    <Badge bg={getBadgeVariant(c.status)}>{c.status}</Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  You haven't submitted any complaints yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserDashboardPage;