const axios = require('axios');
const fs = require('fs-extra');
require('dotenv').config();

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_SEARCH_URI = '/search/repositories';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Fetches the trending repositories from the GitHub API based on certain criteria and saves the repositories to markdown.
 *
 * @return {Promise<void>} This function does not return anything explicitly.
 */
const fetchTrendingRepos = async () => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}${GITHUB_SEARCH_URI}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
            params: {
                q: 'created:>=' + getLastWeekDate(),
                sort: 'stars',
                order: 'desc',
                per_page: 20,
            },
        });

        const repos = response.data.items;

        saveReposToMarkdown(repos)
        saveReposToTableInMarkdown(repos);
    } catch (error) {
        console.error('Error fetching trending repositories:', error);
    }
};

/**
 * Get the date of last week in ISO format.
 *
 * @return {string} The date of last week.
 */
const getLastWeekDate = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    return lastWeek.toISOString().split('T')[0];
};


/**
 * Save the trending GitHub repositories to a markdown file.
 *
 * @param {Array} repos - The list of repositories to save.
 * @return {void} This function does not return anything explicitly.
 */
const saveReposToMarkdown = (repos) => {
    const today = new Date().toISOString().split('T')[0];
    const dir = './docs';
    const filePath = `${dir}/${today}.md`;

    const markdownContent = `# Top 20 Trending GitHub Repositories of the Week (as of ${today})\n\n` +
        repos.map((repo, index) => (
            `${index + 1}. **[${repo.full_name}](https://github.com/${repo.full_name})** - 🌟 ${repo.stargazers_count}\n` +
            `   - **Owner**: ${repo.owner.login}\n` +
            `   - <img src="${repo.owner.avatar_url}" width="100" height="100">\n` +
            `   - **Description**: ${repo.description || 'No description'}\n` +
            `   - **Topics**: ${repo.topics.join(', ') || 'No topics'}\n` +
            `   - **URL**: [${repo.html_url}](${repo.html_url})\n` +
            `   - **Created At**: ${repo.created_at}\n` +
            `   - **Updated At**: ${repo.updated_at}\n` +
            `   - **Pushed At**: ${repo.pushed_at}\n` +
            `   - **Git URL**: ${repo.git_url}\n` +
            `   - **SSH URL**: ${repo.ssh_url}\n` +
            `   - **Clone URL**: ${repo.clone_url}\n` +
            `   - **SVN URL**: ${repo.svn_url}\n` +
            `   - **Homepage**: ${repo.homepage || 'No homepage'}\n` +
            `   - **Size**: ${repo.size}\n` +
            `   - **Language**: ${repo.language || 'No language specified'}\n` +
            `   - **Forks Count**: ${repo.forks_count}\n` +
            `   - **Open Issues Count**: ${repo.open_issues_count}\n` +
            `   - **Default Branch**: ${repo.default_branch}\n` +
            `   - **License**: ${repo.license ? repo.license.name : 'No license'}\n`
        )).join('\n');

    fs.ensureDirSync(dir);
    fs.writeFileSync(filePath, markdownContent, 'utf8');

    console.log(`Saved trending repos to ${filePath}`);
};


const saveReposToTableInMarkdown = (repos) => {
    const today = new Date().toISOString().split('T')[0];
    const dir = './docs';
    const filePath = `${dir}/${today}-table.md`;

    const markdownContent = `# Top 20 Trending GitHub Repositories of the Week (as of ${today})\n\n` +
        '| # | Repository | Stars | Owner | Avatar | Description | Topics | URL | Created At | Updated At | Pushed At | Git URL | SSH URL | Clone URL | SVN URL | Homepage | Size | Language | Forks Count | Open Issues Count | Default Branch | License |\n' +
        '|---|------------|-------|-------|--------|-------------|--------|-----|------------|------------|-----------|---------|---------|-----------|---------|----------|------|----------|--------------|-------------------|----------------|---------|\n' +
        repos.map((repo, index) => (
            `| ${index + 1} | [${repo.full_name}](https://github.com/${repo.full_name}) | ${repo.stargazers_count} | ${repo.owner.login} | ![${repo.owner.login}'s avatar](${repo.owner.avatar_url}) | ${repo.description || 'No description'} | ${repo.topics.join(', ') || 'No topics'} | [${repo.html_url}](${repo.html_url}) | ${repo.created_at} | ${repo.updated_at} | ${repo.pushed_at} | ${repo.git_url} | ${repo.ssh_url} | ${repo.clone_url} | ${repo.svn_url} | ${repo.homepage || 'No homepage'} | ${repo.size} | ${repo.language || 'No language specified'} | ${repo.forks_count} | ${repo.open_issues_count} | ${repo.default_branch} | ${repo.license ? repo.license.name : 'No license'} |`
        )).join('\n');

    fs.ensureDirSync(dir);
    fs.writeFileSync(filePath, markdownContent, 'utf8');

    console.log(`Saved trending repos to ${filePath}`);
};


fetchTrendingRepos();
