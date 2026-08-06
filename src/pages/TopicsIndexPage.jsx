import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { TOPICS } from '../data/topics';
import './TopicsIndexPage.css';

const TopicsIndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="topics-index-page">
      <Header />
      <main className="topics-index-main">
        <div className="topics-index-header">
          <h1 className="topics-index-title">Browse by Topic</h1>
          <p className="topics-index-subtitle">
            Trending repositories, grouped by the subjects developers care about most — refreshed daily.
          </p>
        </div>
        <div className="topics-index-grid">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className="topic-index-card btn-surface"
              onClick={() => navigate(`/topics/${topic.id}`)}
            >
              <span className="topic-index-icon">{topic.icon}</span>
              <span className="topic-index-name">{topic.name}</span>
              <span className="topic-index-description">{topic.description}</span>
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TopicsIndexPage;
