import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/DashboardNew.css';

const Settings = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        projectUpdates: true,
        reviewAlerts: true,
        weeklyDigest: false
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleNotificationChange = (e) => {
        setNotifications({ ...notifications, [e.target.name]: e.target.checked });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // TODO: Implement password change API call
        console.log('Changing password');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleNotificationSave = () => {
        // TODO: Implement notification settings API call
        console.log('Saving notification settings:', notifications);
        alert('Settings saved successfully!');
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>Settings</h2>
                <p>Manage your account preferences</p>
            </div>

            <div className="settings-container" style={{ maxWidth: '800px' }}>
                {/* Notification Settings */}
                <div className="settings-section" style={{ background: 'white', borderRadius: '8px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Notification Preferences</h3>
                    
                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Email Notifications</h4>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Receive email updates about your account</p>
                        </div>
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={notifications.emailNotifications}
                                onChange={handleNotificationChange}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: notifications.emailNotifications ? '#667eea' : '#cbd5e1',
                                transition: '0.4s',
                                borderRadius: '24px'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '',
                                    height: '18px',
                                    width: '18px',
                                    left: notifications.emailNotifications ? '28px' : '3px',
                                    bottom: '3px',
                                    backgroundColor: 'white',
                                    transition: '0.4s',
                                    borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Project Updates</h4>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Get notified when your projects are reviewed</p>
                        </div>
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input
                                type="checkbox"
                                name="projectUpdates"
                                checked={notifications.projectUpdates}
                                onChange={handleNotificationChange}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: notifications.projectUpdates ? '#667eea' : '#cbd5e1',
                                transition: '0.4s',
                                borderRadius: '24px'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '',
                                    height: '18px',
                                    width: '18px',
                                    left: notifications.projectUpdates ? '28px' : '3px',
                                    bottom: '3px',
                                    backgroundColor: 'white',
                                    transition: '0.4s',
                                    borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Review Alerts</h4>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Notifications for new reviews and comments</p>
                        </div>
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input
                                type="checkbox"
                                name="reviewAlerts"
                                checked={notifications.reviewAlerts}
                                onChange={handleNotificationChange}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: notifications.reviewAlerts ? '#667eea' : '#cbd5e1',
                                transition: '0.4s',
                                borderRadius: '24px'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '',
                                    height: '18px',
                                    width: '18px',
                                    left: notifications.reviewAlerts ? '28px' : '3px',
                                    bottom: '3px',
                                    backgroundColor: 'white',
                                    transition: '0.4s',
                                    borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Weekly Digest</h4>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Receive a weekly summary of activities</p>
                        </div>
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input
                                type="checkbox"
                                name="weeklyDigest"
                                checked={notifications.weeklyDigest}
                                onChange={handleNotificationChange}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: notifications.weeklyDigest ? '#667eea' : '#cbd5e1',
                                transition: '0.4s',
                                borderRadius: '24px'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '',
                                    height: '18px',
                                    width: '18px',
                                    left: notifications.weeklyDigest ? '28px' : '3px',
                                    bottom: '3px',
                                    backgroundColor: 'white',
                                    transition: '0.4s',
                                    borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    <button className="btn btn-primary" onClick={handleNotificationSave}>
                        Save Notification Settings
                    </button>
                </div>

                {/* Password Change */}
                <div className="settings-section" style={{ background: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Change Password</h3>
                    
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
