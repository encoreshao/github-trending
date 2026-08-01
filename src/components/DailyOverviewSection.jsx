import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadLatestCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import './DailyOverviewSection.css';

const DailyOverviewSection = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const { data } = await loadLatestCSV('', 30);
      if (!isMounted) return;
      setRepos(transformCSVData(data).slice(0, 6));
      setLoading(false);
    };

    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="daily-overview">
      <div className="daily-overview-header">
        <h2 className="daily-overview-title">Daily Trending</h2>
        <p className="daily-overview-description">What's hot on GitHub right now, refreshed daily.</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading today's trending repos...</p>
        </div>
      ) : repos.length === 0 ? (
        <p className="daily-overview-empty">No daily snapshot yet — check back soon.</p>
      ) : (
        <div className="daily-overview-row">
          {repos.map((repo) => (
            <a
              key={repo.id}
              className="daily-overview-chip"
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="daily-overview-avatar"
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                loading="lazy"
              />
              <div className="daily-overview-chip-text">
                <span className="daily-overview-chip-name">{repo.full_name}</span>
                <span className="daily-overview-chip-stars">⭐ {formatNumber(repo.stargazers_count)}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="daily-overview-cta-row">
        <Link to="/" className="daily-overview-cta">
          See today's full trending list →
        </Link>
      </div>
    </section>
  );
};

export default DailyOverviewSection;
