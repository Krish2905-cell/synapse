import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';

// Shows a centered spinner while auth state is resolving
const Spinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f1117' }}>
    <div style={{ width: 36, height: 36, border: '3px solid #1e2535', borderTopColor: '#3b5bdb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>
);

// Redirects authenticated users away from public-only routes (login/signup/landing)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Redirects unauthenticated users to the landing page
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  return (
    <SocketProvider>
      <Routes>
        {/* Public landing — authenticated users bounce to dashboard */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />

        {/* Auth pages — authenticated users bounce to dashboard */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

        {/* Protected app routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/project/:projectId" element={<PrivateRoute><ProjectPage /></PrivateRoute>} />

        {/* Fallback — send unknown paths to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SocketProvider>
  );
}
