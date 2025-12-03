import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import FacultyAdminDashboard from './pages/FacultyAdminDashboard';
import PublicDashboard from './pages/PublicDashboard';
import ProjectDetail from './pages/ProjectDetail';
import Loading from './components/Loading';

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Role-based redirect
const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'student':
      return <Navigate to="/student/dashboard" replace />;
    case 'supervisor':
      return <Navigate to="/supervisor/dashboard" replace />;
    case 'faculty_admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/public" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public" element={<PublicDashboard />} />
          <Route path="/" element={<DashboardRedirect />} />
          
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor/dashboard"
            element={
              <ProtectedRoute requiredRole="supervisor">
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="faculty_admin">
                <FacultyAdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
