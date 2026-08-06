import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubscriptionPage from './pages/SubscriptionPage';
import DemoPage from './pages/DemoPage';
import WeeklyPage from './pages/WeeklyPage';
import MonthlyPage from './pages/MonthlyPage';
import TopicPage from './pages/TopicPage';
import NotFoundPage from './pages/NotFoundPage';
import { BLOCKED_ROUTES } from './blockedRoutes';
import './NewApp.css';

const NewApp = () => {
  return (
    <Router>
      <div className="new-app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscribe" element={<SubscriptionPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/weekly" element={<WeeklyPage />} />
          <Route path="/monthly" element={<MonthlyPage />} />
          <Route path="/topics/:slug" element={<TopicPage />} />
          {BLOCKED_ROUTES.map((path) => (
            <Route key={path} path={path} element={<NotFoundPage />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default NewApp;
