import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined, GithubOutlined, SyncOutlined, FilterOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import App from '../App';
import './DemoPage.css';
import './DemoPageGlobal.css';

const DemoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="demo-page">
      {/* Navigation */}
      <nav className="demo-nav">
        <div className="demo-nav-container">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            className="back-button"
          >
            Back to Home
          </Button>
          <div className="demo-nav-logo">
            <GithubOutlined className="logo-icon" />
            <span className="logo-text">GitHub Trending</span>
          </div>
          <div className="demo-nav-actions">
            <a href="https://github.com/encoreshao/github-trending" target="_blank" rel="noopener noreferrer" className="demo-nav-link">
              <GithubOutlined style={{ marginRight: 4 }} />
              GitHub
            </a>
            <Button
              type="primary"
              className="demo-nav-cta"
              onClick={() => navigate('/subscribe')}
            >
              Get Full Access
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Header */}
      <div className="demo-header">
        <div className="demo-header-container">
          <h1 className="demo-title">Live Demo</h1>
          <p className="demo-subtitle">
            Experience the full power of GitHub Trending. This is a live demonstration
            of our trending repository analysis tool.
          </p>
          <div className="demo-features">
            <div className="demo-feature">
              <SyncOutlined className="feature-icon" />
              <span>Real-time GitHub data</span>
            </div>
            <div className="demo-feature">
              <FilterOutlined className="feature-icon" />
              <span>Advanced filtering</span>
            </div>
            <div className="demo-feature">
              <ShareAltOutlined className="feature-icon" />
              <span>Export capabilities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content - The actual app */}
      <div className="demo-content">
        <App />
      </div>

      {/* Demo Footer */}
      <div className="demo-footer">
        <div className="demo-footer-container">
          <div className="demo-footer-content">
            <h3 className="demo-footer-title">Ready to get started?</h3>
            <p className="demo-footer-subtitle">
              Subscribe now to unlock unlimited access to all features and themes.
            </p>
            <Button
              type="primary"
              size="large"
              className="demo-footer-cta"
              onClick={() => navigate('/subscribe')}
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
