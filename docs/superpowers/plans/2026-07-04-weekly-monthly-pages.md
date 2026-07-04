# Weekly & Monthly Trending Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/weekly` and `/monthly` pages that browse the pre-generated weekly/monthly trending snapshots as a horizontally-scrolling row of rich cards, matching the rest of the site's look.

**Architecture:** Extract the homepage's existing rich "project card" markup into a shared `TrendingCard` component (adding an optional rank badge), generalize `csvLoader.loadLatestCSV` to read from any `docs/<subdir>/...` path with a configurable lookback window, then build one shared `TrendingPeriodPage` shell (hero + horizontal scroll row + loading/empty states) that `WeeklyPage`/`MonthlyPage` configure via props — mirroring the backend's `PERIODS` config pattern.

**Tech Stack:** React 18, react-router-dom, Ant Design icons (`@ant-design/icons`), Vite. No new dependencies.

## Global Constraints

- Data source: read the already-committed `docs/weekly/*.csv` and `docs/monthly/*.csv` snapshots via `csvLoader.js` (same approach as the homepage's daily preview) — no live GitHub API calls, no token required, per the approved design.
- Weekly page: `csvSubdir="weekly"`, lookback `maxDaysBack=60` (job runs ~weekly; double the cadence as a missed-run buffer).
- Monthly page: `csvSubdir="monthly"`, lookback `maxDaysBack=180` (job runs ~monthly; same doubling logic).
- Layout: a single horizontal scroll row containing all 20 ranked cards (not a grid, not a multi-row hybrid) — this was the user-approved mockup direction ("Single rich scroll row").
- Each card shows: OG banner image with a language tag overlay, a numbered rank badge, title (linked), description excerpt, `owner/repo` + created date, stars/forks/watchers stats, and a "View Repository" CTA — i.e. the homepage's existing card content, unchanged, plus the new rank badge.
- Page hero shows a "Last updated: <date>" badge reflecting the actual date of the loaded CSV snapshot (not today's date, and not a literal week-range) — per the approved wording decision.
- Routes: separate `/weekly` and `/monthly` routes (not a single tabbed page) — per user decision.
- Nav: add two direct links to `Header.jsx`, positioned Home → Weekly → Monthly → Live Demo → Subscribe.
- No filtering, sorting, table/card toggle, or CSV/JSON export on these pages — out of scope per the design doc.
- No test framework exists in this frontend (no vitest/jest configured, no `test` script in `package.json`). Verification uses `npm run build` (catches JSX/import/syntax errors) plus manual visual confirmation in the dev server — consistent with this repo's existing conventions.
- Follow the existing dark/glassmorphism palette already used across the site: navy background `#0f172a`, card surface `rgba(30, 41, 59, 0.5)`, blue accent `#60a5fa` / `#3b82f6`, muted text `#94a3b8`.

---

## File Structure

- **Create: `src/utils/formatNumber.js`** — the number-formatting helper (`1234` → `"1.2k"`), extracted so both `HomePage.jsx` and the new `TrendingCard`/`TrendingPeriodPage` can share it instead of redefining it.
- **Create: `src/components/TrendingCard.jsx`** + **`src/components/TrendingCard.css`** — the rich repo card, extracted from `HomePage.jsx`'s inline markup, with a new optional `rank` prop.
- **Modify: `src/pages/HomePage.jsx`** — use `TrendingCard` instead of inline markup; use the shared `formatNumber`.
- **Modify: `src/pages/HomePage.css`** — remove the card CSS block that moved to `TrendingCard.css`.
- **Modify: `src/utils/csvLoader.js`** — generalize `loadLatestCSV` to accept `(subdir, maxDaysBack)` and return `{ data, date }` instead of a bare array.
- **Create: `src/components/TrendingPeriodPage.jsx`** + **`src/components/TrendingPeriodPage.css`** — the shared page shell (hero, stats, scroll row, loading/empty states) used by both new pages.
- **Create: `src/pages/WeeklyPage.jsx`**, **`src/pages/MonthlyPage.jsx`** — thin wrappers supplying period config to `TrendingPeriodPage`.
- **Modify: `src/NewApp.jsx`** — add the two new routes.
- **Modify: `src/components/Header.jsx`** — add the two new nav links.

---

### Task 1: Extract `TrendingCard` component from the homepage

**Files:**
- Create: `src/utils/formatNumber.js`
- Create: `src/components/TrendingCard.jsx`
- Create: `src/components/TrendingCard.css`
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/pages/HomePage.css:368-599`

**Interfaces:**
- Produces: `formatNumber(num: number): string` from `src/utils/formatNumber.js`.
- Produces: `<TrendingCard repo={repoObject} index={number} rank={number|undefined} />` from `src/components/TrendingCard.jsx`. `repo` is the shape `transformCSVData` (in `src/utils/csvLoader.js`) already produces: `{ id, full_name, name, owner: { login, avatar_url }, html_url, description, stargazers_count, forks_count, watchers_count, language, created_at, updated_at, topics, homepage }`. `index` drives the existing stagger-in animation delay. `rank`, when provided, renders a numbered badge over the card image; when omitted, the card is visually identical to today's homepage card.

- [ ] **Step 1: Create `src/utils/formatNumber.js`**

```js
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};
```

- [ ] **Step 2: Create `src/components/TrendingCard.jsx`**

```jsx
import React from 'react';
import { StarOutlined, ForkOutlined, EyeOutlined } from '@ant-design/icons';
import { formatNumber } from '../utils/formatNumber';
import './TrendingCard.css';

const TrendingCard = ({ repo, index = 0, rank }) => {
  return (
    <article
      className="project-card"
      style={{ animationDelay: `${(index % 6) * 0.1}s` }}
    >
      <div className="card-image">
        <img
          alt={repo.description || repo.name}
          loading="lazy"
          width="400"
          height="200"
          src={`https://opengraph.githubassets.com/${repo.id}/${repo.full_name}`}
          onError={(e) => {
            e.target.src = `https://github.com/${repo.owner.login}.png?size=400`;
          }}
        />
        <div className="card-image-overlay">
          <div className="project-tags">
            <span className="project-tag github-tag">
              <i className="fab fa-github"></i>
              <span>GitHub</span>
            </span>
            {repo.language && (
              <span className="project-tag language-tag">
                <i className="fas fa-code"></i>
                <span>{repo.language}</span>
              </span>
            )}
          </div>
          <div className="bookmark-container">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bookmark-btn"
              title="View on GitHub"
            >
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
        {rank && <div className="rank-badge">#{rank}</div>}
      </div>

      <div className="card-header">
        <div className="card-meta">
          <span className="card-category">Open Source</span>
          <time className="card-date">
            {new Date(repo.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h3>
        <p className="card-excerpt">
          {repo.description || 'No description available'}
        </p>
        <div className="repo-info">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-link"
          >
            <i className="fab fa-github"></i>
            <span>{repo.full_name}</span>
            <i className="fas fa-external-link-alt"></i>
          </a>
        </div>
        <div className="repo-stats">
          <span className="repo-stat">
            <StarOutlined />
            {formatNumber(repo.stargazers_count)}
          </span>
          {repo.forks_count > 0 && (
            <span className="repo-stat">
              <ForkOutlined />
              {formatNumber(repo.forks_count)}
            </span>
          )}
          {repo.watchers_count > 0 && (
            <span className="repo-stat">
              <EyeOutlined />
              {formatNumber(repo.watchers_count)}
            </span>
          )}
        </div>
      </div>

      <div className="card-footer">
        <a
          className="read-more"
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View Repository</span>
          <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </article>
  );
};

export default TrendingCard;
```

- [ ] **Step 3: Create `src/components/TrendingCard.css`**

```css
.project-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card:hover {
  transform: translateY(-8px);
  border-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.8);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .card-image img {
  transform: scale(1.05);
}

.card-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
}

.project-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.project-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.github-tag {
  background: rgba(246, 248, 250, 0.9);
  color: #1f2937;
}

.language-tag {
  background: rgba(59, 130, 246, 0.9);
  color: #ffffff;
}

.bookmark-container {
  display: flex;
}

.bookmark-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1f2937;
  text-decoration: none;
}

.bookmark-btn:hover {
  background: #60a5fa;
  color: #ffffff;
  transform: scale(1.1);
}

.rank-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 1;
}

.card-header {
  padding: 16px 20px 0;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.card-category {
  padding: 4px 12px;
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
  border-radius: 6px;
  font-weight: 600;
}

.card-date {
  margin-left: 10px;
  color: #64748b;
  font-size: 12px;
}

.card-content {
  padding: 16px 20px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.card-title a {
  color: #f1f5f9;
  text-decoration: none;
  transition: color 0.3s ease;
}

.card-title a:hover {
  color: #60a5fa;
}

.card-excerpt {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-info {
  margin-bottom: 12px;
}

.repo-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #60a5fa;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.repo-link:hover {
  color: #3b82f6;
}

.repo-link i:first-child {
  font-size: 16px;
}

.repo-link i:last-child {
  font-size: 12px;
}

.repo-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.repo-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.repo-stat .anticon {
  color: #f59e0b;
}

.card-footer {
  padding: 0 20px 20px;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #60a5fa;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.read-more:hover {
  color: #3b82f6;
  gap: 12px;
}
```

- [ ] **Step 4: Remove the now-duplicated card CSS from `src/pages/HomePage.css`**

Delete this exact block (currently `src/pages/HomePage.css:368-598`, everything from `.project-card {` through the closing brace of `.read-more:hover`, immediately before the `/* View More Button */` comment) — it now lives in `TrendingCard.css`:

```css
.project-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card:hover {
  transform: translateY(-8px);
  border-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.8);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .card-image img {
  transform: scale(1.05);
}

.card-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
}

.project-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.project-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.github-tag {
  background: rgba(246, 248, 250, 0.9);
  color: #1f2937;
}

.language-tag {
  background: rgba(59, 130, 246, 0.9);
  color: #ffffff;
}

.bookmark-container {
  display: flex;
}

.bookmark-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1f2937;
  text-decoration: none;
}

.bookmark-btn:hover {
  background: #60a5fa;
  color: #ffffff;
  transform: scale(1.1);
}

.card-header {
  padding: 16px 20px 0;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.card-category {
  padding: 4px 12px;
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
  border-radius: 6px;
  font-weight: 600;
}

.card-date {
  margin-left: 10px;
  color: #64748b;
  font-size: 12px;
}

.card-content {
  padding: 16px 20px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.card-title a {
  color: #f1f5f9;
  text-decoration: none;
  transition: color 0.3s ease;
}

.card-title a:hover {
  color: #60a5fa;
}

.card-excerpt {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-info {
  margin-bottom: 12px;
}

.repo-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #60a5fa;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.repo-link:hover {
  color: #3b82f6;
}

.repo-link i:first-child {
  font-size: 16px;
}

.repo-link i:last-child {
  font-size: 12px;
}

.repo-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.repo-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.repo-stat .anticon {
  color: #f59e0b;
}

.card-footer {
  padding: 0 20px 20px;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #60a5fa;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.read-more:hover {
  color: #3b82f6;
  gap: 12px;
}
```

Leave `.loading-container`, `.loading-spinner`, `@keyframes spin`, `.projects-grid`, and everything from `/* View More Button */` onward untouched in `HomePage.css` — they're still used directly by `HomePage.jsx`'s own JSX (the grid layout and loading state aren't part of what moved).

- [ ] **Step 5: Update `src/pages/HomePage.jsx` to use the extracted pieces**

Replace the import block at the top of the file:

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadLatestCSV, transformCSVData } from '../utils/csvLoader';
import { formatNumber } from '../utils/formatNumber';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrendingCard from '../components/TrendingCard';
import './HomePage.css';
```

(This removes the `StarOutlined, ForkOutlined, EyeOutlined` import — those now live inside `TrendingCard.jsx` — and adds the `formatNumber` and `TrendingCard` imports.)

Remove the local `formatNumber` function (currently right after `loadTrendingRepos`):

```jsx
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };
```

Replace the entire `<div className="projects-grid">...</div>` block (the one containing the `<article className="project-card">...` markup) with:

```jsx
            <div className="projects-grid">
              {repos.map((repo, index) => (
                <TrendingCard key={repo.id} repo={repo} index={index} />
              ))}
            </div>
```

- [ ] **Step 6: Verify the build succeeds and the homepage is visually unchanged**

Run: `npm run build`
Expected: build succeeds with no errors (this catches missing imports, JSX typos, and broken CSS references).

Run: `npm run dev`, open `http://localhost:5173/` in a browser, and confirm the "Trending Repositories" grid section renders exactly as before (same card layout, images, tags, stats, "View Repository" links) — there should be no `rank` badges visible here since `HomePage.jsx` doesn't pass a `rank` prop.

- [ ] **Step 7: Commit**

```bash
git add src/utils/formatNumber.js src/components/TrendingCard.jsx src/components/TrendingCard.css src/pages/HomePage.jsx src/pages/HomePage.css
git commit -m "refactor: extract TrendingCard component from HomePage"
```

---

### Task 2: Generalize `csvLoader.loadLatestCSV` for weekly/monthly subdirectories

**Files:**
- Modify: `src/utils/csvLoader.js`
- Modify: `src/pages/HomePage.jsx` (one call site, to match the new return shape)

**Interfaces:**
- Consumes: nothing new from Task 1.
- Produces: `loadLatestCSV(subdir = '', maxDaysBack = 30): Promise<{ data: Array<object>, date: string | null }>` — `data` is the parsed CSV rows (same row shape as before, ready for `transformCSVData`), `date` is the `YYYY-MM-DD` string of the snapshot that was actually found (or `null` if none was found within `maxDaysBack`). This is a breaking change to the previous bare-array return, fully absorbed within this task's two call sites (there are only two in the whole codebase: `HomePage.jsx` today, and `TrendingPeriodPage.jsx` in Task 3, which is written against this new contract from the start).

- [ ] **Step 1: Replace `loadLatestCSV` in `src/utils/csvLoader.js`**

Current (`src/utils/csvLoader.js:6-45`):

```js
export const loadLatestCSV = async () => {
  try {
    // Try to load the most recent date
    const today = new Date();
    const dates = [];

    // Try last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(dateStr);
    }

    // Try to load the first available CSV from GitHub
    for (const dateStr of dates) {
      try {
        // Extract year and month from date string (YYYY-MM-DD)
        const year = dateStr.split('-')[0];
        const month = dateStr.split('-')[1];
        // Build path with year/month folder structure: docs/YYYY/MM/YYYY-MM-DD.csv
        const csvUrl = `${GITHUB_RAW_URL}/${year}/${month}/${dateStr}.csv`;
        const csvResponse = await fetch(csvUrl);
        if (csvResponse.ok) {
          const csvText = await csvResponse.text();
          const parsedData = parseCSV(csvText);
          if (parsedData.length > 0) {
            console.log(`✅ Loaded data from ${year}/${month}/${dateStr}.csv (${parsedData.length} repos)`);
            return parsedData;
          }
        }
      } catch (err) {
        // Continue to next date
        continue;
      }
    }

    throw new Error('No CSV files found in the last 30 days');
  } catch (error) {
    console.error('Error loading CSV from GitHub:', error);
    return [];
  }
};
```

New:

```js
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

Leave `parseCSV`, `parseCSVLine`, and `transformCSVData` in this file completely unchanged.

- [ ] **Step 2: Update `HomePage.jsx`'s call site for the new return shape**

In `src/pages/HomePage.jsx`'s `loadTrendingRepos`, change:

```jsx
      // Load from CSV files
      const csvData = await loadLatestCSV();
      const transformedData = transformCSVData(csvData);
```

to:

```jsx
      // Load from CSV files
      const { data: csvData } = await loadLatestCSV();
      const transformedData = transformCSVData(csvData);
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:5173/`, confirm the homepage's "Trending Repositories" section still loads and displays repos exactly as before (this exercises the new `loadLatestCSV('', 30)` default-argument path against the real, already-committed `docs/YYYY/MM/*.csv` files).

- [ ] **Step 4: Commit**

```bash
git add src/utils/csvLoader.js src/pages/HomePage.jsx
git commit -m "feat: generalize loadLatestCSV for weekly/monthly subdirectories"
```

---

### Task 3: Build the shared `TrendingPeriodPage` shell and the Weekly/Monthly pages

**Files:**
- Create: `src/components/TrendingPeriodPage.jsx`
- Create: `src/components/TrendingPeriodPage.css`
- Create: `src/pages/WeeklyPage.jsx`
- Create: `src/pages/MonthlyPage.jsx`

**Interfaces:**
- Consumes: `loadLatestCSV(subdir, maxDaysBack)` and `transformCSVData` from Task 2 (`src/utils/csvLoader.js`); `formatNumber` from Task 1 (`src/utils/formatNumber.js`); `<TrendingCard repo index rank />` from Task 1 (`src/components/TrendingCard.jsx`); `Header`/`Footer` from `src/components/Header.jsx` / `src/components/Footer.jsx` (unchanged, existing components).
- Produces: `<TrendingPeriodPage title={string} windowDescription={string} csvSubdir={string} maxDaysBack={number} />` from `src/components/TrendingPeriodPage.jsx`, consumed by Task 4's routes via `WeeklyPage`/`MonthlyPage`.

- [ ] **Step 1: Create `src/components/TrendingPeriodPage.jsx`**

```jsx
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvSubdir, maxDaysBack]);

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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const languageCount = new Set(repos.map(repo => repo.language).filter(Boolean)).size;

  return (
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
            <div className="period-scroll-row">
              {repos.map((repo, index) => (
                <TrendingCard key={repo.id} repo={repo} index={index} rank={index + 1} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrendingPeriodPage;
```

- [ ] **Step 2: Create `src/components/TrendingPeriodPage.css`**

```css
.trending-period-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #e5e7eb;
  background: #0f172a;
  min-height: 100vh;
}

.period-main {
  max-width: 1400px;
  margin: 0 auto;
}

.period-hero {
  padding: 140px 24px 40px;
  background: radial-gradient(circle at 15% 0%, rgba(59, 130, 246, 0.18), transparent 55%);
}

.period-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.period-title {
  font-size: 36px;
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 12px;
}

.period-description {
  color: #94a3b8;
  font-size: 15px;
  max-width: 640px;
  margin: 0 0 28px;
}

.period-stats {
  display: flex;
  gap: 40px;
}

.period-stat {
  display: flex;
  flex-direction: column;
}

.period-stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #f1f5f9;
}

.period-stat-label {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.period-content {
  padding-bottom: 40px;
}

.loading-container {
  text-align: center;
  padding: 80px 24px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(148, 163, 184, 0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.period-scroll-row {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 8px 24px 16px;
  scroll-snap-type: x proximity;
}

.period-scroll-row::-webkit-scrollbar {
  height: 6px;
}

.period-scroll-row::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}

.period-scroll-row .project-card {
  flex: 0 0 340px;
  scroll-snap-align: start;
}

.period-empty {
  text-align: center;
  padding: 80px 24px;
  color: #94a3b8;
  font-size: 15px;
}

@media (max-width: 640px) {
  .period-hero {
    padding: 120px 16px 32px;
  }

  .period-title {
    font-size: 28px;
  }

  .period-stats {
    gap: 24px;
  }
}
```

- [ ] **Step 3: Create `src/pages/WeeklyPage.jsx`**

```jsx
import React from 'react';
import TrendingPeriodPage from '../components/TrendingPeriodPage';

const WeeklyPage = () => (
  <TrendingPeriodPage
    title="Weekly Trending Repositories"
    windowDescription="Top 20 repos created in the last 30 days, ranked by stars — refreshed every Monday."
    csvSubdir="weekly"
    maxDaysBack={60}
  />
);

export default WeeklyPage;
```

- [ ] **Step 4: Create `src/pages/MonthlyPage.jsx`**

```jsx
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
```

- [ ] **Step 5: Verify the build succeeds**

Run: `npm run build`
Expected: build succeeds with no errors. (These two pages aren't routable yet — that's Task 4 — so this step only confirms they compile cleanly.)

- [ ] **Step 6: Commit**

```bash
git add src/components/TrendingPeriodPage.jsx src/components/TrendingPeriodPage.css src/pages/WeeklyPage.jsx src/pages/MonthlyPage.jsx
git commit -m "feat: add shared TrendingPeriodPage shell and Weekly/Monthly pages"
```

---

### Task 4: Wire up routes and navigation

**Files:**
- Modify: `src/NewApp.jsx`
- Modify: `src/components/Header.jsx`

**Interfaces:**
- Consumes: `WeeklyPage` from `src/pages/WeeklyPage.jsx` and `MonthlyPage` from `src/pages/MonthlyPage.jsx` (Task 3).

- [ ] **Step 1: Add routes in `src/NewApp.jsx`**

Current:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubscriptionPage from './pages/SubscriptionPage';
import DemoPage from './pages/DemoPage';
import './NewApp.css';

const NewApp = () => {
  return (
    <Router>
      <div className="new-app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscribe" element={<SubscriptionPage />} />
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default NewApp;
```

New:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubscriptionPage from './pages/SubscriptionPage';
import DemoPage from './pages/DemoPage';
import WeeklyPage from './pages/WeeklyPage';
import MonthlyPage from './pages/MonthlyPage';
import './NewApp.css';

const NewApp = () => {
  return (
    <Router>
      <div className="new-app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscribe" element={<SubscriptionPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/weekly" element={<WeeklyPage />} />
          <Route path="/monthly" element={<MonthlyPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default NewApp;
```

- [ ] **Step 2: Add nav links in `src/components/Header.jsx`**

Current `nav-links` block:

```jsx
        <div className="nav-links">
          <a
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a
            className={`nav-link ${isActive('/demo') ? 'active' : ''}`}
            onClick={() => navigate('/demo')}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Live Demo</span>
          </a>
          <a
            className={`nav-link ${isActive('/subscribe') ? 'active' : ''}`}
            onClick={() => navigate('/subscribe')}
          >
            <i className="fas fa-envelope"></i>
            <span>Subscribe</span>
          </a>
          <a
            className="github-star-btn"
            href="https://github.com/encoreshao/github-trending"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StarOutlined className="star-icon" />
            <span>Star on GitHub</span>
          </a>
        </div>
```

New:

```jsx
        <div className="nav-links">
          <a
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a
            className={`nav-link ${isActive('/weekly') ? 'active' : ''}`}
            onClick={() => navigate('/weekly')}
          >
            <i className="fas fa-calendar-week"></i>
            <span>Weekly</span>
          </a>
          <a
            className={`nav-link ${isActive('/monthly') ? 'active' : ''}`}
            onClick={() => navigate('/monthly')}
          >
            <i className="fas fa-calendar-alt"></i>
            <span>Monthly</span>
          </a>
          <a
            className={`nav-link ${isActive('/demo') ? 'active' : ''}`}
            onClick={() => navigate('/demo')}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Live Demo</span>
          </a>
          <a
            className={`nav-link ${isActive('/subscribe') ? 'active' : ''}`}
            onClick={() => navigate('/subscribe')}
          >
            <i className="fas fa-envelope"></i>
            <span>Subscribe</span>
          </a>
          <a
            className="github-star-btn"
            href="https://github.com/encoreshao/github-trending"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StarOutlined className="star-icon" />
            <span>Star on GitHub</span>
          </a>
        </div>
```

- [ ] **Step 3: Verify end-to-end**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, then in a browser:
- Visit `http://localhost:5173/weekly` — confirm the hero shows "Last updated: <a real date>", the three stats (Repos/Total Stars/Languages) are populated, and a horizontally-scrollable row of 20 ranked cards (#1-#20) renders using the real data already committed under `docs/weekly/`.
- Visit `http://localhost:5173/monthly` — same check against `docs/monthly/`.
- Confirm the header's "Weekly" and "Monthly" nav links are highlighted (`active` style) only on their respective routes.
- Revisit `http://localhost:5173/` and confirm the homepage is unaffected.

- [ ] **Step 4: Commit**

```bash
git add src/NewApp.jsx src/components/Header.jsx
git commit -m "feat: add /weekly and /monthly routes and nav links"
```

---

## Self-Review Notes

- **Spec coverage:** shared card extraction with rank prop (Task 1) ✓, csvLoader generalization with subdir + scaled lookback windows (Task 2) ✓, shared parameterized page shell + thin wrapper pages (Task 3) ✓, routes + nav (Task 4) ✓, "Last updated" badge reflecting the actual snapshot date rather than today (Task 3) ✓, single horizontal scroll row of all 20 cards (Task 3 CSS) ✓, empty/loading states (Task 3) ✓.
- **Simplification from the spec's sketch:** the design doc's props list for the shared page component included `period` and `badgeLabel`; the implementation drops both as redundant — `csvSubdir`/`title` already fully determine behavior, and the approved wording decision made the badge a dynamic "Last updated: <date>" rather than a static label, so `badgeLabel` had no use. Noted here since it's a deviation from the spec text, though not a scope change.
- **Placeholder scan:** none — every step has literal, complete code and exact verification commands.
- **Type/name consistency:** `loadLatestCSV(subdir, maxDaysBack) → { data, date }` is defined once in Task 2 and consumed identically in Task 3; `TrendingCard`'s `{ repo, index, rank }` props are defined in Task 1 and consumed identically in Task 3; `TrendingPeriodPage`'s `{ title, windowDescription, csvSubdir, maxDaysBack }` props are defined in Task 3 and consumed identically by `WeeklyPage`/`MonthlyPage` in the same task and routed in Task 4.
