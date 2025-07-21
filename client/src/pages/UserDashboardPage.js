import React, { useState, useEffect } from 'react';
import api from '../api';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, ListGroup, Spinner } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboardPage = () => {
    const [myComplaints, setMyComplaints] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // States for the complaint form
    const [department, setDepartment] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        // CORRECT: Combined data fetching in a single useEffect
        const fetchData = async () => {
            try {
                const [complaintsRes, deptsRes] = await Promise.all([
                    api.get('/complaints/my-complaints'),
                    api.get('/departments')
                ]);

                setMyComplaints(complaintsRes.data);
                setDepartments(deptsRes.data);

                if (deptsRes.data.length > 0) {
                    setDepartment(deptsRes.data[0]._id);
                }
            } catch (err) {
                setError('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Empty array ensures this runs only once on mount

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                await api.delete(`/complaints/${id}`);
                setMyComplaints(prev => prev.filter(c => c._id !== id));
            } catch (err) {
                alert('Failed to delete the complaint.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!description.trim()) {
            setFormError('Description cannot be empty.');
            return;
        }
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('department', department);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            const { data: newComplaint } = await api.post('/complaints', formData);
            setMyComplaints(prev => [newComplaint, ...prev]);
            
            // CORRECT: Reset form fields to their initial state
            setDescription('');
            setImage(null);
            if (departments.length > 0) {
                setDepartment(departments[0]._id); // Reset to the first department ID
            }
            e.target.reset();
        } catch (err) {
            setFormError('Failed to submit complaint.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Data for Stats and Chart
    const pendingCount = myComplaints.filter(c => c.status === 'Pending').length;
    const closedCount = myComplaints.filter(c => c.status === 'Closed').length;

    const chartData = {
        labels: ['Pending', 'In Progress', 'Closed'],
        datasets: [{
            data: [pendingCount, myComplaints.length - pendingCount - closedCount, closedCount],
            backgroundColor: ['#ffc107', '#0dcaf0', '#198754'],
            borderColor: '#fff',
        }],
    };
    
    const getBadgeVariant = (status) => ({ 'Pending': 'warning', 'In Progress': 'info', 'Closed': 'success' }[status] || 'secondary');

    return (
        <Container fluid>
            <h2 className="mb-4">My Dashboard 👋</h2>
            <Row className="mb-4">
                <Col md={4}><Card bg="primary" text="white" className="shadow-sm"><Card.Body><Card.Title>{myComplaints.length}</Card.Title><Card.Text>Total Complaints</Card.Text></Card.Body></Card></Col>
                <Col md={4}><Card bg="warning" text="dark" className="shadow-sm"><Card.Body><Card.Title>{pendingCount}</Card.Title><Card.Text>Pending Issues</Card.Text></Card.Body></Card></Col>
                <Col md={4}><Card bg="success" text="white" className="shadow-sm"><Card.Body><Card.Title>{closedCount}</Card.Title><Card.Text>Resolved Issues</Card.Text></Card.Body></Card></Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Header as="h4">Submit a New Complaint</Card.Header>
                        <Card.Body>
                            {formError && <Alert variant="danger">{formError}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6} className="mb-3"><Form.Label>Department</Form.Label><Form.Select value={department} onChange={e => setDepartment(e.target.value)} disabled={departments.length === 0}>{departments.length > 0 ? departments.map(d => (<option key={d._id} value={d._id}>{d.name}</option>)) : <option>Loading...</option>}</Form.Select></Col>
                                    <Col md={6} className="mb-3"><Form.Label>Attach Image (Optional)</Form.Label><Form.Control type="file" onChange={handleImageChange} /></Col>
                                    <Col md={12}><Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} required /></Form.Group></Col>
                                </Row>
                                <Button className="mt-3" variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <><Spinner as="span" size="sm"/> Submitting...</> : 'Submit Complaint'}</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <Card className="shadow-sm">
                        <Card.Header as="h4">Complaint History</Card.Header>
                        <ListGroup variant="flush">
                            {loading ? <ListGroup.Item className="text-center"><Spinner/></ListGroup.Item> : myComplaints.length > 0 ? myComplaints.map(c => (
                                <ListGroup.Item key={c._id} className="p-3">
                                    <div className="d-flex justify-content-between">
                                        <div className="me-3">
                                            {/* CORRECT: Display department name from the object */}
                                            <div className="fw-bold">{c.department?.name || 'N/A'}</div>
                                            {c.description}
                                            {c.image && <div className="mt-2"><a href={`http://localhost:5000${c.image}`} target="_blank" rel="noopener noreferrer"><img src={`http://localhost:5000${c.image}`} alt="Attachment" style={{maxWidth:'100px', borderRadius:'5px'}}/></a></div>}
                                            
                                            {/* CORRECT: Activity log is now inside the main content div */}
                                            <div className="mt-3 ps-2 border-start border-2">
                                                {c.activityLog?.slice(0).reverse().map(log => (
                                                    <div key={log._id} className="small text-muted mb-1" style={{fontSize: '0.75rem'}}>
                                                        <i className="bi bi-clock-history me-1"></i>
                                                        <strong>{new Date(log.timestamp).toLocaleString()}:</strong> {log.action} by {log.user?.email || 'System'}.
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column align-items-end">
                                            <Badge bg={getBadgeVariant(c.status)} pill className="mb-2">{c.status}</Badge>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(c._id)}><i className="bi bi-trash"></i></Button>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            )) : <ListGroup.Item>No complaints submitted yet.</ListGroup.Item>}
                        </ListGroup>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="shadow-sm">
                        <Card.Header as="h4">Status Overview</Card.Header>
                        <Card.Body>{myComplaints.length > 0 ? <Doughnut data={chartData} options={{ maintainAspectRatio: true }}/> : <p className="text-center text-muted">No data to display.</p>}</Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserDashboardPage;