import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GithubOutlined, StarOutlined } from '@ant-design/icons';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <a className="brand-link" onClick={() => navigate('/')}>
            <GithubOutlined className="brand-icon" />
            <span className="brand-text">GitHub Trending</span>
          </a>
        </div>
        <div className="nav-links">
          <a
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a
            className={`nav-link ${isActive('/demo') ? 'active' : ''}`}
            onClick={() => navigate('/demo')}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Live Demo</span>
          </a>
          <a
            className={`nav-link ${isActive('/subscribe') ? 'active' : ''}`}
            onClick={() => navigate('/subscribe')}
          >
            <i className="fas fa-envelope"></i>
            <span>Subscribe</span>
          </a>
          <a
            className="github-star-btn"
            href="https://github.com/encoreshao/github-trending"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StarOutlined className="star-icon" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;

