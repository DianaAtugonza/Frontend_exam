import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import './Explore.css';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const navigate = useNavigate();

  const categories = ['Technology', 'Healthcare', 'Education', 'Agriculture', 'Business', 'Other'];
  const years = ['2024', '2023', '2022', '2021', '2020'];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedCategory, selectedYear, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Fetch only completed/published projects
      const response = await projectsAPI.getAll({ status: 'completed' });
      setProjects(response.data.data);
      setFilteredProjects(response.data.data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter(project => 
        new Date(project.createdAt).getFullYear().toString() === selectedYear
      );
    }

    setFilteredProjects(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedYear('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="explore-container">
      <div className="explore-hero">
        <h1>Discover Innovation</h1>
        <p>Explore groundbreaking projects from UCU students</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search projects by title, description, or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="filters-grid">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="filter-select"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {(searchTerm || selectedCategory || selectedYear) && (
            <button onClick={clearFilters} className="btn-clear">
              Clear Filters
            </button>
          )}
        </div>

        <div className="results-count">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="empty-explore">
          <h3>No projects found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div 
              key={project._id} 
              className="project-card"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <div className="project-card-header">
                <span className="project-category">{project.category}</span>
                <span className="project-views">👁 {project.views}</span>
              </div>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-excerpt">
                {project.description.substring(0, 120)}...
              </p>

              {project.technologies && project.technologies.length > 0 && (
                <div className="project-techs">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="tech-tag">+{project.technologies.length - 3}</span>
                  )}
                </div>
              )}

              <div className="project-card-footer">
                <div className="author-info">
                  <span className="author-avatar">👤</span>
                  <span className="author-name">{project.author.name}</span>
                </div>
                <div className="project-likes">
                  ❤️ {project.likes}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
