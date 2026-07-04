import React, { useState, useEffect, useRef } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { loadLatestCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import Header from './Header';
import Footer from './Footer';
import TrendingCard from './TrendingCard';
import './TrendingPeriodPage.css';

const TrendingPeriodPage = ({ title, windowDescription, csvSubdir, maxDaysBack }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const scrollRowRef = useRef(null);

  const scrollByCards = (direction) => {
    const row = scrollRowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * Math.round(row.clientWidth * 0.8), behavior: 'smooth' });
  };

  useEffect(() => {
    loadRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvSubdir, maxDaysBack]);

  const loadRepos = async () => {
    try {
      setLoading(true);
      const { data: csvData, date } = await loadLatestCSV(csvSubdir, maxDaysBack);
      const transformedData = transformCSVData(csvData);
      setRepos(transformedData.slice(0, 20));
      setLastUpdated(date);
    } catch (error) {
      console.error(`Error loading ${csvSubdir} trending repos:`, error);
      setRepos([]);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const languageCount = new Set(repos.map(repo => repo.language).filter(Boolean)).size;

  return (
    <div className="trending-period-page">
      <Header />
      <main className="period-main">
        <section className="period-hero">
          <div className="period-badge">
            {lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : 'No data yet'}
          </div>
          <h1 className="period-title">{title}</h1>
          <p className="period-description">{windowDescription}</p>
          {!loading && repos.length > 0 && (
            <div className="period-stats">
              <div className="period-stat">
                <span className="period-stat-number">{repos.length}</span>
                <span className="period-stat-label">Repos</span>
              </div>
              <div className="period-stat">
                <span className="period-stat-number">{formatNumber(totalStars)}</span>
                <span className="period-stat-label">Total Stars</span>
              </div>
              <div className="period-stat">
                <span className="period-stat-number">{languageCount}</span>
                <span className="period-stat-label">Languages</span>
              </div>
            </div>
          )}
        </section>

        <section className="period-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading trending repositories...</p>
            </div>
          ) : repos.length === 0 ? (
            <div className="period-empty">
              <p>No snapshot has been generated for this period yet. Check back soon.</p>
            </div>
          ) : (
            <div className="period-scroll-wrapper">
              <button
                type="button"
                className="period-scroll-arrow period-scroll-arrow-left"
                onClick={() => scrollByCards(-1)}
                aria-label="Scroll left"
              >
                <LeftOutlined />
              </button>
              <div className="period-scroll-row" ref={scrollRowRef}>
                {repos.map((repo, index) => (
                  <TrendingCard key={repo.id} repo={repo} index={index} rank={index + 1} />
                ))}
              </div>
              <button
                type="button"
                className="period-scroll-arrow period-scroll-arrow-right"
                onClick={() => scrollByCards(1)}
                aria-label="Scroll right"
              >
                <RightOutlined />
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrendingPeriodPage;
