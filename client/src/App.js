import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { Container } from 'react-bootstrap'; // Import Container

// ... (rest of your imports)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import './App.css';

// A simple home component that redirects based on user role
const Home = () => {
    const { user } = React.useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container className="mt-4"> {/* Use Container and add top margin */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;