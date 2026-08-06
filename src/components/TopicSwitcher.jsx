import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { TOPICS } from '../data/topics';
import './TopicSwitcher.css';

const SCROLL_STEP = 280;

const TopicSwitcher = ({ activeTopicId }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const activePill = el.querySelector('.topic-switcher-pill.active');
    if (activePill) {
      activePill.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopicId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onResize = () => updateScrollState();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollBy = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="topic-switcher-bar">
      <div className="topic-switcher">
        <span className="topic-switcher-label">Switch topic</span>

        <div className="topic-switcher-viewport">
          <button
            type="button"
            className={`topic-switcher-arrow topic-switcher-arrow-left ${canScrollLeft ? '' : 'is-hidden'}`}
            onClick={() => scrollBy(-SCROLL_STEP)}
            aria-label="Scroll topics left"
          >
            <LeftOutlined />
          </button>

          <div
            className="topic-switcher-scroll"
            ref={scrollRef}
            onScroll={updateScrollState}
          >
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={`topic-switcher-pill ${topic.id === activeTopicId ? 'active' : ''}`}
                onClick={() => navigate(`/topics/${topic.id}`)}
              >
                <span className="topic-switcher-icon">{topic.icon}</span>
                {topic.name}
              </button>
            ))}
          </div>

          <div className={`topic-switcher-fade topic-switcher-fade-left ${canScrollLeft ? '' : 'is-hidden'}`} />
          <div className={`topic-switcher-fade topic-switcher-fade-right ${canScrollRight ? '' : 'is-hidden'}`} />

          <button
            type="button"
            className={`topic-switcher-arrow topic-switcher-arrow-right ${canScrollRight ? '' : 'is-hidden'}`}
            onClick={() => scrollBy(SCROLL_STEP)}
            aria-label="Scroll topics right"
          >
            <RightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSwitcher;
