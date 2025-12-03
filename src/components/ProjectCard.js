import React from 'react';
import '../styles/ProjectCard.css';

const ProjectCard = ({ project, onEdit, onDelete, onSubmit, onView, isStudent, isPublic }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      draft: 'status-draft',
      submitted: 'status-submitted',
      under_review: 'status-review',
      approved: 'status-approved',
      rejected: 'status-rejected',
      published: 'status-published'
    };

    const statusLabels = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      published: 'Published'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3>{project.title}</h3>
        {getStatusBadge(project.status)}
      </div>

      <div className="project-card-body">
        <p className="project-category">{project.category}</p>
        <p className="project-description">
          {project.abstract || project.description.substring(0, 150)}...
        </p>

        {project.student && (
          <p className="project-author">
            By: {project.student.firstName} {project.student.lastName}
            {project.student.studentId && ` (${project.student.studentId})`}
          </p>
        )}

        <div className="project-links">
          {project.githubRepo && (
            <a
              href={project.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              🔗 GitHub
            </a>
          )}
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              🌐 Live Demo
            </a>
          )}
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="project-tags">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="project-card-footer">
        {isPublic || project.status === 'published' ? (
          <button onClick={onView} className="btn btn-primary btn-sm">
            View Details
          </button>
        ) : isStudent ? (
          <>
            <button onClick={onView} className="btn btn-secondary btn-sm">
              View
            </button>
            {project.status === 'draft' && (
              <>
                <button onClick={() => onEdit(project)} className="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button onClick={() => onSubmit(project._id)} className="btn btn-primary btn-sm">
                  Submit
                </button>
              </>
            )}
            {project.status === 'draft' && (
              <button onClick={() => onDelete(project._id)} className="btn btn-danger btn-sm">
                Delete
              </button>
            )}
          </>
        ) : (
          <button onClick={onView} className="btn btn-primary btn-sm">
            Review
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

