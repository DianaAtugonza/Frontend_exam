import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Innovators Hub</h2>
                    <span className={styles.roleBadge}>Student</span>
                </div>

                <nav className={styles.sidebarNav}>
                    <Link to="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}>
                        <span>📊</span>
                        <span>Overview</span>
                    </Link>
                    <Link to="/dashboard/submit" className={`${styles.navItem} ${isActive('/dashboard/submit') ? styles.active : ''}`}>
                        <span>📁</span>
                        <span>Submit Project</span>
                    </Link>
                    <Link to="/dashboard/profile" className={`${styles.navItem} ${isActive('/dashboard/profile') ? styles.active : ''}`}>
                        <span>👤</span>
                        <span>Profile</span>
                    </Link>
                    <Link to="/dashboard/settings" className={`${styles.navItem} ${isActive('/dashboard/settings') ? styles.active : ''}`}>
                        <span>⚙️</span>
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.topHeader}>
                    <h1>Dashboard</h1>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>{user?.name?.substring(0, 2).toUpperCase() || 'U'}</div>
                        <span>{user?.name || 'User'}</span>
                    </div>
                </header>
                <div className={styles.contentArea}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
