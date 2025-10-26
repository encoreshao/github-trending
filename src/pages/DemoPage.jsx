import React from 'react';
import { SyncOutlined, FilterOutlined, ShareAltOutlined } from '@ant-design/icons';
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DemoPage;
