import React from 'react';
import { StarOutlined, ForkOutlined, EyeOutlined } from '@ant-design/icons';
import { formatNumber } from '../utils/formatNumber';
import './SpotlightBanner.css';

const SpotlightBanner = ({ repo }) => {
  if (!repo) return null;

  return (
    <a
      className="spotlight-banner"
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="spotlight-bg"
        alt={repo.description || repo.name}
        loading="lazy"
        src={`https://opengraph.githubassets.com/${repo.id}/${repo.full_name}`}
        onError={(e) => {
          e.target.src = `https://github.com/${repo.owner.login}.png?size=400`;
        }}
      />
      <div className="spotlight-veil"></div>
      <div className="spotlight-medal">🥇 #1</div>
      <div className="spotlight-content">
        <h2 className="spotlight-title">{repo.name}</h2>
        <p className="spotlight-owner">{repo.full_name}</p>
        <p className="spotlight-excerpt">{repo.description || 'No description available'}</p>
        <div className="spotlight-stats">
          <span className="spotlight-stat">
            <StarOutlined />
            {formatNumber(repo.stargazers_count)}
          </span>
          {repo.forks_count > 0 && (
            <span className="spotlight-stat">
              <ForkOutlined />
              {formatNumber(repo.forks_count)}
            </span>
          )}
          {repo.watchers_count > 0 && (
            <span className="spotlight-stat">
              <EyeOutlined />
              {formatNumber(repo.watchers_count)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default SpotlightBanner;
