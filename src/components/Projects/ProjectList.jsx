import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { projectsAPI } from '../../services/api';
import styles from './Projects.module.css';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            setError(null);
            const response = await projectsAPI.getAll({
                role: 'public',
                category: filters.category || undefined,
                search: filters.search || undefined
            });
            const mappedProjects = (response.data.projects || []).map(p => ({
                ...p,
                id: p._id,
                author: p.author?.name || 'Unknown',
                date: p.createdAt
            }));
            setProjects(mappedProjects);
        } catch (err) {
            setError('Failed to load projects');
            console.error('Error loading projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['', 'Web Development', 'Mobile App', 'AI/ML', 'IoT', 'Data Science', 'Blockchain', 'Other'];

    return (
        <div className={styles.projectListContainer}>
            {/* Filters */}
            <div className={styles.filterBar}>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.categoryFilter}>
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className={styles.categorySelect}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat || 'All Categories'}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className={styles.loadingState}>Loading projects...</div>
            ) : error ? (
                <div className={styles.errorState}>
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            ) : projects.length > 0 ? (
                <div className={styles.projectGrid}>
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h3>No projects found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectList;
