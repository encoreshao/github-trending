import React from 'react';
import { StarOutlined, ForkOutlined, EyeOutlined } from '@ant-design/icons';
import { formatNumber } from '../utils/formatNumber';
import './TrendingCard.css';

const TrendingCard = ({ repo, index = 0, rank }) => {
  return (
    <article
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
        {rank && <div className="rank-badge">#{rank}</div>}
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
  );
};

export default TrendingCard;
