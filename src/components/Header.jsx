import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GithubOutlined, StarOutlined } from '@ant-design/icons';
import ThemeToggle from './ThemeToggle';
import { TOPICS, getTopicSlug } from '../data/topics';
import './Header.css';

const TRENDING_PATHS = ['/weekly', '/monthly'];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Which nav dropdown is open: 'trending' | 'topics' | null. A single
  // value (rather than one boolean per dropdown) means opening one always
  // closes the other, and outside-click/route-change handling only has to
  // be written once.
  const [openMenu, setOpenMenu] = useState(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  const goTo = (path) => {
    navigate(path);
    setOpenMenu(null);
  };

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
          <div className="nav-dropdown">
            <a
              className={`nav-link ${TRENDING_PATHS.includes(location.pathname) ? 'active' : ''}`}
              onClick={() => setOpenMenu(m => (m === 'trending' ? null : 'trending'))}
            >
              <i className="fas fa-chart-line"></i>
              <span>Trending</span>
              <i className={`fas fa-chevron-down nav-dropdown-caret ${openMenu === 'trending' ? 'open' : ''}`}></i>
            </a>
            {openMenu === 'trending' && (
              <div className="nav-dropdown-menu">
                <a
                  className={`nav-dropdown-item ${isActive('/weekly') ? 'active' : ''}`}
                  onClick={() => goTo('/weekly')}
                >
                  <i className="fas fa-calendar-week"></i>
                  <span>Weekly</span>
                </a>
                <a
                  className={`nav-dropdown-item ${isActive('/monthly') ? 'active' : ''}`}
                  onClick={() => goTo('/monthly')}
                >
                  <i className="fas fa-calendar-alt"></i>
                  <span>Monthly</span>
                </a>
              </div>
            )}
          </div>
          <div className="nav-dropdown">
            <a
              className={`nav-link ${location.pathname.startsWith('/topics') ? 'active' : ''}`}
              onClick={() => setOpenMenu(m => (m === 'topics' ? null : 'topics'))}
            >
              <i className="fas fa-tags"></i>
              <span>Topics</span>
              <i className={`fas fa-chevron-down nav-dropdown-caret ${openMenu === 'topics' ? 'open' : ''}`}></i>
            </a>
            {openMenu === 'topics' && (
              <div className="nav-dropdown-menu nav-dropdown-menu-grid">
                {TOPICS.map(topic => (
                  <a
                    key={topic.id}
                    className={`nav-dropdown-item ${isActive(`/topics/${getTopicSlug(topic)}`) ? 'active' : ''}`}
                    onClick={() => goTo(`/topics/${getTopicSlug(topic)}`)}
                  >
                    <span className="nav-dropdown-item-icon">{topic.icon}</span>
                    <span>{topic.name}</span>
                  </a>
                ))}
                <a className="nav-dropdown-view-all" onClick={() => goTo('/topics')}>
                  View all topics <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            )}
          </div>
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
            <span className="star-label star-label-full">Star on GitHub</span>
            <span className="star-label star-label-short">Star</span>
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;

