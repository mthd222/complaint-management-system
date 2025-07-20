import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppNavbar from './components/Navbar';
import { Container } from 'react-bootstrap';

// Import Pages
import LandingPage from './pages/LandingPage'; // Import the new landing page
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// This component helps redirect logged-in users away from public pages
const PublicRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (user) {
        // Redirect to the appropriate dashboard if the user is already logged in
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
    }
    return children;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        {/* Main content area */}
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            
            {/* User Protected Route */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Container className="mt-4"><UserDashboardPage /></Container>
              </ProtectedRoute>
            } />
            
            {/* Admin Protected Route */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                 <Container className="mt-4"><AdminDashboardPage /></Container>
              </ProtectedRoute>
            } />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;