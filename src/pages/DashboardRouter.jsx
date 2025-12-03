import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case 'student':
          navigate('/dashboard/student', { replace: true });
          break;
        case 'supervisor':
          navigate('/dashboard/supervisor', { replace: true });
          break;
        case 'faculty':
        case 'admin':
          navigate('/dashboard/admin', { replace: true });
          break;
        default:
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );
}

export default Dashboard;
