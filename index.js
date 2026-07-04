import axios from 'axios';
import fs from 'fs-extra';
import { Parser } from 'json2csv';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_SEARCH_URI = '/search/repositories';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const PERIODS = {
    daily: { daysBack: 7, subdir: '' },
    weekly: { daysBack: 30, subdir: 'weekly' },
    monthly: { daysBack: 90, subdir: 'monthly' },
};

/**
 * Fetches the trending repositories from the GitHub API for the given period and saves them to JSON/CSV.
 *
 * @param {string} period - One of 'daily', 'weekly', 'monthly'.
 * @return {Promise<void>} This function does not return anything explicitly.
 */
const fetchTrendingRepos = async (period) => {
    const config = PERIODS[period];

    if (!config) {
        throw new Error(`Unknown period "${period}". Expected one of: ${Object.keys(PERIODS).join(', ')}`);
    }

    try {
        const response = await axios.get(`${GITHUB_API_URL}${GITHUB_SEARCH_URI}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
            params: {
                q: 'created:>=' + getCutoffDate(config.daysBack),
                sort: 'stars',
                order: 'desc',
                per_page: 20,
            },
        });

        const repos = response.data.items;

        const today = new Date().toISOString().split('T')[0];
        const year = today.split('-')[0];
        const month = today.split('-')[1];
        const dateDir = `${dir(config.subdir)}/${year}/${month}`;

        fs.ensureDirSync(dateDir);

        saveReposToJson(repos, today, dateDir);
        saveReposToCsv(repos, today, dateDir);
    } catch (error) {
        console.error('Error fetching trending repositories:', error);
    }
};

/**
 * Gets the ISO date `daysBack` days before today.
 *
 * @param {number} daysBack - How many days back from today.
 * @return {string} The cutoff date in ISO format (YYYY-MM-DD).
 */
const getCutoffDate = (daysBack) => {
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - daysBack);
    return cutoff.toISOString().split('T')[0];
};

/**
 * Parses the --period=<daily|weekly|monthly> CLI argument, defaulting to 'daily'.
 *
 * @return {string} The requested period.
 */
const parsePeriod = () => {
    const arg = process.argv.find((a) => a.startsWith('--period='));
    return arg ? arg.split('=')[1] : 'daily';
};

const dir = (subdir) => {
    return subdir ? `./docs/${subdir}` : './docs';
};

/**
 * Saves the trending GitHub repositories to a JSON file.
 *
 * @param {Array} repos - The list of repositories to save.
 * @param {string} today - The current date in the format 'YYYY-MM-DD'.
 * @param {string} dateDir - The directory to save the file in.
 * @return {void} This function does not return anything explicitly.
 */
const saveReposToJson = (repos, today, dateDir) => {
    const filePath = `${dateDir}/${today}.json`;
    // JSON File with Selected Fields
    const selectedFields = repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: {
            login: repo.owner.login,
            avatar_url: repo.owner.avatar_url
        },
        description: repo.description,
        topics: repo.topics,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
    }));
    fs.writeFileSync(filePath, JSON.stringify(selectedFields, null, 2), 'utf8');

    console.log(`Saved trending repos to ${filePath}`);
};

/**
 * Saves the trending GitHub repositories to a CSV file.
 *
 * @param {Array} repos - The list of repositories to save.
 * @param {string} today - The current date in the format 'YYYY-MM-DD'.
 * @param {string} dateDir - The directory to save the file in.
 * @return {void} This function does not return anything explicitly.
 */
const saveReposToCsv = (repos, today, dateDir) => {
    const filePath = `${dateDir}/${today}.csv`;
    const fields = [
        'full_name', 'stargazers_count', 'owner.login', 'owner.avatar_url',
        'description', 'topics', 'html_url', 'created_at', 'updated_at', 'pushed_at',
        'git_url', 'ssh_url', 'clone_url', 'svn_url', 'homepage', 'size', 'language',
        'forks_count', 'open_issues_count', 'default_branch', 'license.name'
    ];
    const parser = new Parser({ fields });
    const csvFields = parser.parse(repos);

    fs.writeFileSync(filePath, csvFields, 'utf8');
    console.log(`Saved trending repos to ${filePath}`);
};

fetchTrendingRepos(parsePeriod());
