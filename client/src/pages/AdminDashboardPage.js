import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { Table, Form, Alert, Badge, Spinner, Row, Col, Card } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboardPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // State for the status filter

  // Fetch data with debounced search
  useEffect(() => {
    const fetchComplaints = async () => {
      // Don't set loading to true on every keystroke, only for the initial load.
      // This provides a smoother search experience.
      try {
        const { data } = await api.get(`/complaints?search=${searchTerm}`);
        setComplaints(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch complaints.');
      } finally {
        // Ensure loading is false after the first fetch
        if (loading) setLoading(false);
      }
    };
    
    // Debounce: wait 500ms after user stops typing to make API call
    const delayDebounceFn = setTimeout(() => {
      fetchComplaints();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Re-run effect when searchTerm changes

  // Memoize chart data to prevent recalculation on every render
  const chartData = useMemo(() => {
    const deptCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.department] = (acc[complaint.department] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(deptCounts),
      datasets: [{
        label: 'Complaints per Department',
        data: Object.values(deptCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };
  }, [complaints]);

  const handleStatusChange = async (id, status) => {
    try {
      const { data: updatedComplaint } = await api.put(`/complaints/${id}`, { status });
      setComplaints(prev => prev.map(c => (c._id === id ? updatedComplaint : c)));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const getBadgeVariant = (status) => ({
    'Pending': 'warning',
    'In Progress': 'info',
    'Closed': 'success'
  }[status] || 'secondary');

  // Apply the status filter to the complaints fetched from the API
  const filteredComplaints = useMemo(() => {
    if (statusFilter === 'All') {
      return complaints;
    }
    return complaints.filter(c => c.status === statusFilter);
  }, [complaints, statusFilter]);

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard 👑</h2>
      
      {/* Chart Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          {loading ? (
             <div className="text-center p-5"><Spinner animation="border" /></div>
          ) : (
            <Bar options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Complaint Distribution by Department' }}}} data={chartData} />
          )}
        </Card.Body>
      </Card>

      {/* Search and Filter Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Search Complaints</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by keyword in description or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Table Section */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User</th>
            <th>Department</th>
            <th>Description</th>
            <th>Image</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6" className="text-center"><Spinner animation="border" /></td></tr>
          ) : filteredComplaints.length > 0 ? (
            filteredComplaints.map(c => (
              <tr key={c._id}>
                <td>{c.user?.email}</td>
                <td>{c.department}</td>
                <td>{c.description}</td>
                <td>
                  {c.image && <a href={`http://localhost:5000${c.image}`} target="_blank" rel="noopener noreferrer">View Image</a>}
                </td>
                <td>
                  <Badge bg={getBadgeVariant(c.status)}>{c.status}</Badge>
                </td>
                <td>
                  <Form.Select size="sm" value={c.status} onChange={(e) => handleStatusChange(c._id, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </Form.Select>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="text-center">No complaints found.</td></tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboardPage;