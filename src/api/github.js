import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_SEARCH_URI = '/search/repositories';

// 获取一周前的日期
function getLastWeekDate() {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  return lastWeek.toISOString().split('T')[0];
}

// 抓取 trending 仓库
export async function fetchTrendingRepos(token, perPage = 20, category = '') {
  let q = '';
  if (category && category.trim()) {
    q = `${category.trim()} created:>=${getLastWeekDate()}`;
  } else {
    q = `created:>=${getLastWeekDate()}`;
  }
  const response = await axios.get(`${GITHUB_API_URL}${GITHUB_SEARCH_URI}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
      },
      params: {
        q,
        sort: 'stars',
        order: 'desc',
        per_page: perPage,
      },
    }
  );
  return response.data.items;
}