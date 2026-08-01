import React from 'react';
import './RanbotPromoSection.css';

const RANBOT_PRODUCTS = [
  {
    name: 'Skills',
    url: 'https://skills.ranbot.online/',
    icon: '🧠',
    category: 'Productivity',
    blurb: 'Curated skill playbooks to level up how you work with AI',
    features: ['Playbook templates', 'Team sharing', 'Version history'],
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  },
  {
    name: 'PPT',
    url: 'https://ppt.ranbot.online/',
    icon: '📊',
    category: 'Content',
    blurb: 'Turn ideas into polished presentations in minutes',
    features: ['AI outline generation', 'Theme library', 'One-click export'],
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)'
  },
  {
    name: 'RSS',
    url: 'https://rss.ranbot.online/',
    icon: '📰',
    category: 'Content',
    blurb: 'Follow the sources that matter, all in one feed',
    features: ['Smart folders', 'Read-later queue', 'Daily digest'],
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)'
  },
  {
    name: 'Video',
    url: 'https://video.ranbot.online/',
    icon: '🎬',
    category: 'Content',
    blurb: 'AI-assisted video creation and editing',
    features: ['Script-to-video', 'Auto captions', 'Voice cloning'],
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)'
  },
  {
    name: 'Data Graph',
    url: 'https://data-graph.ranbot.online/',
    icon: '🕸️',
    category: 'Data',
    blurb: 'Visualize and explore connected data',
    features: ['Graph queries', 'Live layouts', 'Export to CSV/JSON'],
    gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)'
  },
  {
    name: 'TikTok Scraper',
    url: 'https://github.com/ranbot-ai/tiktok-scraper',
    icon: '🎵',
    category: 'Scraping',
    blurb: 'Pull trending TikTok videos and creator data on demand',
    features: ['Video metadata extraction', 'Creator analytics', 'Bulk export'],
    gradient: 'linear-gradient(135deg, #25f4ee, #fe2c55)',
    cta: 'View on GitHub →'
  },
  {
    name: 'X Scraper',
    url: 'https://github.com/ranbot-ai/x-scraper',
    icon: '🐦',
    category: 'Scraping',
    blurb: 'Collect tweets, threads, and profile data from X',
    features: ['Tweet search & export', 'Profile scraping', 'Rate-limit handling'],
    gradient: 'linear-gradient(135deg, #1d9bf0, #000000)',
    cta: 'View on GitHub →'
  },
  {
    name: 'Product Hunt',
    url: 'https://github.com/ranbot-ai/product-hunt',
    icon: '📈',
    category: 'Discovery',
    blurb: 'Track daily-launching products before they trend',
    features: ['Daily launch feed', 'Upvote tracking', 'Maker insights'],
    gradient: 'linear-gradient(135deg, #da552f, #ff6154)',
    cta: 'View on GitHub →'
  }
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
          <span className="ranbot-promo-icon" style={{ background: product.gradient }}>
            {product.icon}
          </span>
          <div className="ranbot-promo-heading">
            <span className="ranbot-promo-name">{product.name}</span>
            <span className="ranbot-promo-category">{product.category}</span>
          </div>
          <p className="ranbot-promo-blurb">{product.blurb}</p>
          <ul className="ranbot-promo-features">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <span className="ranbot-promo-cta">{product.cta || 'Visit site →'}</span>
        </a>
      ))}
    </div>
  </section>
);

export default RanbotPromoSection;
