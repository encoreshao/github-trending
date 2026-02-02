import React from 'react';
import { SyncOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import App from '../App';
import './DemoPage.css';
import './DemoPageGlobal.css';

const DemoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="demo-page">
      {/* Navigation */}
      <Header />

      {/* Demo Header */}
      <div className="demo-header">
        <div className="demo-header-container">
          {/* Live badge */}
          <div className="demo-badge">
            <span className="demo-badge-dot"></span>
            <span>Live Demo</span>
          </div>
          
          <h1 className="demo-title">Explore GitHub Trending</h1>
          <p className="demo-subtitle">
            Discover trending repositories in real-time. Filter by language, time period, 
            and export your curated list with a single click.
          </p>
          
          <div className="demo-features">
            <div className="demo-feature">
              <div className="feature-icon">
                <SyncOutlined />
              </div>
              <span>Real-time Data</span>
            </div>
            <div className="demo-feature">
              <div className="feature-icon">
                <FilterOutlined />
              </div>
              <span>Smart Filtering</span>
            </div>
            <div className="demo-feature">
              <div className="feature-icon">
                <ExportOutlined />
              </div>
              <span>Export & Share</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content - The actual app */}
      <div className="demo-content">
        <App />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DemoPage;
