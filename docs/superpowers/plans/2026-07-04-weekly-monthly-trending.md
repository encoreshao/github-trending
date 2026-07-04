# Weekly & Monthly Trending Jobs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generalize the existing daily GitHub-trending fetch job to also support weekly and monthly runs, without duplicating fetch/save logic.

**Architecture:** `index.js` gains a `--period=<daily|weekly|monthly>` CLI flag that selects a `daysBack` (query window) and `subdir` (output path) from a small `PERIODS` config. Everything else (top-20 limit, JSON/CSV shape, GitHub Search API call) is shared and unchanged. Two new local (gitignored) shell scripts mirror the existing `scripts/run.sh` pattern for cron + git automation.

**Tech Stack:** Node.js (ES modules), axios, fs-extra, json2csv, dotenv — all already in use, no new dependencies.

## Global Constraints

- The existing crontab entry `node index.js` (no args) must keep writing to the exact same path it does today: `docs/YYYY/MM/YYYY-MM-DD.{json,csv}`. This is a hard backward-compatibility requirement — do not break the running daily cron job.
- Top-20 results, sorted by stars descending, for all three periods (per spec — same as current daily behavior).
- Query windows: daily = 7 days back, weekly = 30 days back, monthly = 90 days back (per spec).
- Output paths: daily → `docs/YYYY/MM/...` (unchanged), weekly → `docs/weekly/YYYY/MM/...`, monthly → `docs/monthly/YYYY/MM/...`.
- Files are named by the run date (`YYYY-MM-DD`), not a week/month label, for all periods.
- No test framework exists in this repo (no jest/mocha/vitest configured, no `test` script in `package.json`). Verification in this plan uses manual script execution and file-content inspection instead of automated tests, consistent with existing project conventions. Do not introduce a test framework as part of this work — out of scope.
- `scripts/*.sh` is gitignored (see `.gitignore` line `/scripts/*.sh`) and contains machine-specific absolute paths (e.g. the local nvm node binary path, the local project path). New shell scripts follow this same convention — created on disk, not committed.
- Error handling stays exactly as today: GitHub API failures are caught and `console.error`-logged, no retry logic, no process-exit-code changes.
- Do not touch `scripts/run.sh` (existing daily automation) — it already works and is out of scope.
- Do not modify the user's crontab without explicit confirmation at the time — this plan ends by handing off the exact lines to add.

---

## File Structure

- **Modify: `index.js`** — add `PERIODS` config, `--period` CLI parsing, generalize the date-cutoff and output-dir logic, remove the two dead/commented-out markdown export functions (`saveReposToMarkdown`, `saveReposToTableInMarkdown`) and their now-unused `getLastWeekDate` helper (replaced by a generalized `getCutoffDate(daysBack)`).
- **Modify: `package.json`** — add `trending:daily`, `trending:weekly`, `trending:monthly` npm scripts.
- **Create: `scripts/run-weekly.sh`** — local-only (gitignored) cron entry point for the weekly job.
- **Create: `scripts/run-monthly.sh`** — local-only (gitignored) cron entry point for the monthly job.

---

### Task 1: Generalize `index.js` around a `period` concept

**Files:**
- Modify: `index.js` (full-file rewrite)

**Interfaces:**
- Produces: CLI contract `node index.js [--period=daily|weekly|monthly]` (defaults to `daily`). Exit behavior: invalid `--period` value throws synchronously before any network call, crashing the process with a non-zero exit code and an `Unknown period "<value>"...` message on stderr — this is a deliberate change from silent success as it makes a misconfigured cron job or typo immediately visible in `tmp/log.txt`, whereas invalid usage previously wasn't possible at all.

- [ ] **Step 1: Replace the full contents of `index.js`**

```js
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
```

- [ ] **Step 2: Verify daily (backward-compatible, no-args) behavior still works**

Run: `node index.js`
Expected: console output `Saved trending repos to ./docs/2026/07/2026-07-04.json` and `Saved trending repos to ./docs/2026/07/2026-07-04.csv` (using today's actual date), and those two files exist with content (an array of 20 repo objects in the JSON file).

- [ ] **Step 3: Verify weekly behavior**

Run: `node index.js --period=weekly`
Expected: console output `Saved trending repos to ./docs/weekly/2026/07/2026-07-04.json` and the matching `.csv` line; both files exist under `docs/weekly/2026/07/`.

- [ ] **Step 4: Verify monthly behavior**

Run: `node index.js --period=monthly`
Expected: console output `Saved trending repos to ./docs/monthly/2026/07/2026-07-04.json` and the matching `.csv` line; both files exist under `docs/monthly/2026/07/`.

- [ ] **Step 5: Verify invalid period fails loudly**

Run: `node index.js --period=bogus`
Expected: process exits non-zero; stderr includes `Unknown period "bogus". Expected one of: daily, weekly, monthly`.

- [ ] **Step 6: Commit**

```bash
git add index.js
git commit -m "feat: generalize trending fetch job around daily/weekly/monthly periods"
```

---

### Task 2: Add npm scripts for each period

**Files:**
- Modify: `package.json:41-45` (the `"scripts"` block)

**Interfaces:**
- Consumes: `node index.js --period=<period>` CLI contract from Task 1.
- Produces: `npm run trending:daily`, `npm run trending:weekly`, `npm run trending:monthly` as the documented, manually-runnable entry points (also used by backfills or ad hoc checks).

- [ ] **Step 1: Update the `"scripts"` block**

Current (`package.json:41-45`):
```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
```

New:
```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "trending:daily": "node index.js --period=daily",
    "trending:weekly": "node index.js --period=weekly",
    "trending:monthly": "node index.js --period=monthly"
  }
```

- [ ] **Step 2: Verify each script runs**

Run: `npm run trending:weekly`
Expected: same output as Task 1 Step 3 (npm just forwards to `node index.js --period=weekly`).

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add npm scripts for daily/weekly/monthly trending fetch"
```

---

### Task 3: Create the weekly cron automation script

**Files:**
- Create: `scripts/run-weekly.sh` (gitignored — matches existing `/scripts/*.sh` pattern in `.gitignore`, not committed)

**Interfaces:**
- Consumes: `node index.js --period=weekly` (Task 1), the local absolute node binary path and project path (copied from the existing `scripts/run.sh` which already encodes this machine's paths).

- [ ] **Step 1: Create `scripts/run-weekly.sh`**

```bash
#!/bin/bash

# Navigate to your project directory
cd /Users/encore/Dev/RanBOT/github-trending/

/Users/encore/.nvm/versions/node/v20.10.0/bin/node -v >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1

# Run the weekly trending fetch
/Users/encore/.nvm/versions/node/v20.10.0/bin/node index.js --period=weekly >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1

# Add changes to git (recursive add of the whole weekly output tree)
git add docs/weekly >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1

# Commit changes
current_date=$(date +"%Y-%m-%d")
commit_message="Auto-generated docs: Weekly Trending GitHub Repositories for $current_date"
git commit -m "$commit_message" >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1

# Push to the remote repository
git push origin main >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1
```

- [ ] **Step 2: Make it executable**

Run: `chmod +x scripts/run-weekly.sh`
Expected: no output; `ls -l scripts/run-weekly.sh` shows an `x` permission bit (e.g. `-rwxr-xr-x`).

- [ ] **Step 3: Verify it runs end-to-end**

Run: `./scripts/run-weekly.sh`
Expected: `tmp/log.txt` gains new lines for the node version, the `Saved trending repos to ./docs/weekly/...` messages, and a `git commit` result; `git log -1` shows a new commit titled `Auto-generated docs: Weekly Trending GitHub Repositories for <today>`.

No `git add` step here — this file is gitignored by design (see Global Constraints) and must not be committed.

---

### Task 4: Create the monthly cron automation script

**Files:**
- Create: `scripts/run-monthly.sh` (gitignored, same as Task 3)

**Interfaces:**
- Consumes: `node index.js --period=monthly` (Task 1).

- [ ] **Step 1: Create `scripts/run-monthly.sh`**

```bash
#!/bin/bash

# Navigate to your project directory
cd /Users/encore/Dev/RanBOT/github-trending/

/Users/encore/.nvm/versions/node/v20.10.0/bin/node -v >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1

# Run the monthly trending fetch
/Users/encore/.nvm/versions/node/v20.10.0/bin/node index.js --period=monthly >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1

# Add changes to git (recursive add of the whole monthly output tree)
git add docs/monthly >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1

# Commit changes
current_date=$(date +"%Y-%m-%d")
commit_message="Auto-generated docs: Monthly Trending GitHub Repositories for $current_date"
git commit -m "$commit_message" >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1

# Push to the remote repository
git push origin main >> /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1
```

- [ ] **Step 2: Make it executable**

Run: `chmod +x scripts/run-monthly.sh`
Expected: no output; `ls -l scripts/run-monthly.sh` shows an `x` permission bit.

- [ ] **Step 3: Verify it runs end-to-end**

Run: `./scripts/run-monthly.sh`
Expected: `tmp/log.txt` gains new lines for the node version, the `Saved trending repos to ./docs/monthly/...` messages, and a `git commit` result; `git log -1` shows a new commit titled `Auto-generated docs: Monthly Trending GitHub Repositories for <today>`.

No `git add` step here — this file is gitignored by design and must not be committed.

---

### Task 5: Hand off crontab entries for user confirmation

**Files:** none (no repo files change in this task)

- [ ] **Step 1: Present the exact crontab lines to the user**

```cron
# Weekly trending fetch — every Monday at 10:05
05 10 * * 1 /Users/encore/Dev/RanBOT/github-trending/scripts/run-weekly.sh /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1

# Monthly trending fetch — the 1st of every month at 10:10
10 10 1 * * /Users/encore/Dev/RanBOT/github-trending/scripts/run-monthly.sh /Users/encore/Dev/RanBOT/github-trending/tmp/log.txt 2>&1
```

- [ ] **Step 2: Ask the user whether to add these via `crontab -e` themselves, or have the assistant apply them with `(crontab -l; echo "<line>") | crontab -` after explicit confirmation.** Do not modify the crontab without that confirmation (per Global Constraints).

---

## Self-Review Notes

- **Spec coverage:** period config (Task 1) ✓, npm scripts (Task 2) ✓, output paths per period (Task 1) ✓, weekly/monthly automation scripts with period-specific commit messages (Tasks 3–4) ✓, crontab handoff without auto-modifying (Task 5) ✓, dead-code removal (Task 1, Step 1) ✓, daily backward compatibility verified (Task 1, Step 2) ✓.
- **Placeholder scan:** none found — every step has literal commands/code and concrete expected output.
- **Type/name consistency:** `PERIODS`, `getCutoffDate`, `parsePeriod`, `dir`, `saveReposToJson`, `saveReposToCsv` are defined once in Task 1 and referenced identically (same names, same call signatures) in Tasks 2–4.
