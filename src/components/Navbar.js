import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = ({ user, logout, showLogin = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/public';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'supervisor':
        return '/supervisor/dashboard';
      case 'faculty_admin':
        return '/admin/dashboard';
      default:
        return '/public';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={getDashboardLink()} className="nav-logo">
          🎓 UCU Innovators Hub
        </Link>
        <ul className="nav-menu">
          {isAuthenticated && user ? (
            <>
              <li>
                <Link to={getDashboardLink()} className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/public" className="nav-link">
                  Browse Projects
                </Link>
              </li>
              <li className="nav-user">
                <span>{user.firstName} {user.lastName}</span>
                <span className="nav-role">{user.role.replace('_', ' ')}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/public" className="nav-link">
                  Projects
                </Link>
              </li>
              {showLogin && (
                <>
                  <li>
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="btn btn-primary btn-sm">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

