import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/DashboardNew.css';

const SupervisorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll({ status: 'submitted' });
      setProjects(response.data.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (projectId) => {
    if (!window.confirm('Are you sure you want to approve this project?')) return;

    try {
      await reviewsAPI.approve(projectId);
      fetchProjects();
      alert('Project approved successfully!');
    } catch (err) {
      alert('Failed to approve project');
    }
  };

  const handleReject = async (projectId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await reviewsAPI.reject(projectId, reason);
      fetchProjects();
      alert('Project rejected');
    } catch (err) {
      alert('Failed to reject project');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      await reviewsAPI.addReview(selectedProject, reviewData);
      setSelectedProject(null);
      setReviewData({ rating: 5, comment: '' });
      fetchProjects();
      alert('Review added successfully!');
    } catch (err) {
      alert('Failed to add review');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      submitted: 'badge-info',
      'in-progress': 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger'
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
          <h1>Project Reviews</h1>
          <p>Review and approve student projects</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{projects.length}</h3>
          <p>Pending Reviews</p>
        </div>
        <div className="stat-card">
          <h3>{projects.filter(p => p.supervisor?.email === user.email).length}</h3>
          <p>Assigned to Me</p>
        </div>
      </div>

      <div className="projects-section">
        {projects.length === 0 ? (
          <div className="empty-state">
            <h3>No Projects to Review</h3>
            <p>There are currently no projects pending review</p>
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
                  <span className="meta-item">👤 {project.author.name}</span>
                  <span className="meta-item">📁 {project.category}</span>
                  <span className="meta-item">📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-tags">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tag">{tech}</span>
                    ))}
                  </div>
                )}
                <div className="project-actions">
                  <button 
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="btn btn-sm btn-secondary"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => setSelectedProject(project._id)}
                    className="btn btn-sm btn-info"
                  >
                    Add Review
                  </button>
                  <button 
                    onClick={() => handleApprove(project._id)}
                    className="btn btn-sm btn-success"
                  >
                    ✓ Approve
                  </button>
                  <button 
                    onClick={() => handleReject(project._id)}
                    className="btn btn-sm btn-danger"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Review</h2>
            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <select
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: Number(e.target.value) })}
                  required
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Needs Improvement</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comments</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  rows="5"
                  placeholder="Provide detailed feedback..."
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setSelectedProject(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorDashboard;
