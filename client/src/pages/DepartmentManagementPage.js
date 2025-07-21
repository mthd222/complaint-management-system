import React, { useState, useEffect } from 'react';
import api from '../api';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Spinner } from 'react-bootstrap';

const DepartmentManagementPage = () => {
    const [departments, setDepartments] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const { data } = await api.get('/departments');
                setDepartments(data);
            } catch (err) {
                setError('Failed to fetch departments.');
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!newName.trim()) {
            setFormError('Department name cannot be empty.');
            return;
        }
        try {
            const { data: newDepartment } = await api.post('/departments', { name: newName });
            setDepartments([...departments, newDepartment]);
            setNewName(''); // Reset form
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create department.');
        }
    };

    return (
        <Container fluid>
            <h2 className="mb-4">Department Management</h2>
            <Row>
                <Col md={5}>
                    <Card className="shadow-sm">
                        <Card.Header as="h4">Create New Department</Card.Header>
                        <Card.Body>
                            {formError && <Alert variant="danger">{formError}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Department Name</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g., IT Support, Hostel Maintenance"
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary">Create Department</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={7}>
                    <Card className="shadow-sm">
                        <Card.Header as="h4">Existing Departments</Card.Header>
                        <ListGroup variant="flush">
                            {loading ? <div className="text-center p-3"><Spinner animation="border" /></div> :
                                departments.map(dept => (
                                    <ListGroup.Item key={dept._id}>
                                        {dept.name}
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DepartmentManagementPage;