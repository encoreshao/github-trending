import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>GitHub Trending</h3>
          <p>Discovering and showcasing the best trending GitHub repositories and hidden gems in the developer community.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <a className="footer-link" onClick={() => navigate('/')}>Home</a>
            <a className="footer-link" onClick={() => navigate('/demo')}>Live Demo</a>
            <a className="footer-link" onClick={() => navigate('/subscribe')}>Subscribe</a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a
              href="https://github.com/encoreshao/github-trending"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="GitHub"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="https://twitter.com/RanbotAI"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://linkedin.com/companies/ranbot-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="LinkedIn"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 RanBOT Labs. All rights reserved. Built with <i className="fas fa-heart"></i> for the developer community.</p>
      </div>
    </footer>
  );
};

export default Footer;

