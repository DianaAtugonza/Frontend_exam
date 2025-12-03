import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, reviewsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import '../styles/Dashboard.css';

const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: ''
  });

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll({
        supervisor: user.id,
        ...filters
      });
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="dashboard">
      <Navbar user={user} logout={logout} />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Supervisor Dashboard</h1>
            <p>Review and approve student projects</p>
          </div>
        </div>

        <div className="filters-bar">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App</option>
            <option value="AI/ML">AI/ML</option>
            <option value="IoT">IoT</option>
            <option value="Data Science">Data Science</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-state">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects assigned for review.</p>
          </div>
        ) : (
          <>
            <div className="projects-stats">
              <p>{projects.length} project{projects.length !== 1 ? 's' : ''} to review</p>
            </div>
            <div className="projects-grid">
              {projects.map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onView={handleViewProject}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SupervisorDashboard;

