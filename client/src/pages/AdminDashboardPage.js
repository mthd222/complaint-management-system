import React, { useState, useEffect } from 'react';
import api from '../api';
import { Table, Form, Alert, Badge, Spinner } from 'react-bootstrap';
const AdminDashboardPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError('');
        // This endpoint is protected and only accessible by admins
        const { data } = await api.get('/complaints');
        setComplaints(data);
      } catch (err) {
        setError('Failed to fetch complaints. You may not have admin privileges.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []); // The empty array ensures this runs only once on mount

  const handleStatusChange = async (id, status) => {
    try {
      // Send the update request to the backend
      const { data: updatedComplaint } = await api.put(`/complaints/${id}`, { status });
      
      // Update the state locally for an immediate UI change
      setComplaints(prevComplaints =>
        prevComplaints.map(c => (c._id === id ? updatedComplaint : c))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };
const getBadgeVariant = (status) => {
      switch (status) {
          case 'Pending': return 'warning';
          case 'In Progress': return 'info';
          case 'Closed': return 'success';
          default: return 'secondary';
      }
  };
  // Filter complaints based on the selected status
  const filteredComplaints = complaints.filter(c => 
    filter === 'All' || c.status === filter
  );

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard 👑</h2>
      
      {/* Display Loading or Error Alerts */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading Complaints...</p>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Render the rest of the component only when not loading */}
      {!loading && !error && (
        <>
          <Form.Group className="mb-3" style={{ maxWidth: '250px' }}>
            <Form.Label>Filter by status</Form.Label>
            <Form.Select onChange={(e) => setFilter(e.target.value)} value={filter}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </Form.Select>
          </Form.Group>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User Email</th>
                <th>Department</th>
                <th>Description</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map(c => (
                  <tr key={c._id}>
                    <td>{c.user?.email || 'N/A'}</td>
                    <td>{c.department}</td>
                    <td>{c.description}</td>
                    <td>{new Date(c.submittedAt).toLocaleString()}</td>
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
                <tr>
                  <td colSpan="6" className="text-center">No complaints to display for this filter.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};


export default AdminDashboardPage;