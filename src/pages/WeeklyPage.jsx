import React from 'react';
import TrendingPeriodPage from '../components/TrendingPeriodPage';

const WeeklyPage = () => (
  <TrendingPeriodPage
    title="Weekly Trending Repositories"
    windowDescription="Top 20 repos created in the last 30 days, ranked by stars — refreshed every Monday."
    csvSubdir="weekly"
    maxDaysBack={60}
    crossPeriod={{
      title: 'Monthly Highlights',
      badgeLabel: 'This month',
      subdir: 'monthly',
      maxDaysBack: 180,
      path: '/monthly',
      variant: 'monthly'
    }}
    showDaily
  />
);

export default WeeklyPage;
