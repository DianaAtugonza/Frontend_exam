import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import '../styles/Dashboard.css';

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll({
        role: 'public',
        category: filters.category || undefined,
        search: filters.search || undefined
      });
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Web Development', 'Mobile App', 'AI/ML', 'IoT', 'Data Science', 'Blockchain', 'Other'];

  return (
    <div className="dashboard">
      <Navbar showLogin={true} />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>🎓 UCU Innovators Hub</h1>
            <p>Explore innovative projects by UCU students</p>
          </div>
        </div>

        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-state">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No published projects found.</p>
          </div>
        ) : (
          <>
            <div className="projects-stats">
              <p>{projects.length} project{projects.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="projects-grid">
              {projects.map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onView={() => navigate(`/projects/${project._id}`)}
                  isPublic={true}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PublicDashboard;

