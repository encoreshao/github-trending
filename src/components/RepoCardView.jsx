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
          <span className="repo-stars">⭐ {repo.stargazers_count} stars</span>
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
        View on GitHub →
      </a>
      <div className="dates">
        <span>Created: {formatDate(repo.created_at)}</span>
        <span>Last Updated: {formatDate(repo.updated_at)}</span>
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
          <Button onClick={handleExportCSV} disabled={!repos.length}>{texts.exportCSV}</Button>
          <Button onClick={handleExportJSON} disabled={!repos.length}>{texts.exportJSON}</Button>
          <CopyToClipboard
            text={JSON.stringify(repos, null, 2)}
            onCopy={handleCopy}
          >
            <Button disabled={!repos.length}>{texts.copy}</Button>
          </CopyToClipboard>
        </Space>
      </div>

      <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '24px' }} ref={viewRef}>
        {repos.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>{texts.tableNoData}</div>
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