import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Table, Form, Alert, Badge, Spinner, Row, Col, Card, Button, Modal, Container, ListGroup } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboardPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [showLogModal, setShowLogModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const { data } = await api.get(`/complaints?search=${searchTerm}`);
                setComplaints(data);
            } catch (err) {
                setError('Failed to fetch complaints.');
            } finally {
                if (loading) setLoading(false);
            }
        };
        const delayDebounceFn = setTimeout(() => { fetchComplaints(); }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const { data } = await api.get('/departments/staff');
                setStaffMembers(data);
            } catch (err) {
                console.error("Could not fetch staff members");
            }
        };
        fetchStaff();
    }, []);

    const handleShowLog = (complaint) => {
        setSelectedComplaint(complaint);
        setShowLogModal(true);
    };
    const handleCloseLog = () => setShowLogModal(false);

    const handleStatusChange = async (id, status) => {
        try {
            const { data: updatedComplaint } = await api.put(`/complaints/${id}`, { status });
            setComplaints(prev => prev.map(c => (c._id === id ? updatedComplaint : c)));
        } catch (err) { alert('Failed to update status.'); }
    };

    const handleAssign = async (complaintId, staffUserId) => {
        if (!staffUserId) return;
        try {
            const { data: updatedComplaint } = await api.put(`/complaints/${complaintId}/assign`, { assignedTo: staffUserId });
            setComplaints(prev => prev.map(c => (c._id === complaintId ? updatedComplaint : c)));
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            alert(`Failed to assign complaint: ${errorMessage}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this complaint permanently?')) {
            try {
                await api.delete(`/complaints/${id}`);
                setComplaints(prev => prev.filter(c => c._id !== id));
            } catch (err) { alert('Failed to delete the complaint.'); }
        }
    };

    const chartData = useMemo(() => {
        const deptCounts = complaints.reduce((acc, complaint) => {
            const deptName = complaint.department?.name || 'Uncategorized';
            acc[deptName] = (acc[deptName] || 0) + 1;
            return acc;
        }, {});
        return {
            labels: Object.keys(deptCounts),
            datasets: [{ label: 'Complaints per Department', data: Object.values(deptCounts), backgroundColor: 'rgba(54, 162, 235, 0.6)' }],
        };
    }, [complaints]);

    const filteredComplaints = useMemo(() => {
        return statusFilter === 'All' ? complaints : complaints.filter(c => c.status === statusFilter);
    }, [complaints, statusFilter]);
    
    const getBadgeVariant = (status) => ({ 
    'Pending': 'warning', 
    'In Progress': 'info', 
    'Resolved': 'primary', // <-- Add 'Resolved' status
    'Closed': 'success' 
}[status] || 'secondary');

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard 👑</h2>
                <Button as={Link} to="/admin/departments" variant="info">Manage Departments</Button>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="mb-4 shadow-sm"><Card.Body>{loading ? <div className="text-center p-5"><Spinner animation="border" /></div> : <Bar options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Complaint Distribution by Department' }}}} data={chartData} />}</Card.Body></Card>

            <Card className="mb-4 shadow-sm"><Card.Body><Row>
                <Col md={8}><Form.Group><Form.Label>Search Complaints</Form.Label><Form.Control type="text" placeholder="Search by keyword..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>Filter by Status</Form.Label>
               <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
    <option value="All">All</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option> {/* <-- Add 'Resolved' status */}
    <option value="Closed">Closed</option>
</Form.Select>
</Form.Group></Col>
            </Row></Card.Body></Card>
            
            <Table striped bordered hover responsive>
                <thead><tr><th>User</th><th>Department</th><th>Description</th><th>Image</th><th>Status</th><th>Assigned To</th><th>Assign</th><th>History</th><th>Delete</th></tr></thead>
                <tbody>
                    {loading ? ( <tr><td colSpan="9" className="text-center"><Spinner animation="border" /></td></tr> ) : 
                    filteredComplaints.length > 0 ? (
                        filteredComplaints.map(c => (
                            <tr key={c._id}>
                                <td>{c.user?.email}</td>
                                <td>{c.department?.name}</td>
                                <td style={{ minWidth: '200px' }}>{c.description}</td>
                                <td>{c.image && <a href={`http://localhost:5000${c.image}`} target="_blank" rel="noopener noreferrer">View</a>}</td>
                                <td>
                                    <Form.Select size="sm" value={c.status} onChange={(e) => handleStatusChange(c._id, e.target.value)}>
    <option>Pending</option>
    <option>In Progress</option>
    <option>Resolved</option> {/* <-- Add 'Resolved' status */}
    <option>Closed</option>
</Form.Select>
                                    <Badge bg={getBadgeVariant(c.status)} className="mt-1 w-100">{c.status}</Badge>
                                </td>
                                <td>{c.assignedTo?.email || 'Unassigned'}</td>
                                <td>
                                    <Form.Select size="sm" value={c.assignedTo?._id || ''} onChange={(e) => handleAssign(c._id, e.target.value)}>
                                        <option value="">Assign...</option>
                                        {staffMembers.map(staff => ( <option key={staff._id} value={staff._id}>{staff.email}</option> ))}
                                    </Form.Select>
                                </td>
                                <td><Button variant="outline-secondary" size="sm" onClick={() => handleShowLog(c)}><i className="bi bi-clock-history"></i></Button></td>
                                <td><Button variant="outline-danger" size="sm" onClick={() => handleDelete(c._id)}><i className="bi bi-trash"></i></Button></td>
                            </tr>
                        ))
                    ) : ( <tr><td colSpan="9" className="text-center">No complaints found.</td></tr> )}
                </tbody>
            </Table>

            <Modal show={showLogModal} onHide={handleCloseLog} centered>
                <Modal.Header closeButton><Modal.Title>Activity Log</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedComplaint?.activityLog?.length > 0 ? (
                        <ListGroup variant="flush">
                            {selectedComplaint.activityLog.slice(0).reverse().map(log => (
                                <ListGroup.Item key={log._id} className="px-0">
                                    <div className="fw-bold">{log.action}</div>
                                    <div className="text-muted small">by {log.user?.email || 'System'} on {new Date(log.timestamp).toLocaleString()}</div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : ( <p>No activity has been logged for this complaint.</p> )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDashboardPage;