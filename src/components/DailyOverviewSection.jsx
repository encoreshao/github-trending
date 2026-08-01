import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { loadLatestCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import './DailyOverviewSection.css';

const AUTO_ROTATE_MS = 4000;
const MAX_VISIBLE_OFFSET = 3;
const ARC_ANGLE_STEP = 16;
const ARC_DIP = 90;
const CARD_SPACING = 140;

const DailyOverviewSection = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const { data } = await loadLatestCSV('', 30);
      if (!isMounted) return;
      setRepos(transformCSVData(data).slice(0, 7));
      setLoading(false);
    };

    load();
    return () => { isMounted = false; };
  }, []);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (repos.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % repos.length);
    }, AUTO_ROTATE_MS);
  }, [repos.length]);

  useEffect(() => {
    restartTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restartTimer]);

  const getRelativeOffset = (index) => {
    const n = repos.length;
    let diff = index - activeIndex;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    return diff;
  };

  const focusCard = (index) => {
    setActiveIndex(index);
    restartTimer();
  };

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
        <>
          <div className="daily-fan">
            {repos.map((repo, index) => {
              const offset = getRelativeOffset(index);
              if (Math.abs(offset) > MAX_VISIBLE_OFFSET) return null;
              const isActive = offset === 0;
              const scale = isActive ? 1.25 : 1 - Math.abs(offset) * 0.16;
              const angleDeg = offset * ARC_ANGLE_STEP;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = offset * CARD_SPACING;
              const y = ARC_DIP * (1 - Math.cos(angleRad));
              const cardStyle = {
                transform: `translate(${x}px, ${y}px) rotate(${angleDeg}deg) scale(${scale})`,
                zIndex: 10 - Math.abs(offset),
                opacity: 1 - Math.abs(offset) * 0.15
              };

              return (
                <div
                  key={repo.id}
                  className={`daily-fan-card${isActive ? ' daily-fan-card--active' : ''}`}
                  style={cardStyle}
                  onClick={() => !isActive && focusCard(index)}
                >
                  {isActive ? (
                    <a
                      className="daily-fan-card-link"
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        className="daily-fan-avatar"
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        loading="lazy"
                      />
                      <span className="daily-fan-name">{repo.full_name}</span>
                      <span className="daily-fan-desc">{repo.description || 'No description available'}</span>
                      <span className="daily-fan-stars">⭐ {formatNumber(repo.stargazers_count)} stars</span>
                    </a>
                  ) : (
                    <img
                      className="daily-fan-avatar"
                      src={repo.owner.avatar_url}
                      alt={repo.owner.login}
                      loading="lazy"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="daily-fan-dots">
            {repos.map((repo, index) => (
              <button
                key={repo.id}
                type="button"
                className={`daily-fan-dot${index === activeIndex ? ' daily-fan-dot--active' : ''}`}
                aria-label={`Show ${repo.full_name}`}
                onClick={() => focusCard(index)}
              />
            ))}
          </div>
        </>
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
