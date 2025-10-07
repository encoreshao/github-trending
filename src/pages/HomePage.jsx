import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined, GithubOutlined, StarOutlined, RocketOutlined, SyncOutlined, FilterOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-logo">
            <GithubOutlined className="logo-icon" />
            <span className="logo-text">GitHub Trending</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="https://github.com/encoreshao/github-trending" target="_blank" rel="noopener noreferrer" className="nav-link">
              <GithubOutlined style={{ marginRight: 4 }} />
              GitHub
            </a>
            <Button
              type="primary"
              className="nav-cta"
              onClick={() => navigate('/subscribe')}
            >
              Subscribe
            </Button>
            <Button
              className="nav-secondary"
              onClick={() => navigate('/demo')}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover the most <span className="gradient-text">trending</span> GitHub repositories
            </h1>
            <p className="hero-subtitle">
              Stay ahead of the curve with our intelligent GitHub trending analysis.
              Get real-time insights into the most popular repositories, languages, and developers.
            </p>
            <div className="hero-actions">
              <Button
                type="primary"
                size="large"
                className="hero-cta"
                onClick={() => navigate('/subscribe')}
                icon={<RocketOutlined />}
              >
                Get Started
              </Button>
              <Button
                size="large"
                className="hero-secondary"
                onClick={() => navigate('/demo')}
                icon={<GithubOutlined />}
              >
                View Demo
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-header">
                <div className="avatar-placeholder">
                  <img src="https://github.com/facebook.png" alt="facebook" className="avatar" />
                </div>
                <div className="repo-info">
                  <div className="repo-name">react</div>
                  <div className="repo-owner">facebook</div>
                </div>
                <div className="stars">
                  <StarOutlined />
                  <span>210k</span>
                </div>
              </div>
              <div className="card-content">
                <p>A declarative, efficient, and flexible JavaScript library for building user interfaces.</p>
                <div className="topics">
                  <span className="topic">javascript</span>
                  <span className="topic">react</span>
                  <span className="topic">ui</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <h2 className="features-title">Why choose GitHub Trending?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <SyncOutlined />
              </div>
              <h3 className="feature-title">Real-time Data</h3>
              <p className="feature-description">
                Get the latest trending repositories updated in real-time with our advanced GitHub API integration.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FilterOutlined />
              </div>
              <h3 className="feature-title">Smart Analytics</h3>
              <p className="feature-description">
                Advanced filtering and analytics to help you discover the most relevant repositories for your needs.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <ShareAltOutlined />
              </div>
              <h3 className="feature-title">Export & Share</h3>
              <p className="feature-description">
                Export your findings in multiple formats (CSV, JSON) and share insights with your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to discover amazing repositories?</h2>
          <p className="cta-subtitle">Join thousands of developers who use GitHub Trending to stay ahead.</p>
          <Button
            type="primary"
            size="large"
            className="cta-button"
            onClick={() => navigate('/subscribe')}
            icon={<ArrowRightOutlined />}
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <GithubOutlined className="logo-icon" />
              <span className="logo-text">GitHub Trending</span>
            </div>
            <div className="footer-links">
              <a href="#features" className="footer-link">Features</a>
              <a href="/subscribe" className="footer-link">Subscribe</a>
              <a href="/demo" className="footer-link">Demo</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 RanBOT Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
