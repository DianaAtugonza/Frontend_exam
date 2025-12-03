import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/DashboardNew.css';

const StudentDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      // Filter to only show user's projects
      const userProjects = response.data.data.filter(
        project => project.author.email === user.email
      );
      setProjects(userProjects);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProject = async (projectId) => {
    try {
      await projectsAPI.submit(projectId);
      fetchProjects(); // Refresh list
    } catch (err) {
      alert('Failed to submit project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectsAPI.delete(projectId);
      fetchProjects(); // Refresh list
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'badge-secondary',
      submitted: 'badge-info',
      'in-progress': 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      completed: 'badge-primary'
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>My Projects</h1>
          <p>Manage and track your innovation projects</p>
        </div>
        <Link to="/dashboard/submit" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{projects.length}</h3>
          <p>Total Projects</p>
        </div>
        <div className="stat-card">
          <h3>{projects.filter(p => p.status === 'draft').length}</h3>
          <p>Drafts</p>
        </div>
        <div className="stat-card">
          <h3>{projects.filter(p => p.status === 'submitted').length}</h3>
          <p>Under Review</p>
        </div>
        <div className="stat-card">
          <h3>{projects.filter(p => p.status === 'approved' || p.status === 'completed').length}</h3>
          <p>Approved</p>
        </div>
      </div>

      <div className="projects-section">
        {projects.length === 0 ? (
          <div className="empty-state">
            <h3>No Projects Yet</h3>
            <p>Start by creating your first innovation project</p>
            <Link to="/dashboard/submit" className="btn btn-primary">
              Create Project
            </Link>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map((project) => (
              <div key={project._id} className="project-card-dashboard">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`badge ${getStatusBadge(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description.substring(0, 150)}...</p>
                <div className="project-meta">
                  <span className="meta-item">📁 {project.category}</span>
                  <span className="meta-item">📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                  {project.supervisor && (
                    <span className="meta-item">👤 {project.supervisor.name}</span>
                  )}
                </div>
                <div className="project-actions">
                  <button 
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="btn btn-sm btn-secondary"
                  >
                    View
                  </button>
                  {project.status === 'draft' && (
                    <>
                      <button 
                        onClick={() => navigate(`/dashboard/submit?edit=${project._id}`)}
                        className="btn btn-sm btn-info"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleSubmitProject(project._id)}
                        className="btn btn-sm btn-primary"
                      >
                        Submit for Review
                      </button>
                    </>
                  )}
                  {(project.status === 'draft' || project.status === 'rejected') && (
                    <button 
                      onClick={() => handleDeleteProject(project._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
