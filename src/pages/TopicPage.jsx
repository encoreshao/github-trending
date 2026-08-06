import React from 'react';
import { useParams } from 'react-router-dom';
import TrendingPeriodPage from '../components/TrendingPeriodPage';
import TopicSwitcher from '../components/TopicSwitcher';
import NotFoundPage from './NotFoundPage';
import { TOPICS, getTopicSlug } from '../data/topics';

const TopicPage = () => {
  const { slug } = useParams();
  const topic = TOPICS.find((t) => t.id === slug);

  if (!topic) {
    return <NotFoundPage />;
  }

  return (
    <TrendingPeriodPage
      title={`${topic.name} Trending Repositories`}
      windowDescription={`Top 20 ${topic.name} repos created in the last 7 days, ranked by stars — refreshed daily.`}
      csvSubdir={`topics/${getTopicSlug(topic)}`}
      maxDaysBack={30}
      topSlot={<TopicSwitcher activeTopicId={topic.id} />}
      showDaily
      showWeekly
      showMonthly
      bottomSection="subscribe"
    />
  );
};

export default TopicPage;
