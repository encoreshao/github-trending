import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import { loadLatestCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrendingCard from '../components/TrendingCard';
import PeriodOverviewSection from '../components/PeriodOverviewSection';
import RanbotPromoSection from '../components/RanbotPromoSection';
import SectionDivider from '../components/SectionDivider';
import './HomePage.css';

const GITHUB_REPO = 'encoreshao/github-trending';

const LANGUAGE_ICONS = {
  JavaScript: '⚡', TypeScript: '🔷', Python: '🐍', Java: '☕', Go: '🐹', Rust: '🦀',
  Vue: '💚', 'C++': '⚙️', C: '⚙️', 'C#': '🔵', Ruby: '💎', PHP: '🐘', Swift: '🕊️',
  Kotlin: '🎯', Shell: '🐚', HTML: '🌐', CSS: '🎨', Dart: '🎯', Scala: '🔴',
};
const getLanguageIcon = (lang) => LANGUAGE_ICONS[lang] || '💻';
const ACTIVITY_ICONS = ['🔥', '🚀', '⭐'];

const HomePage = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRepos: 0 });
  const [githubStars, setGithubStars] = useState(null);

  useEffect(() => {
    loadTrendingRepos();
    loadGithubStars();
  }, []);

  const loadGithubStars = async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`);
      if (!response.ok) return;
      const data = await response.json();
      setGithubStars(data.stargazers_count);
    } catch (error) {
      console.error('Error loading GitHub star count:', error);
    }
  };

  const loadTrendingRepos = async () => {
    try {
      setLoading(true);
      // Load from CSV files
      const { data: csvData } = await loadLatestCSV();
      const transformedData = transformCSVData(csvData);

      // Take first 12 repos for homepage
      const displayRepos = transformedData.slice(0, 12);
      setRepos(displayRepos);
      setStats({ totalRepos: displayRepos.length });
    } catch (error) {
      console.error('Error loading trending repos:', error);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const languageBreakdown = (() => {
    const counts = {};
    repos.forEach((repo) => {
      if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name]) => ({ name, icon: getLanguageIcon(name) }));
  })();
  const orbitLanguages = languageBreakdown.slice(0, 6);

  return (
    <div className="homepage-new">
      <div className="grain-overlay"></div>

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <main className="main">
        <section className="hero">
          {orbitLanguages.length > 0 && (
            <div className="hero-bubbles" aria-hidden="true">
              {orbitLanguages.map((lang, index) => (
                <span
                  key={lang.name}
                  className={`hero-bubble hero-bubble-${index}`}
                  style={{ animationDelay: `${index * 0.4}s` }}
                  title={lang.name}
                >
                  {lang.icon}
                </span>
              ))}
            </div>
          )}

          <div className="hero-content-centered">
            <div className="hero-badges">
              {githubStars !== null && (
                <span className="hero-badge-pill">
                  <StarFilled className="hero-badge-icon" />
                  {formatNumber(githubStars)} GitHub stars
                </span>
              )}
              {!loading && (
                <span className="hero-badge-pill">{stats.totalRepos}+ repos tracked daily</span>
              )}
            </div>

            <h1 className="hero-title">
              Discover Amazing
              <span className="gradient-text">&nbsp;Trending Repositories</span>
            </h1>
            <p className="hero-description">
              Curating the best trending GitHub repositories, hidden gems, and innovative tools that are shaping the future of development.
            </p>

            <div className="hero-cta-row">
              <button type="button" className="cta-primary" onClick={() => navigate('/demo')}>
                Explore Trending Repos
              </button>
              <button type="button" className="cta-secondary" onClick={() => navigate('/subscribe')}>
                Get Weekly Updates
              </button>
            </div>

            {!loading && repos.length >= 3 && (
              <div className="activity-card">
                {repos.slice(0, 3).map((repo, index) => (
                  <a
                    key={repo.id}
                    className="activity-row"
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="activity-icon">{ACTIVITY_ICONS[index]}</span>
                    <div className="activity-text">
                      <span className="activity-repo">{repo.full_name}</span>
                      <span className="activity-meta">
                        {formatNumber(repo.stargazers_count)} stars{index === 0 ? ' · trending now' : ''}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {languageBreakdown.length > 0 && (
          <section className="languages-strip">
            <span className="languages-strip-label">Languages we're tracking</span>
            <div className="languages-strip-row">
              {languageBreakdown.map((lang) => (
                <span key={lang.name} className="language-badge">
                  <span className="language-badge-icon">{lang.icon}</span> {lang.name}
                </span>
              ))}
            </div>
          </section>
        )}

        <SectionDivider from="rgb(var(--c-border) / 0.5)" to="rgb(var(--c-accent) / 0.5)" />

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

        <SectionDivider from="rgb(139 92 246 / 0.5)" to="rgb(20 184 166 / 0.5)" spaced />

        <RanbotPromoSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
