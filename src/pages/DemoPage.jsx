import React from 'react';
import { SyncOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PeriodOverviewSection from '../components/PeriodOverviewSection';
import DailyOverviewSection from '../components/DailyOverviewSection';
import SectionDivider from '../components/SectionDivider';
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

      <SectionDivider from="rgb(var(--c-border) / 0.5)" to="rgb(var(--c-accent) / 0.5)" spaced />

      <DailyOverviewSection />

      <SectionDivider from="rgb(var(--c-accent) / 0.5)" to="rgb(245 158 11 / 0.5)" spaced />

      <PeriodOverviewSection
        title="Weekly Highlights"
        badgeLabel="This week"
        subdir="weekly"
        maxDaysBack={60}
        path="/weekly"
        variant="weekly"
      />

      <SectionDivider from="rgb(245 158 11 / 0.5)" to="rgb(139 92 246 / 0.5)" spaced />

      <PeriodOverviewSection
        title="Monthly Highlights"
        badgeLabel="This month"
        subdir="monthly"
        maxDaysBack={180}
        path="/monthly"
        variant="monthly"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DemoPage;
