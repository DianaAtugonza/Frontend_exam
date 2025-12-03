import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI, usersAPI, reviewsAPI } from '../services/api';
import '../styles/DashboardNew.css';

const FacultyAdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, usersRes] = await Promise.all([
        projectsAPI.getAll(),
        usersAPI.getAll()
      ]);
      setProjects(projectsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (projectId) => {
    if (!window.confirm('Publish this project to the public gallery?')) return;

    try {
      await reviewsAPI.publish(projectId);
      fetchData();
      alert('Project published successfully!');
    } catch (err) {
      alert('Failed to publish project');
    }
  };

  const handleAssignSupervisor = async (projectId) => {
    const supervisors = users.filter(u => u.role === 'supervisor' || u.role === 'faculty');
    if (supervisors.length === 0) {
      alert('No supervisors available');
      return;
    }

    const supervisorId = prompt(`Enter supervisor ID from: ${supervisors.map(s => `${s.name} (${s._id})`).join(', ')}`);
    if (!supervisorId) return;

    try {
      await usersAPI.assignSupervisor(projectId, supervisorId);
      fetchData();
      alert('Supervisor assigned successfully!');
    } catch (err) {
      alert('Failed to assign supervisor');
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

  // Analytics calculations
  const totalProjects = projects.length;
  const approvedProjects = projects.filter(p => p.status === 'approved' || p.status === 'completed').length;
  const pendingProjects = projects.filter(p => p.status === 'submitted').length;
  const rejectedProjects = projects.filter(p => p.status === 'rejected').length;
  const approvalRate = totalProjects > 0 ? ((approvedProjects / totalProjects) * 100).toFixed(1) : 0;

  // Technology trends
  const techCounts = {};
  projects.forEach(project => {
    if (project.technologies) {
      project.technologies.forEach(tech => {
        techCounts[tech] = (techCounts[tech] || 0) + 1;
      });
    }
  });
  const topTechnologies = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Category distribution
  const categoryCounts = {};
  projects.forEach(project => {
    categoryCounts[project.category] = (categoryCounts[project.category] || 0) + 1;
  });

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Faculty Admin Dashboard</h1>
          <p>Manage projects, users, and view analytics</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          All Projects
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{totalProjects}</h3>
              <p>Total Projects</p>
            </div>
            <div className="stat-card stat-success">
              <h3>{approvedProjects}</h3>
              <p>Approved Projects</p>
            </div>
            <div className="stat-card stat-warning">
              <h3>{pendingProjects}</h3>
              <p>Pending Review</p>
            </div>
            <div className="stat-card stat-danger">
              <h3>{rejectedProjects}</h3>
              <p>Rejected</p>
            </div>
            <div className="stat-card stat-info">
              <h3>{approvalRate}%</h3>
              <p>Approval Rate</p>
            </div>
            <div className="stat-card">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="analytics-section">
            <div className="analytics-card">
              <h3>Top Technologies</h3>
              {topTechnologies.length > 0 ? (
                <div className="tech-list">
                  {topTechnologies.map(([tech, count]) => (
                    <div key={tech} className="tech-item">
                      <span className="tech-name">{tech}</span>
                      <span className="tech-count">{count} projects</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No data available</p>
              )}
            </div>

            <div className="analytics-card">
              <h3>Projects by Category</h3>
              <div className="category-list">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="category-item">
                    <span>{category}</span>
                    <span className="badge badge-primary">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-card">
              <h3>User Distribution</h3>
              <div className="category-list">
                <div className="category-item">
                  <span>Students</span>
                  <span className="badge badge-info">{users.filter(u => u.role === 'student').length}</span>
                </div>
                <div className="category-item">
                  <span>Supervisors</span>
                  <span className="badge badge-success">{users.filter(u => u.role === 'supervisor').length}</span>
                </div>
                <div className="category-item">
                  <span>Faculty</span>
                  <span className="badge badge-warning">{users.filter(u => u.role === 'faculty').length}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="projects-section">
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
                <div className="project-actions">
                  <button 
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="btn btn-sm btn-secondary"
                  >
                    View
                  </button>
                  {!project.supervisor && (
                    <button 
                      onClick={() => handleAssignSupervisor(project._id)}
                      className="btn btn-sm btn-info"
                    >
                      Assign Supervisor
                    </button>
                  )}
                  {project.status === 'approved' && (
                    <button 
                      onClick={() => handlePublish(project._id)}
                      className="btn btn-sm btn-success"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="users-section">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge badge-${user.role === 'student' ? 'info' : user.role === 'supervisor' ? 'success' : 'warning'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.department || '-'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacultyAdminDashboard;
