import React, { useState, useRef } from 'react';
import { Button, Space, message, Avatar, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';

const RepoCard = ({ repo, lang, texts }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="card">
      <div className="card-header">
        <Avatar src={repo['owner.avatar_url']} alt={repo['owner.login']} className="avatar" />
        <div className="repo-info">
          <p className="repo-name">{repo.name}</p>
          <span className="repo-owner">{repo['owner.login']}</span>
          <span className="repo-stars">⭐ {repo.stargazers_count} {texts.stars}</span>
        </div>
      </div>
      <div className="description">
        {repo.description}
      </div>
      {repo.topics && repo.topics.length > 0 && (
        <div className="topics">
          {repo.topics.slice(0, 5).map(topic => (
            <span key={topic} className="topic">{topic}</span>
          ))}
        </div>
      )}
      <a href={repo.html_url} className="link" target="_blank" rel="noopener noreferrer">
        {texts.viewOnGitHub}
      </a>
      <div className="dates">
        <span>{texts.created}: {formatDate(repo.created_at)}</span>
        <span>{texts.lastUpdated}: {formatDate(repo.updated_at)}</span>
      </div>
    </div>
  );
};

const RepoCardView = ({ repos, attributes, lang, texts, pageSize = 20 }) => {
  const viewRef = useRef(null);

  const handleExportCSV = () => {
    try {
      const data = repos;
      const csv = unparse(data, { columns: attributes });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'github-trending.csv');
    } catch (e) {
      message.error(texts.exportError);
    }
  };

  const handleExportJSON = () => {
    const data = repos;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'github-trending.json');
  };

  const handleCopy = () => {
    message.success(texts.copied);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: '0 0 auto', padding: '16px 24px', borderBottom: '1px solid #eee' }}>
        <Space>
          <Button
            onClick={handleExportCSV}
            disabled={!repos.length}
            style={{ padding: 8 }}
          >
            {texts.exportCSV}
          </Button>
          <Button
            onClick={handleExportJSON}
            disabled={!repos.length}
            style={{ padding: 8 }}
          >
            {texts.exportJSON}
          </Button>
          <CopyToClipboard
            text={JSON.stringify(repos, null, 2)}
            onCopy={handleCopy}
          >
            <Button
              disabled={!repos.length}
              style={{ padding: 8 }}
            >
              {texts.copy}
            </Button>
          </CopyToClipboard>
        </Space>
      </div>

      <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '24px' }} ref={viewRef}>
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
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z"/>
                <path d="M9 9h.01M15 9h.01M8 13a4 4 0 0 0 8 0"/>
              </svg>
            </div>
            <div style={{ 
              color: '#94A3B8', 
              fontSize: '18px', 
              fontWeight: '600',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              {texts.tableNoData}
            </div>
            <div style={{ 
              color: '#64748B', 
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
              <RepoCard key={repo.id || idx} repo={repo} lang={lang} texts={texts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoCardView;