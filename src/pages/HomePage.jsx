import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadLatestCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrendingCard from '../components/TrendingCard';
import './HomePage.css';

const GITHUB_REPO = 'encoreshao/github-trending';

const HomePage = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    languages: 0
  });

  useEffect(() => {
    loadTrendingRepos();
  }, []);

  const loadTrendingRepos = async () => {
    try {
      setLoading(true);
      // Load from CSV files
      const csvData = await loadLatestCSV();
      const transformedData = transformCSVData(csvData);

      // Take first 12 repos for homepage
      const displayRepos = transformedData.slice(0, 12);
      setRepos(displayRepos);

      // Calculate stats
      const totalStars = displayRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      const uniqueLanguages = new Set(displayRepos.map(repo => repo.language).filter(Boolean));

      setStats({
        totalRepos: displayRepos.length,
        totalStars: totalStars,
        languages: uniqueLanguages.size
      });
    } catch (error) {
      console.error('Error loading trending repos:', error);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-new">
      <div className="grain-overlay"></div>

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Amazing
              <span className="gradient-text">&nbsp;Trending Repositories</span>
            </h1>
            <p className="hero-description">
              Curating the best trending GitHub repositories, hidden gems, and innovative tools that are shaping the future of development.
            </p>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{stats.totalRepos}+</span>
                <span className="stat-label">Trending Repos</span>
              </div>
              <div className="stat">
                <span className="stat-number">{formatNumber(stats.totalStars)}</span>
                <span className="stat-label">Total Stars</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Open Source</span>
              </div>
            </div>

            <div className="newsletter-container">
              <div className="newsletter-form">
                <h4>Join our weekly newsletter</h4>
                <p>Subscribe to our newsletter to get the latest updates on trending repositories.</p>
                <form className="form" onSubmit={(e) => { e.preventDefault(); navigate('/subscribe'); }}>
                  <input
                    placeholder="Your email address"
                    className="input"
                    required
                    type="email"
                  />
                  <button type="submit" className="button">Subscribe</button>
                </form>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="code-window">
              <div className="window-header">
                <div className="window-controls">
                  <span className="control close"></span>
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                </div>
                <span className="window-title">trending-repos.json</span>
              </div>
              <div className="code-content">
                <pre><code>{`{
  "trending": [
    {
      "repo": "deta/surf",
      "stars": 1725,
      "language": "TypeScript",
      "desc": "Personal AI Notebooks. Organize files & webpages...",
      "url": "https://github.com/deta/surf"
    },
    {
      "repo": "anthropic-experimental/sandbox-runtime",
      "stars": 1076,
      "language": "TypeScript",
      "desc": "A lightweight sandboxing tool for enforcing restrictions",
      "url": "https://github.com/anthropic-experimental/sandbox-runtime"
    },
    {
      "repo": "vercel/workflow",
      "stars": 595,
      "language": "TypeScript",
      "desc": "Workflow DevKit: Build durable, resilient workflows",
      "url": "https://github.com/vercel/workflow"
    }
  ],
  "total": ${repos.length},
  "updated": "${new Date().toISOString().split('T')[0]}",
  "source": "https://github.com/${GITHUB_REPO}"
}`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="projects-section">
          <div className="section-header">
            <h2 className="section-title">Trending Repositories</h2>
            <p className="section-description">
              Hand-picked trending GitHub repositories that are making waves in the developer community
            </p>
          </div>

          <div className="filters-container">
            <div className="filters-wrapper">
              <div className="search-wrapper">
                <button
                  type="button"
                  className="search-btn"
                  onClick={() => navigate('/demo')}
                >
                  <i className="fas fa-search"></i>
                  Explore More
                </button>
              </div>
              <div className="sort-wrapper">
                <label className="sort-label">
                  <i className="fas fa-fire sort-icon"></i>
                  Sorted by: Trending
                </label>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading trending repositories...</p>
            </div>
          ) : (
            <div className="projects-grid">
              {repos.map((repo, index) => (
                <TrendingCard key={repo.id} repo={repo} index={index} />
              ))}
            </div>
          )}

          <div className="view-more-container">
            <button
              className="view-more-btn"
              onClick={() => navigate('/demo')}
            >
              View All Trending Repositories
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
