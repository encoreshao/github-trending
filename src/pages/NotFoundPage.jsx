import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-page">
      <Header />
      <main className="notfound-main">
        <div className="notfound-content">
          <svg
            className="notfound-icon"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="notfound-icon-grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa" />
                <stop offset="1" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="54" stroke="url(#notfound-icon-grad)" strokeWidth="2" strokeDasharray="6 6" opacity="0.35" />
            <rect x="28" y="32" width="64" height="48" rx="8" fill="rgba(59, 130, 246, 0.12)" stroke="url(#notfound-icon-grad)" strokeWidth="2.5" />
            <path d="M28 46h64" stroke="url(#notfound-icon-grad)" strokeWidth="2.5" />
            <circle cx="37" cy="39" r="2" fill="#60a5fa" />
            <circle cx="45" cy="39" r="2" fill="#60a5fa" />
            <circle cx="53" cy="39" r="2" fill="#60a5fa" />
            <text x="60" y="70" textAnchor="middle" fontSize="24" fontWeight="800" fill="url(#notfound-icon-grad)">?</text>
          </svg>
          <div className="notfound-number">404</div>
          <p className="notfound-tagline">Looks like this page got lost in a merge conflict.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
