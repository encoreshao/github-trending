import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TagsOutlined, SyncOutlined, StarOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PeriodOverviewSection from '../components/PeriodOverviewSection';
import DailyOverviewSection from '../components/DailyOverviewSection';
import SectionDivider from '../components/SectionDivider';
import { TOPICS, getTopicSlug } from '../data/topics';
import './TopicsIndexPage.css';

const TopicsIndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="topics-index-page">
      <Header />

      <div className="topics-hero">
        <div className="topics-hero-container">
          <div className="topics-hero-badge">
            <span className="topics-hero-badge-dot"></span>
            <span>{TOPICS.length} Curated Topics</span>
          </div>

          <h1 className="topics-hero-title">Browse by Topic</h1>
          <p className="topics-hero-subtitle">
            Trending repositories, grouped by the subjects developers care about most — refreshed daily.
          </p>

          <div className="topics-hero-features">
            <div className="topics-hero-feature">
              <div className="topics-feature-icon">
                <TagsOutlined />
              </div>
              <span>{TOPICS.length} Topics Tracked</span>
            </div>
            <div className="topics-hero-feature">
              <div className="topics-feature-icon">
                <SyncOutlined />
              </div>
              <span>Refreshed Daily</span>
            </div>
            <div className="topics-hero-feature">
              <div className="topics-feature-icon">
                <StarOutlined />
              </div>
              <span>Ranked by Stars</span>
            </div>
          </div>
        </div>
      </div>

      <main className="topics-index-main">
        <div className="topics-index-grid">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className="topic-index-card btn-surface"
              onClick={() => navigate(`/topics/${getTopicSlug(topic)}`)}
            >
              <span className="topic-index-icon">{topic.icon}</span>
              <span className="topic-index-name">{topic.name}</span>
              <span className="topic-index-description">{topic.description}</span>
            </button>
          ))}
        </div>
      </main>

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

      <Footer />
    </div>
  );
};

export default TopicsIndexPage;
