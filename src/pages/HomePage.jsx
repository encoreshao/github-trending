import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarOutlined, ForkOutlined, EyeOutlined } from '@ant-design/icons';
import { loadLatestCSV, transformCSVData } from '../utils/csvLoader';
import Header from '../components/Header';
import Footer from '../components/Footer';
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

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
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
                <article
                  key={repo.id}
                  className="project-card"
                  style={{ animationDelay: `${(index % 6) * 0.1}s` }}
                >
                  <div className="card-image">
                    <img
                      alt={repo.description || repo.name}
                      loading="lazy"
                      width="400"
                      height="200"
                      src={`https://opengraph.githubassets.com/${repo.id}/${repo.full_name}`}
                      onError={(e) => {
                        e.target.src = `https://github.com/${repo.owner.login}.png?size=400`;
                      }}
                    />
                    <div className="card-image-overlay">
                      <div className="project-tags">
                        <span className="project-tag github-tag">
                          <i className="fab fa-github"></i>
                          <span>GitHub</span>
                        </span>
                        {repo.language && (
                          <span className="project-tag language-tag">
                            <i className="fas fa-code"></i>
                            <span>{repo.language}</span>
                          </span>
                        )}
                      </div>
                      <div className="bookmark-container">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bookmark-btn"
                          title="View on GitHub"
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="card-header">
                    <div className="card-meta">
                      <span className="card-category">Open Source</span>
                      <time className="card-date">
                        {new Date(repo.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.name}
                      </a>
                    </h3>
                    <p className="card-excerpt">
                      {repo.description || 'No description available'}
                    </p>
                    <div className="repo-info">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-link"
                      >
                        <i className="fab fa-github"></i>
                        <span>{repo.full_name}</span>
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                    <div className="repo-stats">
                      <span className="repo-stat">
                        <StarOutlined />
                        {formatNumber(repo.stargazers_count)}
                      </span>
                      {repo.forks_count > 0 && (
                        <span className="repo-stat">
                          <ForkOutlined />
                          {formatNumber(repo.forks_count)}
                        </span>
                      )}
                      {repo.watchers_count > 0 && (
                        <span className="repo-stat">
                          <EyeOutlined />
                          {formatNumber(repo.watchers_count)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    <a
                      className="read-more"
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>View Repository</span>
                      <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </article>
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
