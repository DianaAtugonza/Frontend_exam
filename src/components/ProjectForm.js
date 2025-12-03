import React, { useState, useEffect } from 'react';
import { projectsAPI, uploadAPI } from '../services/api';
import '../styles/ProjectForm.css';

const ProjectForm = ({ project, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    abstract: '',
    category: 'Web Development',
    githubRepo: '',
    liveDemo: '',
    tags: '',
    teamMembers: [{ name: '', email: '', studentId: '' }]
  });
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Web Development', 'Mobile App', 'AI/ML', 'IoT', 'Data Science', 'Blockchain', 'Other'];

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        abstract: project.abstract || '',
        category: project.category || 'Web Development',
        githubRepo: project.githubRepo || '',
        liveDemo: project.liveDemo || '',
        tags: project.tags ? project.tags.join(', ') : '',
        teamMembers: project.teamMembers && project.teamMembers.length > 0 
          ? project.teamMembers 
          : [{ name: '', email: '', studentId: '' }]
      });
      setDocuments(project.documents || []);
    }
  }, [project]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleTeamMemberChange = (index, field, value) => {
    const newTeamMembers = [...formData.teamMembers];
    newTeamMembers[index][field] = value;
    setFormData({ ...formData, teamMembers: newTeamMembers });
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: '', email: '', studentId: '' }]
    });
  };

  const removeTeamMember = (index) => {
    const newTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, teamMembers: newTeamMembers });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = files.map(file => uploadAPI.uploadFile(file));
      const responses = await Promise.all(uploadPromises);
      
      const newDocuments = responses.map(res => ({
        filename: res.data.file.filename,
        originalName: res.data.file.originalName,
        filePath: res.data.file.filePath,
        fileType: res.data.file.fileType,
        uploadDate: new Date()
      }));

      setDocuments([...documents, ...newDocuments]);
    } catch (error) {
      setError('Error uploading files: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = async (filename) => {
    try {
      await uploadAPI.deleteFile(filename);
      setDocuments(documents.filter(doc => doc.filename !== filename));
    } catch (error) {
      setError('Error deleting file: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        teamMembers: formData.teamMembers.filter(member => member.name || member.email),
        documents
      };

      if (project) {
        await projectsAPI.update(project._id, submitData);
      } else {
        await projectsAPI.create(submitData);
      }

      onSave();
    } catch (error) {
      setError('Error saving project: ' + (error.response?.data?.message || error.message));
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content project-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{project ? 'Edit Project' : 'Create New Project'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="project-form-content">
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
            />
          </div>

          <div className="form-group">
            <label>Abstract *</label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Brief summary of your project"
            />
          </div>

          <div className="form-group">
            <label>Full Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Detailed description of your project"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub Repository URL</label>
              <input
                type="url"
                name="githubRepo"
                value={formData.githubRepo}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="form-group">
              <label>Live Demo URL</label>
              <input
                type="url"
                name="liveDemo"
                value={formData.liveDemo}
                onChange={handleChange}
                placeholder="https://your-demo.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., react, nodejs, mongodb"
            />
          </div>

          <div className="form-group">
            <label>Team Members</label>
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="team-member-row">
                <input
                  type="text"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={member.email}
                  onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Student ID"
                  value={member.studentId}
                  onChange={(e) => handleTeamMemberChange(index, 'studentId', e.target.value)}
                />
                {formData.teamMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addTeamMember} className="btn btn-secondary btn-sm">
              + Add Team Member
            </button>
          </div>

          <div className="form-group">
            <label>Documents</label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.zip,.rar"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading && <p className="upload-status">Uploading...</p>}
            
            {documents.length > 0 && (
              <div className="documents-list">
                {documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <span>📄 {doc.originalName}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.filename)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;

