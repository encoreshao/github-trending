import React from 'react';
import TrendingPeriodPage from '../components/TrendingPeriodPage';

const MonthlyPage = () => (
  <TrendingPeriodPage
    title="Monthly Trending Repositories"
    windowDescription="Top 20 repos created in the last 90 days, ranked by stars — refreshed on the 1st of each month."
    csvSubdir="monthly"
    maxDaysBack={180}
    crossPeriod={{
      title: 'Weekly Highlights',
      badgeLabel: 'This week',
      subdir: 'weekly',
      maxDaysBack: 60,
      path: '/weekly',
      variant: 'weekly'
    }}
    bottomSection="subscribe"
  />
);

export default MonthlyPage;
