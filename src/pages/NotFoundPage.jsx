import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <Header />
      <main className="notfound-main">
        <div className="notfound-window">
          <div className="notfound-window-header">
            <div className="notfound-window-controls">
              <span className="notfound-control notfound-control-close"></span>
              <span className="notfound-control notfound-control-minimize"></span>
              <span className="notfound-control notfound-control-maximize"></span>
            </div>
            <span className="notfound-window-title">github-api-response.json</span>
          </div>
          <div className="notfound-window-content">
            <pre><code>{`{
  "message": "Not Found",
  "documentation_url": "https://github.ranbot.online/",
  "status": "404"
}`}</code></pre>
          </div>
        </div>

        <div className="notfound-content">
          <div className="notfound-number">404</div>
          <p className="notfound-tagline">This repo doesn't exist... yet.</p>
          <button className="notfound-home-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
          <div className="notfound-links">
            <a onClick={() => navigate('/weekly')}>Weekly</a>
            <a onClick={() => navigate('/monthly')}>Monthly</a>
            <a onClick={() => navigate('/demo')}>Live Demo</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
