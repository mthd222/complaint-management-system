import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar, Nav, Button, Container } from 'react-bootstrap'; // Import components
// import './Navbar.css';
const AppNavbar = () => { // Renamed to avoid conflict with imported Navbar
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold"> ComplaintSystem</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user ? (
                            <>
                                <Nav.Link as={Link} to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                                    Dashboard
                                </Nav.Link>
                                <Navbar.Text className="me-2">
                                    Signed in as: <span className="fw-bold">{user.email}</span>
                                </Navbar.Text>
                                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="fw-bold">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="fw-bold">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;