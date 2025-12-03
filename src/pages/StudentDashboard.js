import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, uploadAPI } from '../services/api';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import '../styles/Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll({ student: user.id });
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedProject(null);
    loadProjects();
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectsAPI.delete(projectId);
      loadProjects();
    } catch (error) {
      alert('Error deleting project: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitProject = async (projectId) => {
    if (!window.confirm('Submit this project for review? You won\'t be able to edit it after submission.')) {
      return;
    }

    try {
      await projectsAPI.submit(projectId);
      loadProjects();
    } catch (error) {
      alert('Error submitting project: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="dashboard">
      <Navbar user={user} logout={logout} />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>My Projects</h1>
            <p>Create and manage your innovation projects</p>
          </div>
          <button className="btn btn-primary" onClick={handleCreateProject}>
            + New Project
          </button>
        </div>

        {showForm && (
          <ProjectForm
            project={selectedProject}
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )}

        {loading ? (
          <div className="loading-state">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any projects yet.</p>
            <button className="btn btn-primary" onClick={handleCreateProject}>
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onSubmit={handleSubmitProject}
                isStudent={true}
                onView={() => navigate(`/projects/${project._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;

