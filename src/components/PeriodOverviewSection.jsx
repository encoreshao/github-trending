import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadLatestCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import './PeriodOverviewSection.css';

const formatSnapshotDate = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.length === 7) {
    return new Date(`${dateStr}-01`).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

const PeriodOverviewSection = ({ title, badgeLabel, subdir, maxDaysBack, path, variant }) => {
  const [repos, setRepos] = useState([]);
  const [snapshotDate, setSnapshotDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const { data, date } = await loadLatestCSV(subdir, maxDaysBack);
      if (!isMounted) return;
      setRepos(transformCSVData(data).slice(0, 20));
      setSnapshotDate(date);
      setLoading(false);
    };

    load();
    return () => { isMounted = false; };
  }, [subdir, maxDaysBack]);

  const topPick = repos[0];
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const topLanguage = (() => {
    const counts = {};
    repos.forEach((repo) => {
      if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : '—';
  })();
  const periodWord = subdir === 'weekly' ? 'week' : 'month';

  return (
    <section className={`period-overview period-overview--${variant}`}>
      <div className="period-overview-header">
        <h2 className="period-overview-title">{title}</h2>
        {snapshotDate && (
          <span className="period-overview-badge">{badgeLabel} · {formatSnapshotDate(snapshotDate)}</span>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading {title.toLowerCase()}...</p>
        </div>
      ) : !topPick ? (
        <p className="period-overview-empty">No {title.toLowerCase()} snapshot yet — check back soon.</p>
      ) : (
        <div className={`period-overview-body${variant === 'monthly' ? ' period-overview-body--reverse' : ''}`}>
          <a
            className="period-overview-spotlight"
            href={topPick.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="period-overview-avatar"
              src={topPick.owner.avatar_url}
              alt={topPick.owner.login}
              loading="lazy"
            />
            <div className="period-overview-spotlight-text">
              <span className="period-overview-spotlight-label">🥇 #1 this {periodWord}</span>
              <span className="period-overview-spotlight-name">{topPick.full_name}</span>
              <p className="period-overview-spotlight-desc">{topPick.description || 'No description available'}</p>
              <span className="period-overview-spotlight-stars">⭐ {formatNumber(topPick.stargazers_count)} stars</span>
            </div>
          </a>

          <div className="period-overview-stats">
            <div className="period-overview-stat">
              <span className="period-overview-stat-number">{repos.length}</span>
              <span className="period-overview-stat-label">Repos</span>
            </div>
            <div className="period-overview-stat">
              <span className="period-overview-stat-number">{formatNumber(totalStars)}</span>
              <span className="period-overview-stat-label">Total Stars</span>
            </div>
            <div className="period-overview-stat">
              <span className="period-overview-stat-number">{topLanguage}</span>
              <span className="period-overview-stat-label">Top Language</span>
            </div>
          </div>
        </div>
      )}

      <div className="period-overview-cta-row">
        <Link to={path} className="period-overview-cta">
          View full {title} rankings →
        </Link>
      </div>
    </section>
  );
};

export default PeriodOverviewSection;
