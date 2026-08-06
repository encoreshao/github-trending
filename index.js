import axios from 'axios';
import fs from 'fs-extra';
import { Parser } from 'json2csv';
import dotenv from 'dotenv';
import { TOPICS, getTopicSlug } from './src/data/topics.js';

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

        const { fileBase, dateDir } = getPeriodFileInfo(period, config.subdir);

        fs.ensureDirSync(dateDir);

        saveReposToJson(repos, fileBase, dateDir);
        saveReposToCsv(repos, fileBase, dateDir);
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
 * Gets the Monday on or before the given date (ISO week start).
 *
 * @param {Date} date - The reference date.
 * @return {Date} The Monday of that week.
 */
const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    return d;
};

/**
 * Computes the filename base and output directory for "one file per day" outputs
 * (the daily period, and each topic's daily snapshot), as of now.
 *
 * @param {string} subdir - The output subdirectory (e.g. '' for daily, 'topics/react' for a topic).
 * @return {{ fileBase: string, dateDir: string }}
 */
const getDailyFileInfo = (subdir) => {
    const now = new Date();
    const fileBase = now.toISOString().split('T')[0];
    const year = fileBase.split('-')[0];
    const month = fileBase.split('-')[1];
    return { fileBase, dateDir: `${dir(subdir)}/${year}/${month}` };
};

/**
 * Computes the filename base and output directory for a period, as of now.
 *
 * @param {string} period - One of 'daily', 'weekly', 'monthly'.
 * @param {string} subdir - The period's output subdirectory (from PERIODS).
 * @return {{ fileBase: string, dateDir: string }}
 */
const getPeriodFileInfo = (period, subdir) => {
    const now = new Date();

    if (period === 'monthly') {
        const year = String(now.getFullYear());
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return { fileBase: `${year}-${month}`, dateDir: `${dir(subdir)}/${year}` };
    }

    if (period === 'weekly') {
        const weekStart = getWeekStart(now);
        const fileBase = weekStart.toISOString().split('T')[0];
        const year = fileBase.split('-')[0];
        const month = fileBase.split('-')[1];
        return { fileBase, dateDir: `${dir(subdir)}/${year}/${month}` };
    }

    return getDailyFileInfo(subdir);
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
 * @param {string} fileBase - The filename base (no extension) to save under.
 * @param {string} dateDir - The directory to save the file in.
 * @return {void} This function does not return anything explicitly.
 */
const saveReposToJson = (repos, fileBase, dateDir) => {
    const filePath = `${dateDir}/${fileBase}.json`;
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
 * @param {string} fileBase - The filename base (no extension) to save under.
 * @param {string} dateDir - The directory to save the file in.
 * @return {void} This function does not return anything explicitly.
 */
const saveReposToCsv = (repos, fileBase, dateDir) => {
    const filePath = `${dateDir}/${fileBase}.csv`;
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

/**
 * Pauses execution for the given number of milliseconds.
 *
 * @param {number} ms - How long to sleep.
 * @return {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches trending repos for every topic in TOPICS and saves each to its own
 * JSON/CSV under docs/topics/<slug>/<year>/<month>/<date>.*. Runs once per day,
 * alongside (not instead of) the main daily fetch. Each topic is isolated in
 * its own try/catch so one bad slug or transient API error doesn't abort the rest.
 *
 * @return {Promise<void>}
 */
const fetchTopicRepos = async () => {
    for (const topic of TOPICS) {
        const slug = getTopicSlug(topic);

        try {
            const response = await axios.get(`${GITHUB_API_URL}${GITHUB_SEARCH_URI}`, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
                params: {
                    q: `topic:${slug} created:>=${getCutoffDate(7)}`,
                    sort: 'stars',
                    order: 'desc',
                    per_page: 20,
                },
            });

            const repos = response.data.items;

            if (!repos || repos.length === 0) {
                console.error(`No repos found for topic "${slug}" — check the slug is still a valid GitHub topic.`);
                continue;
            }

            const { fileBase, dateDir } = getDailyFileInfo(`topics/${slug}`);

            fs.ensureDirSync(dateDir);

            saveReposToJson(repos, fileBase, dateDir);
            saveReposToCsv(repos, fileBase, dateDir);
        } catch (error) {
            console.error(`Error fetching trending repos for topic "${slug}":`, error.message);
        }

        // Safety margin here comes from TOPICS.length staying small, not from this delay enforcing
        // the rate limit directly — revisit if TOPICS grows much past ~20 entries.
        await sleep(400);
    }
};

const period = parsePeriod();
fetchTrendingRepos(period).then(async () => {
    if (period === 'daily') {
        await fetchTopicRepos();
    }
});
