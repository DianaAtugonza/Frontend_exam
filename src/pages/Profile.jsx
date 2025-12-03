import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/DashboardNew.css';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        department: user?.department || '',
        phone: user?.phone || '',
        bio: user?.bio || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement profile update API call
        console.log('Updating profile:', formData);
        setIsEditing(false);
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>My Profile</h2>
                <p>Manage your personal information</p>
            </div>

            <div className="profile-container" style={{ maxWidth: '800px' }}>
                <div className="profile-card">
                    <div className="profile-avatar-section" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="avatar-large" style={{ 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            color: 'white',
                            margin: '0 auto 1rem',
                            fontWeight: 'bold'
                        }}>
                            {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <h3>{user?.name}</h3>
                        <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
                    </div>

                    <div className="profile-form-section" style={{ padding: '2rem' }}>
                        {!isEditing ? (
                            <div className="profile-info">
                                <div className="info-row" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>Email</label>
                                    <p style={{ fontSize: '1rem', color: '#1e293b' }}>{user?.email}</p>
                                </div>
                                <div className="info-row" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>Role</label>
                                    <p style={{ fontSize: '1rem', color: '#1e293b', textTransform: 'capitalize' }}>{user?.role}</p>
                                </div>
                                <div className="info-row" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>Department</label>
                                    <p style={{ fontSize: '1rem', color: '#1e293b' }}>{formData.department || 'Not specified'}</p>
                                </div>
                                <div className="info-row" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>Phone</label>
                                    <p style={{ fontSize: '1rem', color: '#1e293b' }}>{formData.phone || 'Not specified'}</p>
                                </div>
                                <div className="info-row" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>Bio</label>
                                    <p style={{ fontSize: '1rem', color: '#1e293b' }}>{formData.bio || 'No bio added yet'}</p>
                                </div>
                                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled
                                        style={{ background: '#f1f5f9' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="department">Department</label>
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bio">Bio</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows="4"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself..."
                                    ></textarea>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
