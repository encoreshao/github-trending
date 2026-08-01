import React from 'react';
import { formatNumber } from '../utils/formatNumber';

const RepoCard = ({ repo, texts }) => {
  // repo.name is never fetched (only the combined full_name field is a
  // selectable attribute) — using it directly left the name blank/"undefined".
  const displayName = repo.full_name || repo['owner.login'] || '';

  return (
    <a className="card" href={repo.html_url} target="_blank" rel="noopener noreferrer">
      <img className="avatar" src={repo['owner.avatar_url']} alt={repo['owner.login']} loading="lazy" />
      <p className="repo-name">{displayName}</p>
      <div className="description">{repo.description || texts.tableNoData}</div>
      <span className="repo-stars">⭐ {formatNumber(repo.stargazers_count)} {texts.stars}</span>
    </a>
  );
};

const RepoCardView = ({ repos, texts, pageSize = 20 }) => {
  return (
    <div>
      {repos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--c-text-muted))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z"/>
              <path d="M9 9h.01M15 9h.01M8 13a4 4 0 0 0 8 0"/>
            </svg>
          </div>
          <div style={{
            color: 'rgb(var(--c-text-secondary))',
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            {texts.tableNoData}
          </div>
          <div style={{
            color: 'rgb(var(--c-text-muted))',
            fontSize: '14px',
            maxWidth: '300px',
            lineHeight: '1.6'
          }}>
            Enter your GitHub token and click Fetch to discover trending repositories
          </div>
        </div>
      ) : (
        <div className="grid">
          {repos.slice(0, pageSize).map((repo, idx) => (
            <RepoCard key={repo.id || idx} repo={repo} texts={texts} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RepoCardView;
