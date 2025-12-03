import React, { useState, useEffect } from 'react';
import { Folder, Code, Users, TrendingUp } from 'lucide-react';
import { projectsAPI } from '../../services/api';

const PublicDashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalCategories: 0,
        totalStudents: 0,
        trendingTech: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPublicStats();
    }, []);

    const loadPublicStats = async () => {
        try {
            // This would ideally call a public stats API endpoint
            // For now, we'll use mock data or derive from projects
            const response = await projectsAPI.getAll({ role: 'public' });
            const projects = response.data.projects || [];

            // Calculate basic stats
            const categories = new Set(projects.map(p => p.category));
            const technologies = projects.flatMap(p => p.technologies || []);
            const techCount = technologies.reduce((acc, tech) => {
                acc[tech] = (acc[tech] || 0) + 1;
                return acc;
            }, {});

            const trendingTech = Object.entries(techCount)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([tech, count]) => ({ tech, count }));

            setStats({
                totalProjects: projects.length,
                totalCategories: categories.size,
                totalStudents: new Set(projects.map(p => p.author?.id)).size,
                trendingTech
            });
        } catch (error) {
            console.error('Error loading public stats:', error);
            // Set default values if API fails
            setStats({
                totalProjects: 0,
                totalCategories: 0,
                totalStudents: 0,
                trendingTech: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                Loading statistics...
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
        }}>
            <StatsCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={<Folder size={20} />}
                description="Innovative projects shared"
            />
            <StatsCard
                title="Categories"
                value={stats.totalCategories}
                icon={<Code size={20} />}
                description="Different innovation areas"
            />
            <StatsCard
                title="Active Innovators"
                value={stats.totalStudents}
                icon={<Users size={20} />}
                description="Students contributing"
            />
            <StatsCard
                title="Trending Tech"
                value={stats.trendingTech.length > 0 ? stats.trendingTech[0].tech : 'N/A'}
                icon={<TrendingUp size={20} />}
                description="Most used technology"
            />
        </div>
    );
};

const StatsCard = ({ title, value, icon, description }) => (
    <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        transition: 'transform var(--transition-fast)',
        cursor: 'default'
    }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
        }}>
            <div style={{
                color: 'var(--color-primary)',
                background: 'rgba(0, 71, 171, 0.1)',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)'
            }}>
                {icon}
            </div>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.25rem' }}>
            {title}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {description}
        </div>
    </div>
);

export default PublicDashboard;
