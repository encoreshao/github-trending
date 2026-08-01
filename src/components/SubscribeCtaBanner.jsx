import React from 'react';
import { Link } from 'react-router-dom';
import './SubscribeCtaBanner.css';

const SubscribeCtaBanner = () => (
  <section className="subscribe-cta-banner">
    <div className="subscribe-cta-content">
      <h2 className="subscribe-cta-title">Want this delivered to your inbox?</h2>
      <p className="subscribe-cta-description">
        Subscribe for a personalized digest of trending repos in the languages and topics you care about.
      </p>
      <Link to="/subscribe" className="subscribe-cta-button">
        Subscribe for free →
      </Link>
    </div>
  </section>
);

export default SubscribeCtaBanner;
