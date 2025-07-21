import React, { useState, useEffect } from 'react';
import api from '../api';
import { Container, Card, ListGroup, Spinner, Badge, Alert,Button, Modal, Form } from 'react-bootstrap';

const StaffDashboardPage = () => {
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

const [showModal, setShowModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [resolutionNotes, setResolutionNotes] = useState('');


    useEffect(() => {
        const fetchAssignedComplaints = async () => {
            try {
                const { data } = await api.get('/complaints/assigned');
                setAssignedComplaints(data);
            } catch (err) {
                setError('Could not fetch assigned complaints.');
            } finally {
                setLoading(false);
            }
        };
        fetchAssignedComplaints();
    }, []);
    
const handleOpenModal = (complaint) => {
        setSelectedComplaint(complaint);
        setResolutionNotes(complaint.resolutionNotes || '');
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

const handleResolveSubmit = async (e) => {
        e.preventDefault();
        if (!selectedComplaint) return;

        try {
            const { data: updatedComplaint } = await api.put(`/complaints/${selectedComplaint._id}/resolve`, { resolutionNotes });
            setAssignedComplaints(prev => prev.map(c => c._id === updatedComplaint._id ? updatedComplaint : c));
            handleCloseModal();
        } catch (err) {
            alert('Failed to submit resolution.');
        }
    };

    const getBadgeVariant = (status) => ({ 'Pending': 'warning', 'In Progress': 'info', 'Resolved': 'primary', 'Closed': 'success' }[status] || 'secondary');

    if (loading) {
        return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }

    return (
        <Container fluid>
            <h2 className="mb-4">My Assigned Complaints</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Card className="shadow-sm">
                <Card.Header as="h4">Tasks ({assignedComplaints.length})</Card.Header>
                <ListGroup variant="flush">
                   {loading ? <ListGroup.Item className="text-center"><Spinner/></ListGroup.Item> : 
                    assignedComplaints.map(c => (
                        <ListGroup.Item key={c._id} className="p-3">
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{c.department.name} </div>
                                    {c.description}
                                    <div className="text-muted small mt-1">{new Date(c.submittedAt).toLocaleString()}</div>
                                </div>
                                 <Button variant="success" size="sm" onClick={() => handleOpenModal(c)} disabled={c.status === 'Resolved'}>
                                    {c.status === 'Resolved' ? 'Resolved' : 'Update / Resolve'}
                                </Button>
                                <Badge bg={getBadgeVariant(c.status)} pill>{c.status}</Badge>
                            </div>
                            {/* A staff member can't re-assign, but can update status - you can add that functionality here */}
                        </ListGroup.Item>
                    )) }
                </ListGroup>
            </Card>

             <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton><Modal.Title>Resolve Complaint</Modal.Title></Modal.Header>
                <Form onSubmit={handleResolveSubmit}>
                    <Modal.Body>
                        <p><strong>Complaint:</strong> {selectedComplaint?.description}</p>
                        <Form.Group>
                            <Form.Label>Resolution Notes</Form.Label>
                            <Form.Control as="textarea" rows={4} value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button variant="primary" type="submit">Mark as Resolved</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default StaffDashboardPage;