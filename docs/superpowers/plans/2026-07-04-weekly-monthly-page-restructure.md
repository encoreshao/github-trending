# Weekly & Monthly Page Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill out the `/weekly` and `/monthly` pages with a language-distribution + period-over-period comparison insights row and a #1-repo spotlight banner, without changing the already-approved ranked scroll row.

**Architecture:** Extract the CSV day-walking search loop in `csvLoader.js` into a shared helper so a new `loadPreviousCSV` can reuse it to fetch the snapshot before the current one; compute language distribution and new-entry counts client-side from data already in memory; add a new `SpotlightBanner` component for the #1 repo, rendered above the existing (unchanged) scroll row.

**Tech Stack:** React 18, `@ant-design/icons`, Vite. No new dependencies.

## Global Constraints

- The ranked scroll row (all 20 cards, `#1`-`#20`) is unchanged — #1 also appears in the new spotlight banner; this duplication is intentional (a "featured + full list" pattern), not a bug to fix.
- No new API calls beyond one additional CSV fetch (the previous snapshot) — everything else (language breakdown, comparison count) is computed client-side from data already loaded.
- If no previous snapshot exists (e.g. right after a period job's first-ever run), the comparison badge must not render at all — never render "0 new entries," which would misleadingly imply a comparison happened.
- `loadLatestCSV`'s existing public signature and return shape (`loadLatestCSV(subdir, maxDaysBack) → Promise<{ data, date }>`) must not change — this is a pure internal refactor from the caller's perspective. `HomePage.jsx` and `TrendingPeriodPage.jsx`'s existing calls to it must keep working unmodified.
- No test framework exists in this repo. Verification is: `npm run build` after each change (catches JSX/import/syntax errors), plus a direct Node check against real GitHub data for the new `csvLoader.js` functions (Node 18+ has global `fetch`, and this package is `"type": "module"`, so `.js` files run as ES modules).
- Follow the existing dark/glassmorphism palette: navy `#0f172a`, card surface `rgba(30, 41, 59, 0.5)` / `rgba(51, 65, 85, 0.3)`, blue accent `#60a5fa` / `#3b82f6`, muted text `#94a3b8`.

---

## File Structure

- **Modify: `src/utils/csvLoader.js`** — extract `tryLoadCSVFrom(subdir, startDate, maxDaysBack)`, add `loadPreviousCSV(subdir, beforeDateStr, maxDaysBack)`.
- **Create: `src/components/SpotlightBanner.jsx`** + **`src/components/SpotlightBanner.css`** — the #1-repo featured banner.
- **Modify: `src/components/TrendingPeriodPage.jsx`** — load the previous snapshot, compute language breakdown + new-entry count, render the insights row and spotlight banner.
- **Modify: `src/components/TrendingPeriodPage.css`** — styles for the new insights row; trim the hero's now-unneeded bottom spacing.

---

### Task 1: Extract the CSV search helper and add `loadPreviousCSV`

**Files:**
- Modify: `src/utils/csvLoader.js`

**Interfaces:**
- Produces: `loadPreviousCSV(subdir = '', beforeDateStr, maxDaysBack = 30): Promise<{ data: Array<object>, date: string | null }>` — searches backward starting from the day *before* `beforeDateStr`, for up to `maxDaysBack` days, returning the first non-empty CSV found (same row shape as `loadLatestCSV`), or `{ data: [], date: null }` if `beforeDateStr` is falsy or nothing is found. Unlike `loadLatestCSV`, a not-found result here is not logged as an error — it's an expected outcome (e.g., the first-ever run of a period job has no "previous").
- Preserves: `loadLatestCSV(subdir = '', maxDaysBack = 30): Promise<{ data, date }>` — identical public signature and behavior to before this task.

- [ ] **Step 1: Replace the top of `src/utils/csvLoader.js` (through the end of `loadLatestCSV`)**

Current (`src/utils/csvLoader.js:1-49`):

```js
// Utility to load CSV data from GitHub repository
const GITHUB_REPO = 'encoreshao/github-trending';
const GITHUB_DOCS_PATH = 'docs';
const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${GITHUB_DOCS_PATH}`;

export const loadLatestCSV = async (subdir = '', maxDaysBack = 30) => {
  try {
    // Try to load the most recent date
    const today = new Date();
    const dates = [];

    for (let i = 0; i < maxDaysBack; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(dateStr);
    }

    const subdirPath = subdir ? `${subdir}/` : '';

    // Try to load the first available CSV from GitHub
    for (const dateStr of dates) {
      try {
        // Extract year and month from date string (YYYY-MM-DD)
        const year = dateStr.split('-')[0];
        const month = dateStr.split('-')[1];
        // Build path with folder structure: docs/[subdir/]YYYY/MM/YYYY-MM-DD.csv
        const csvUrl = `${GITHUB_RAW_URL}/${subdirPath}${year}/${month}/${dateStr}.csv`;
        const csvResponse = await fetch(csvUrl);
        if (csvResponse.ok) {
          const csvText = await csvResponse.text();
          const parsedData = parseCSV(csvText);
          if (parsedData.length > 0) {
            console.log(`✅ Loaded data from ${subdirPath}${year}/${month}/${dateStr}.csv (${parsedData.length} repos)`);
            return { data: parsedData, date: dateStr };
          }
        }
      } catch (err) {
        // Continue to next date
        continue;
      }
    }

    throw new Error(`No CSV files found in the last ${maxDaysBack} days`);
  } catch (error) {
    console.error('Error loading CSV from GitHub:', error);
    return { data: [], date: null };
  }
};
```

New:

```js
// Utility to load CSV data from GitHub repository
const GITHUB_REPO = 'encoreshao/github-trending';
const GITHUB_DOCS_PATH = 'docs';
const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${GITHUB_DOCS_PATH}`;

// Walks backward from startDate for maxDaysBack days looking for the first non-empty CSV.
const tryLoadCSVFrom = async (subdir, startDate, maxDaysBack) => {
  const dates = [];

  for (let i = 0; i < maxDaysBack; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  const subdirPath = subdir ? `${subdir}/` : '';

  for (const dateStr of dates) {
    try {
      // Extract year and month from date string (YYYY-MM-DD)
      const year = dateStr.split('-')[0];
      const month = dateStr.split('-')[1];
      // Build path with folder structure: docs/[subdir/]YYYY/MM/YYYY-MM-DD.csv
      const csvUrl = `${GITHUB_RAW_URL}/${subdirPath}${year}/${month}/${dateStr}.csv`;
      const csvResponse = await fetch(csvUrl);
      if (csvResponse.ok) {
        const csvText = await csvResponse.text();
        const parsedData = parseCSV(csvText);
        if (parsedData.length > 0) {
          console.log(`✅ Loaded data from ${subdirPath}${year}/${month}/${dateStr}.csv (${parsedData.length} repos)`);
          return { data: parsedData, date: dateStr };
        }
      }
    } catch (err) {
      // Continue to next date
      continue;
    }
  }

  return { data: [], date: null };
};

export const loadLatestCSV = async (subdir = '', maxDaysBack = 30) => {
  try {
    const result = await tryLoadCSVFrom(subdir, new Date(), maxDaysBack);
    if (!result.date) {
      throw new Error(`No CSV files found in the last ${maxDaysBack} days`);
    }
    return result;
  } catch (error) {
    console.error('Error loading CSV from GitHub:', error);
    return { data: [], date: null };
  }
};

// Finds the snapshot immediately preceding beforeDateStr, for period-over-period comparisons.
// Returns { data: [], date: null } if there's no prior snapshot to compare against — this is
// an expected outcome (e.g. a period job's first-ever run), not an error.
export const loadPreviousCSV = async (subdir = '', beforeDateStr, maxDaysBack = 30) => {
  if (!beforeDateStr) {
    return { data: [], date: null };
  }
  try {
    const beforeDate = new Date(beforeDateStr);
    beforeDate.setDate(beforeDate.getDate() - 1);
    return await tryLoadCSVFrom(subdir, beforeDate, maxDaysBack);
  } catch (error) {
    console.error('Error loading previous CSV from GitHub:', error);
    return { data: [], date: null };
  }
};
```

Leave `parseCSV`, `parseCSVLine`, `transformCSVData`, and `parseTopics` (the rest of the file, below `loadLatestCSV`) completely unchanged.

- [ ] **Step 2: Verify `npm run build` succeeds**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Verify the new function against real data**

Run:
```bash
node -e "import('./src/utils/csvLoader.js').then(async (m) => {
  const latest = await m.loadLatestCSV('weekly', 60);
  console.log('latest date:', latest.date, '| repos:', latest.data.length);
  const previous = await m.loadPreviousCSV('weekly', latest.date, 60);
  console.log('previous date:', previous.date, '| repos:', previous.data.length);
  const none = await m.loadPreviousCSV('weekly', null, 60);
  console.log('no-beforeDate result:', JSON.stringify(none));
})"
```

Expected: `latest date:` prints a real `YYYY-MM-DD` (the snapshot already committed under `docs/weekly/`) with `repos: 20`; `previous date:` prints either an earlier date with its own repo count, or `null` with `repos: 0` if this is the only weekly snapshot that exists yet (both are valid — there's currently only one weekly snapshot in this repo, so `null` is the expected result today); `no-beforeDate result:` prints `{"data":[],"date":null}`.

- [ ] **Step 4: Commit**

```bash
git add src/utils/csvLoader.js
git commit -m "feat: add loadPreviousCSV for period-over-period comparison"
```

---

### Task 2: Build the `SpotlightBanner` component

**Files:**
- Create: `src/components/SpotlightBanner.jsx`
- Create: `src/components/SpotlightBanner.css`

**Interfaces:**
- Consumes: `formatNumber` from `src/utils/formatNumber.js` (existing, from prior work).
- Produces: `<SpotlightBanner repo={repoObject} />` — `repo` is the same shape `TrendingCard` consumes (`{ id, full_name, name, owner: { login, avatar_url }, html_url, description, stargazers_count, forks_count, watchers_count, language, ... }`). Renders `null` if `repo` is falsy (so callers can pass `repos[0]` even before data loads without a guard).

- [ ] **Step 1: Create `src/components/SpotlightBanner.jsx`**

```jsx
import React from 'react';
import { StarOutlined, ForkOutlined, EyeOutlined } from '@ant-design/icons';
import { formatNumber } from '../utils/formatNumber';
import './SpotlightBanner.css';

const SpotlightBanner = ({ repo }) => {
  if (!repo) return null;

  return (
    <a
      className="spotlight-banner"
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="spotlight-bg"
        alt={repo.description || repo.name}
        loading="lazy"
        src={`https://opengraph.githubassets.com/${repo.id}/${repo.full_name}`}
        onError={(e) => {
          e.target.src = `https://github.com/${repo.owner.login}.png?size=400`;
        }}
      />
      <div className="spotlight-veil"></div>
      <div className="spotlight-medal">🥇 #1</div>
      <div className="spotlight-content">
        <h2 className="spotlight-title">{repo.name}</h2>
        <p className="spotlight-owner">{repo.full_name}</p>
        <p className="spotlight-excerpt">{repo.description || 'No description available'}</p>
        <div className="spotlight-stats">
          <span className="spotlight-stat">
            <StarOutlined />
            {formatNumber(repo.stargazers_count)}
          </span>
          {repo.forks_count > 0 && (
            <span className="spotlight-stat">
              <ForkOutlined />
              {formatNumber(repo.forks_count)}
            </span>
          )}
          {repo.watchers_count > 0 && (
            <span className="spotlight-stat">
              <EyeOutlined />
              {formatNumber(repo.watchers_count)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default SpotlightBanner;
```

- [ ] **Step 2: Create `src/components/SpotlightBanner.css`**

```css
.spotlight-banner {
  position: relative;
  display: block;
  height: 280px;
  width: calc(100% - 48px);
  margin: 8px 24px 32px;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.spotlight-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spotlight-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(11, 18, 32, 0.15) 0%, rgba(11, 18, 32, 0.55) 55%, rgba(11, 18, 32, 0.95) 100%);
}

.spotlight-medal {
  position: absolute;
  top: 20px;
  left: 24px;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.6);
  padding: 6px 14px;
  border-radius: 20px;
  backdrop-filter: blur(6px);
}

.spotlight-content {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 20px;
  color: #ffffff;
}

.spotlight-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 4px;
}

.spotlight-owner {
  font-size: 13px;
  color: #cbd5e1;
  margin: 0 0 10px;
}

.spotlight-excerpt {
  font-size: 14px;
  color: #e2e8f0;
  max-width: 640px;
  margin: 0 0 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spotlight-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.spotlight-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fbbf24;
  font-weight: 600;
}

@media (max-width: 968px) {
  .spotlight-banner {
    height: 240px;
    width: calc(100% - 40px);
    margin: 8px 20px 28px;
  }

  .spotlight-title {
    font-size: 22px;
  }
}

@media (max-width: 640px) {
  .spotlight-banner {
    height: 220px;
    width: calc(100% - 32px);
    margin: 8px 16px 24px;
  }

  .spotlight-title {
    font-size: 19px;
  }

  .spotlight-excerpt {
    display: none;
  }
}
```

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: build succeeds with no errors. (Not wired into a page yet — that's Task 3 — so this only confirms the component compiles cleanly.)

- [ ] **Step 4: Commit**

```bash
git add src/components/SpotlightBanner.jsx src/components/SpotlightBanner.css
git commit -m "feat: add SpotlightBanner component for #1 repo"
```

---

### Task 3: Wire the insights row and spotlight banner into `TrendingPeriodPage`

**Files:**
- Modify: `src/components/TrendingPeriodPage.jsx`
- Modify: `src/components/TrendingPeriodPage.css`

**Interfaces:**
- Consumes: `loadPreviousCSV` from Task 1 (`src/utils/csvLoader.js`); `<SpotlightBanner repo={...} />` from Task 2 (`src/components/SpotlightBanner.jsx`).

- [ ] **Step 1: Update imports and add state in `src/components/TrendingPeriodPage.jsx`**

Current (`src/components/TrendingPeriodPage.jsx:1-13`):

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { loadLatestCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import Header from './Header';
import Footer from './Footer';
import TrendingCard from './TrendingCard';
import './TrendingPeriodPage.css';

const TrendingPeriodPage = ({ title, windowDescription, csvSubdir, maxDaysBack }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
```

New:

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { loadLatestCSV, loadPreviousCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import Header from './Header';
import Footer from './Footer';
import TrendingCard from './TrendingCard';
import SpotlightBanner from './SpotlightBanner';
import './TrendingPeriodPage.css';

const TrendingPeriodPage = ({ title, windowDescription, csvSubdir, maxDaysBack }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newEntriesCount, setNewEntriesCount] = useState(null);
```

- [ ] **Step 2: Update `loadRepos` to also fetch the previous snapshot**

Current (`src/components/TrendingPeriodPage.jsx:27-41`):

```jsx
  const loadRepos = async () => {
    try {
      setLoading(true);
      const { data: csvData, date } = await loadLatestCSV(csvSubdir, maxDaysBack);
      const transformedData = transformCSVData(csvData);
      setRepos(transformedData.slice(0, 20));
      setLastUpdated(date);
    } catch (error) {
      console.error(`Error loading ${csvSubdir} trending repos:`, error);
      setRepos([]);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  };
```

New:

```jsx
  const loadRepos = async () => {
    try {
      setLoading(true);
      const { data: csvData, date } = await loadLatestCSV(csvSubdir, maxDaysBack);
      const transformedData = transformCSVData(csvData);
      const currentRepos = transformedData.slice(0, 20);
      setRepos(currentRepos);
      setLastUpdated(date);

      if (date) {
        const { data: previousCsvData } = await loadPreviousCSV(csvSubdir, date, maxDaysBack);
        const previousRepos = transformCSVData(previousCsvData).slice(0, 20);
        if (previousRepos.length > 0) {
          const previousNames = new Set(previousRepos.map(repo => repo.full_name));
          setNewEntriesCount(currentRepos.filter(repo => !previousNames.has(repo.full_name)).length);
        } else {
          setNewEntriesCount(null);
        }
      } else {
        setNewEntriesCount(null);
      }
    } catch (error) {
      console.error(`Error loading ${csvSubdir} trending repos:`, error);
      setRepos([]);
      setLastUpdated(null);
      setNewEntriesCount(null);
    } finally {
      setLoading(false);
    }
  };
```

- [ ] **Step 3: Add the language breakdown computation**

Immediately after the existing `totalStars`/`languageCount` lines (`src/components/TrendingPeriodPage.jsx:52-53`):

```jsx
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const languageCount = new Set(repos.map(repo => repo.language).filter(Boolean)).size;
```

add directly below them:

```jsx

  const languageBreakdown = (() => {
    const counts = {};
    repos.forEach(repo => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 4).map(([language, count]) => ({ language, count }));
    const otherCount = sorted.slice(4).reduce((sum, [, count]) => sum + count, 0);
    const entries = otherCount > 0 ? [...top, { language: 'Other', count: otherCount }] : top;
    return entries.map(entry => ({
      ...entry,
      percent: repos.length > 0 ? Math.round((entry.count / repos.length) * 100) : 0
    }));
  })();
```

- [ ] **Step 4: Restructure the render — move stats into a new insights section, add the language breakdown, comparison badge, and spotlight banner**

Current (`src/components/TrendingPeriodPage.jsx:59-118`, the full `return` JSX):

```jsx
    <div className="trending-period-page">
      <Header />
      <main className="period-main">
        <section className="period-hero">
          <div className="period-badge">
            {lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : 'No data yet'}
          </div>
          <h1 className="period-title">{title}</h1>
          <p className="period-description">{windowDescription}</p>
          {!loading && repos.length > 0 && (
            <div className="period-stats">
              <div className="period-stat">
                <span className="period-stat-number">{repos.length}</span>
                <span className="period-stat-label">Repos</span>
              </div>
              <div className="period-stat">
                <span className="period-stat-number">{formatNumber(totalStars)}</span>
                <span className="period-stat-label">Total Stars</span>
              </div>
              <div className="period-stat">
                <span className="period-stat-number">{languageCount}</span>
                <span className="period-stat-label">Languages</span>
              </div>
            </div>
          )}
        </section>

        <section className="period-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading trending repositories...</p>
            </div>
          ) : repos.length === 0 ? (
            <div className="period-empty">
              <p>No snapshot has been generated for this period yet. Check back soon.</p>
            </div>
          ) : (
            <div className="period-scroll-wrapper">
              <button
                type="button"
                className="period-scroll-arrow period-scroll-arrow-left"
                onClick={() => scrollByCards(-1)}
                aria-label="Scroll left"
              >
                <LeftOutlined />
              </button>
              <div className="period-scroll-row" ref={scrollRowRef}>
                {repos.map((repo, index) => (
                  <TrendingCard key={repo.id} repo={repo} index={index} rank={index + 1} />
                ))}
              </div>
              <button
                type="button"
                className="period-scroll-arrow period-scroll-arrow-right"
                onClick={() => scrollByCards(1)}
                aria-label="Scroll right"
              >
                <RightOutlined />
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
```

New:

```jsx
    <div className="trending-period-page">
      <Header />
      <main className="period-main">
        <section className="period-hero">
          <div className="period-badge">
            {lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : 'No data yet'}
          </div>
          <h1 className="period-title">{title}</h1>
          <p className="period-description">{windowDescription}</p>
        </section>

        {!loading && repos.length > 0 && (
          <section className="period-insights">
            <div className="period-stats">
              <div className="period-stat">
                <span className="period-stat-number">{repos.length}</span>
                <span className="period-stat-label">Repos</span>
              </div>
              <div className="period-stat">
                <span className="period-stat-number">{formatNumber(totalStars)}</span>
                <span className="period-stat-label">Total Stars</span>
              </div>
              <div className="period-stat">
                <span className="period-stat-number">{languageCount}</span>
                <span className="period-stat-label">Languages</span>
              </div>
            </div>

            {languageBreakdown.length > 0 && (
              <div className="language-breakdown">
                <span className="insights-label">Language mix</span>
                <div className="language-chips">
                  {languageBreakdown.map(({ language, percent }) => (
                    <span key={language} className="language-chip">
                      {language} <b>{percent}%</b>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {newEntriesCount !== null && (
              <div className="comparison-badge">
                <span className="insights-label">Since last snapshot</span>
                <span className="comparison-value">
                  {newEntriesCount} new {newEntriesCount === 1 ? 'entry' : 'entries'}
                </span>
              </div>
            )}
          </section>
        )}

        <section className="period-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading trending repositories...</p>
            </div>
          ) : repos.length === 0 ? (
            <div className="period-empty">
              <p>No snapshot has been generated for this period yet. Check back soon.</p>
            </div>
          ) : (
            <>
              <SpotlightBanner repo={repos[0]} />
              <div className="period-scroll-wrapper">
                <button
                  type="button"
                  className="period-scroll-arrow period-scroll-arrow-left"
                  onClick={() => scrollByCards(-1)}
                  aria-label="Scroll left"
                >
                  <LeftOutlined />
                </button>
                <div className="period-scroll-row" ref={scrollRowRef}>
                  {repos.map((repo, index) => (
                    <TrendingCard key={repo.id} repo={repo} index={index} rank={index + 1} />
                  ))}
                </div>
                <button
                  type="button"
                  className="period-scroll-arrow period-scroll-arrow-right"
                  onClick={() => scrollByCards(1)}
                  aria-label="Scroll right"
                >
                  <RightOutlined />
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
```

- [ ] **Step 5: Update `src/components/TrendingPeriodPage.css`**

Reduce the hero's bottom padding (stats no longer live inside it) and add styles for the new insights row. Replace:

```css
.period-hero {
  padding: 140px 24px 40px;
  background: radial-gradient(circle at 15% 0%, rgba(59, 130, 246, 0.18), transparent 55%);
}
```

with:

```css
.period-hero {
  padding: 140px 24px 20px;
  background: radial-gradient(circle at 15% 0%, rgba(59, 130, 246, 0.18), transparent 55%);
}
```

Replace:

```css
.period-content {
  padding-bottom: 40px;
}
```

with:

```css
.period-insights {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 32px;
  padding: 0 24px 28px;
}

.insights-label {
  display: block;
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.language-breakdown {
  min-width: 220px;
}

.language-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.language-chip {
  background: rgba(51, 65, 85, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.15);
  color: #cbd5e1;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 20px;
}

.language-chip b {
  color: #60a5fa;
  font-weight: 700;
  margin-left: 4px;
}

.comparison-badge {
  display: flex;
  flex-direction: column;
}

.comparison-value {
  font-size: 18px;
  font-weight: 700;
  color: #4ade80;
}

.period-content {
  padding-bottom: 40px;
}
```

Finally, inside the existing `@media (max-width: 968px)` block, add (right after the existing `.period-title { font-size: 30px; }` rule):

```css
  .period-hero {
    padding: 120px 20px 16px;
  }
```

(This overrides the block's earlier `.period-hero { padding: 120px 20px 32px; }` rule — replace that existing declaration's bottom value from `32px` to `16px` rather than adding a duplicate rule.)

And inside the existing `@media (max-width: 640px)` block, change the existing `.period-hero { padding: 104px 16px 28px; }` rule's bottom value from `28px` to `12px`, and add:

```css
  .period-insights {
    padding: 0 16px 24px;
    gap: 20px;
  }
```

- [ ] **Step 6: Verify the build succeeds**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 7: Verify in the dev server**

Run: `npm run dev`, then visit `http://localhost:5173/weekly` and `http://localhost:5173/monthly`:
- Confirm the hero now shows only badge/title/description (no stats).
- Confirm a new row below the hero shows the 3 stat boxes, a "Language mix" chip row, and (if a previous weekly/monthly snapshot exists — otherwise it's absent, which is correct) a "Since last snapshot" badge.
- Confirm a large spotlight banner for the #1 repo renders above the ranked scroll row, using that repo's real GitHub social-preview image.
- Confirm the scroll row still shows all 20 cards ranked `#1`-`#20` (including #1 again), unchanged from before.
- Resize the browser (or use device emulation) to confirm the insights row and spotlight banner both remain readable at tablet (~768px) and mobile (~375px) widths.

- [ ] **Step 8: Commit**

```bash
git add src/components/TrendingPeriodPage.jsx src/components/TrendingPeriodPage.css
git commit -m "feat: add insights row and spotlight banner to weekly/monthly pages"
```

---

## Self-Review Notes

- **Spec coverage:** `loadPreviousCSV` + shared search helper (Task 1) ✓, spotlight banner component (Task 2) ✓, language breakdown + comparison badge + insights row + banner wiring (Task 3) ✓, comparison badge suppressed when no previous snapshot exists (Task 3, `newEntriesCount !== null` check) ✓, scroll row unchanged (Task 3, JSX diff shows only wrapping additions, the row's own markup is untouched) ✓, responsive breakpoints for both new pieces (Tasks 2 & 3 CSS) ✓.
- **Placeholder scan:** none — every step has literal, complete code and exact verification commands/expected output.
- **Type/name consistency:** `loadPreviousCSV(subdir, beforeDateStr, maxDaysBack) → { data, date }` defined in Task 1, consumed identically in Task 3; `<SpotlightBanner repo={...} />` defined in Task 2, consumed identically in Task 3 as `<SpotlightBanner repo={repos[0]} />`.
