import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Innovate. Collaborate. <span className="gradient-text">Showcase.</span>
          </h1>
          <p className="hero-description">
            The centralized platform for Uganda Christian University students to document,
            share, and discover groundbreaking innovations.
          </p>
          <div className="hero-buttons">
            <Link to="/explore" className="btn btn-primary btn-large">
              Explore Projects →
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline btn-large">
                Get Started
              </Link>
            )}
            {user && (
              <Link to="/dashboard" className="btn btn-outline btn-large">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why UCU Innovators Hub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Showcase Your Work</h3>
              <p>Display your innovative projects to the UCU community and beyond. Get recognized for your creativity and hard work.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Collaborate</h3>
              <p>Connect with fellow innovators, get feedback from supervisors, and work together on groundbreaking projects.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Get Approved</h3>
              <p>Submit your projects for review by faculty supervisors and get your work officially recognized and published.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Public Gallery</h3>
              <p>Approved projects are showcased in our public gallery, accessible to everyone interested in UCU innovations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your project's status from draft to submission, review, approval, and final publication.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Get Inspired</h3>
              <p>Browse projects across multiple categories and discover what your peers are building across different fields.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Explore by Category</h2>
          <div className="categories-grid">
            <div className="category-card" onClick={() => navigate('/explore?category=Technology')}>
              <div className="category-icon">💻</div>
              <h3>Technology</h3>
              <p>Software, Apps, AI & More</p>
            </div>
            <div className="category-card" onClick={() => navigate('/explore?category=Healthcare')}>
              <div className="category-icon">🏥</div>
              <h3>Healthcare</h3>
              <p>Medical Innovations</p>
            </div>
            <div className="category-card" onClick={() => navigate('/explore?category=Education')}>
              <div className="category-icon">📚</div>
              <h3>Education</h3>
              <p>Learning Solutions</p>
            </div>
            <div className="category-card" onClick={() => navigate('/explore?category=Agriculture')}>
              <div className="category-icon">🌾</div>
              <h3>Agriculture</h3>
              <p>Farming Tech</p>
            </div>
            <div className="category-card" onClick={() => navigate('/explore?category=Business')}>
              <div className="category-icon">💼</div>
              <h3>Business</h3>
              <p>Entrepreneurship</p>
            </div>
            <div className="category-card" onClick={() => navigate('/explore?category=Other')}>
              <div className="category-icon">✨</div>
              <h3>Other</h3>
              <p>Diverse Projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Share Your Innovation?</h2>
          <p>Join hundreds of UCU students showcasing their groundbreaking projects</p>
          {!user ? (
            <Link to="/register" className="btn btn-primary btn-large">
              Create Your Account
            </Link>
          ) : (
            <Link to="/dashboard/submit" className="btn btn-primary btn-large">
              Submit Your Project
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
