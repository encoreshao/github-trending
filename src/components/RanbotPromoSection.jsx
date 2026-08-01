import React from 'react';
import './RanbotPromoSection.css';

const RANBOT_PRODUCTS = [
  { name: 'Skills', url: 'https://skills.ranbot.online/', icon: '🧠', blurb: 'Curated skill playbooks to level up how you work with AI' },
  { name: 'PPT', url: 'https://ppt.ranbot.online/', icon: '📊', blurb: 'Turn ideas into polished presentations in minutes' },
  { name: 'RSS', url: 'https://rss.ranbot.online/', icon: '📰', blurb: 'Follow the sources that matter, all in one feed' },
  { name: 'Video', url: 'https://video.ranbot.online/', icon: '🎬', blurb: 'AI-assisted video creation and editing' },
  { name: 'Data Graph', url: 'https://data-graph.ranbot.online/', icon: '🕸️', blurb: 'Visualize and explore connected data' },
];

const RanbotPromoSection = () => (
  <section className="ranbot-promo">
    <div className="section-header">
      <h2 className="section-title">Part of the RanBOT family</h2>
      <p className="section-description">
        GitHub Trending is one tool in a growing toolbox built by RanBOT for developers.
      </p>
    </div>
    <div className="ranbot-promo-grid">
      {RANBOT_PRODUCTS.map((product) => (
        <a
          key={product.name}
          className="ranbot-promo-card"
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="ranbot-promo-icon">{product.icon}</span>
          <span className="ranbot-promo-name">{product.name}</span>
          <p className="ranbot-promo-blurb">{product.blurb}</p>
        </a>
      ))}
    </div>
  </section>
);

export default RanbotPromoSection;
