import React, { useState, useEffect, useRef } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { loadLatestCSV, loadPreviousCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import Header from './Header';
import Footer from './Footer';
import TrendingCard from './TrendingCard';
import SpotlightBanner from './SpotlightBanner';
import './TrendingPeriodPage.css';

const TrendingPeriodPage = ({ title, windowDescription, csvSubdir, maxDaysBack }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newEntriesCount, setNewEntriesCount] = useState(null);
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
      const currentRepos = transformedData.slice(0, 20);
      setRepos(currentRepos);
      setLastUpdated(date);

      if (date) {
        const { data: previousCsvData } = await loadPreviousCSV(csvSubdir, date, maxDaysBack);
        const previousRepos = transformCSVData(previousCsvData).slice(0, 20);
        if (previousRepos.length > 0) {
          const previousNames = new Set(previousRepos.map(repo => repo.full_name));
          setNewEntriesCount(currentRepos.filter(repo => !previousNames.has(repo.full_name)).length);
        } else {
          setNewEntriesCount(null);
        }
      } else {
        setNewEntriesCount(null);
      }
    } catch (error) {
      console.error(`Error loading ${csvSubdir} trending repos:`, error);
      setRepos([]);
      setLastUpdated(null);
      setNewEntriesCount(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
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
      year: 'numeric'
    });
  };

  const getISOWeekInfo = (dateStr) => {
    const date = new Date(dateStr);
    const target = new Date(date.valueOf());
    const dayNr = (date.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNr + 3);
    const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
    const firstThursdayDayNr = (firstThursday.getUTCDay() + 6) % 7;
    firstThursday.setUTCDate(firstThursday.getUTCDate() - firstThursdayDayNr + 3);
    const week = 1 + Math.round((target - firstThursday) / (7 * 24 * 3600 * 1000));
    const month = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
    return { week, year: target.getUTCFullYear(), month };
  };

  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const languageCount = new Set(repos.map(repo => repo.language).filter(Boolean)).size;

  const languageBreakdown = (() => {
    const counts = {};
    repos.forEach(repo => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 4).map(([language, count]) => ({ language, count }));
    const otherCount = sorted.slice(4).reduce((sum, [, count]) => sum + count, 0);
    const entries = otherCount > 0 ? [...top, { language: 'Other', count: otherCount }] : top;
    return entries.map(entry => ({
      ...entry,
      percent: repos.length > 0 ? Math.round((entry.count / repos.length) * 100) : 0
    }));
  })();

  return (
    <div className="trending-period-page">
      <Header />
      <main className="period-main">
        <section className="period-hero">
          <div className="period-hero-main">
            <div className="period-badges">
              <div className="period-badge">
                {lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : 'No data yet'}
              </div>
              {csvSubdir === 'weekly' && lastUpdated && (() => {
                const { week, year, month } = getISOWeekInfo(lastUpdated);
                return (
                  <div className="period-badge">
                    {`Week ${week}, ${year} · ${month}`}
                  </div>
                );
              })()}
            </div>
            <h1 className="period-title">{title}</h1>
            <p className="period-description">{windowDescription}</p>
          </div>

          {!loading && repos.length >= 3 && (
            <div className="top3-row">
              {repos.slice(0, 3).map((repo, index) => (
                <a
                  key={repo.id}
                  className={`top3-item top3-item-${['gold', 'silver', 'bronze'][index]}`}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="top3-medal">{['🥇', '🥈', '🥉'][index]}</span>
                  <span className="top3-name">{repo.name}</span>
                  <span className="top3-stars">⭐ {formatNumber(repo.stargazers_count)}</span>
                </a>
              ))}
            </div>
          )}
        </section>

        {!loading && repos.length > 0 && (
          <section className="period-insights">
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

            {languageBreakdown.length > 0 && (
              <div className="language-breakdown">
                <span className="insights-label">Language mix</span>
                <div className="language-chips">
                  {languageBreakdown.map(({ language, percent }) => (
                    <span key={language} className="language-chip">
                      {language} <b>{percent}%</b>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {newEntriesCount !== null && (
              <div className="comparison-badge">
                <span className="insights-label">Since last snapshot</span>
                <span className="comparison-value">
                  {newEntriesCount} new {newEntriesCount === 1 ? 'entry' : 'entries'}
                </span>
              </div>
            )}
          </section>
        )}

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
            <>
              <SpotlightBanner repo={repos[0]} />
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
                  {repos.slice(1).map((repo, index) => (
                    <TrendingCard key={repo.id} repo={repo} index={index} rank={index + 2} />
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
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrendingPeriodPage;
