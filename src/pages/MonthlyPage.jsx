import React from 'react';
import TrendingPeriodPage from '../components/TrendingPeriodPage';

const MonthlyPage = () => (
  <TrendingPeriodPage
    title="Monthly Trending Repositories"
    windowDescription="Top 20 repos created in the last 90 days, ranked by stars — refreshed on the 1st of each month."
    csvSubdir="monthly"
    maxDaysBack={180}
  />
);

export default MonthlyPage;
