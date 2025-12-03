import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSupervisor, isFacultyAdmin, isStudent, logout } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    comment: '',
    rating: 5,
    status: 'approved'
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getById(id);
      setProject(response.data.project);
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Project not found');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmittingReview(true);

    try {
      await reviewsAPI.addReview(id, reviewData);
      await loadProject();
      setReviewData({ comment: '', rating: 5, status: 'approved' });
      alert('Review submitted successfully');
    } catch (error) {
      setError('Error submitting review: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Approve this project? It will be marked as approved.')) {
      return;
    }

    try {
      await reviewsAPI.approve(id);
      await loadProject();
      alert('Project approved successfully');
    } catch (error) {
      alert('Error approving project: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Publish this project? It will be visible to public visitors.')) {
      return;
    }

    try {
      await reviewsAPI.publish(id);
      await loadProject();
      alert('Project published successfully');
    } catch (error) {
      alert('Error publishing project: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await reviewsAPI.reject(id, reason);
      await loadProject();
      alert('Project rejected');
    } catch (error) {
      alert('Error rejecting project: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar user={user} logout={logout} />
        <div className="loading-state">Loading project...</div>
      </div>
    );
  }

  if (!project || error) {
    return (
      <div className="dashboard">
        <Navbar user={user} logout={logout} />
        <div className="empty-state">
          <p>{error || 'Project not found'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar user={user} logout={logout} />
      
      <main className="dashboard-main project-detail">
        <button onClick={() => navigate(-1)} className="btn btn-secondary back-btn">
          ← Back
        </button>

        <div className="project-detail-header">
          <div>
            <h1>{project.title}</h1>
            <div className="project-meta">
              <span className="project-category">{project.category}</span>
              <span className={`status-badge status-${project.status}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          {(isSupervisor || isFacultyAdmin) && project.status === 'approved' && (
            <button onClick={handlePublish} className="btn btn-primary">
              Publish
            </button>
          )}
          {isFacultyAdmin && project.status === 'under_review' && (
            <button onClick={handleApprove} className="btn btn-success">
              Approve
            </button>
          )}
          {(isSupervisor || isFacultyAdmin) && (
            <button onClick={handleReject} className="btn btn-danger">
              Reject
            </button>
          )}
        </div>

        <div className="project-detail-content">
          <div className="project-main">
            <section className="project-section">
              <h2>Abstract</h2>
              <p>{project.abstract}</p>
            </section>

            <section className="project-section">
              <h2>Description</h2>
              <p style={{ whiteSpace: 'pre-wrap' }}>{project.description}</p>
            </section>

            {project.teamMembers && project.teamMembers.length > 0 && (
              <section className="project-section">
                <h2>Team Members</h2>
                <ul className="team-list">
                  {project.teamMembers.map((member, index) => (
                    <li key={index}>
                      {member.name} {member.email && `(${member.email})`} {member.studentId && `- ${member.studentId}`}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.tags && project.tags.length > 0 && (
              <section className="project-section">
                <h2>Tags</h2>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              </section>
            )}

            {(project.githubRepo || project.liveDemo) && (
              <section className="project-section">
                <h2>Links</h2>
                <div className="project-links">
                  {project.githubRepo && (
                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      🔗 View on GitHub
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      🌐 View Live Demo
                    </a>
                  )}
                </div>
              </section>
            )}

            {project.documents && project.documents.length > 0 && (
              <section className="project-section">
                <h2>Documents</h2>
                <div className="documents-list">
                  {project.documents.map((doc, index) => (
                    <div key={index} className="document-item">
                      <span>📄 {doc.originalName}</span>
                      <a
                        href={`http://localhost:5000${doc.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.reviews && project.reviews.length > 0 && (
              <section className="project-section">
                <h2>Reviews</h2>
                <div className="reviews-list">
                  {project.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <strong>{review.reviewer?.firstName} {review.reviewer?.lastName}</strong>
                        {review.rating && <span>⭐ {review.rating}/5</span>}
                        <span className={`status-badge status-${review.status}`}>
                          {review.status}
                        </span>
                      </div>
                      <p>{review.comment}</p>
                      <small>{new Date(review.reviewedAt).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {(isSupervisor || isFacultyAdmin) && (
            <aside className="project-sidebar">
              <div className="review-form-card">
                <h3>Add Review</h3>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label>Comment *</label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      required
                      rows="5"
                      placeholder="Provide your review comments..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <select
                      value={reviewData.rating}
                      onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={reviewData.status}
                      onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                    >
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;

