# Weekly & Monthly Trending Pages — Design

Date: 2026-07-04

## Problem

The backend now generates weekly and monthly trending snapshots (`docs/weekly/YYYY/MM/YYYY-MM-DD.{json,csv}` and `docs/monthly/...`, see `docs/superpowers/specs/2026-07-04-weekly-monthly-trending-design.md`), but nothing on the site surfaces them. The homepage only shows the latest daily snapshot. We need dedicated pages for weekly and monthly trending, visually distinct and more information-dense than a plain list, and consistent with the rest of the site's look.

## Approach

Reuse the site's existing data-loading pattern (`src/utils/csvLoader.js`'s `loadLatestCSV`, which already walks backward from today looking for the newest committed CSV under `docs/`) and its existing rich card content (the "project-card" markup already built for `HomePage.jsx`, showing each repo's real GitHub social-preview banner image, language tag, description, stats, and a CTA). Generalize both around a `period` concept — the same shape the backend's `index.js` already uses — instead of writing two near-duplicate pages from scratch.

Layout: each page is a page-level hero (title, "Last updated" badge, a short window description, and repo/star/language stats) followed by a single horizontal scroll row containing all 20 repos as rich cards, ranked #1-20, in the site's dark/glassmorphism palette (navy `#0f172a` background, blue accent `#60a5fa`/`#3b82f6`). This was validated interactively with the user via mockups (see below) before being written up.

## Visual reference

Mockups were reviewed live in the brainstorming visual companion; the approved direction is card layout "A — Single rich scroll row" from `page-structure-v3.html`: each card has an OG banner image with a language tag and numbered rank badge, a title linking to the repo, a description excerpt, a meta row (`owner/repo` + created date), a stats row (stars/forks/watchers), and a "View Repository →" CTA — all in a single horizontally-scrolling row of 20 cards, not a grid and not a multi-row hybrid. The page hero above the row shows a "Last updated: <date>" badge (not a week-range badge, since the window is a rolling 30/90-day lookback, not a literal calendar week) plus a one-line description of the window and cadence, and a small stats row (repo count / total stars / distinct language count for that snapshot).

## Components

**`src/utils/csvLoader.js` (modify)**
- `loadLatestCSV(subdir = '')` gains a `subdir` parameter. Path construction becomes `docs/<subdir>/<year>/<month>/<date>.csv` when `subdir` is non-empty, else the existing `docs/<year>/<month>/<date>.csv` (unchanged for the homepage's existing daily call site).
- The backward-search window becomes a parameter too: `loadLatestCSV(subdir, maxDaysBack)`, defaulting such that existing daily calls keep searching 30 days back with no call-site changes needed beyond adding the new page call sites. Weekly pages call with `maxDaysBack = 60` (job runs ~weekly; double the cadence as a missed-run buffer), monthly with `maxDaysBack = 180` (job runs ~monthly; same doubling logic).
- `transformCSVData` is unchanged — already produces the shape `TrendingCard` and the homepage both consume.

**`src/components/TrendingCard.jsx` (new — extracted from `HomePage.jsx`)**
- Moves the existing inline `<article className="project-card">` block (OG image with language tag overlay, bookmark/external-link button, card-meta category+date, card-title, card-excerpt, repo-info link, repo-stats, card-footer CTA) out of `HomePage.jsx` into its own component.
- Adds one new optional prop, `rank` (number). When present, renders a numbered badge over the card image (top-right, matching the mockup's `.rank-badge` treatment); when absent, the card renders exactly as it does today on the homepage — this is additive, not a behavior change for the existing homepage grid.
- `HomePage.jsx` is updated to render `<TrendingCard repo={repo} .../>` in its `projects-grid` instead of the inline JSX. No visual change to the homepage.

**`src/components/TrendingPeriodPage.jsx` (new)**
- Shared page shell used by both new pages. Props: `{ period, title, badgeLabel, windowDescription, csvSubdir, maxDaysBack }`.
- Renders: `Header`, a hero section (badge with `Last updated: <date-of-loaded-snapshot>`, `title`, `windowDescription`, a stats row computed from the loaded repos — count, total stars formatted like the homepage's `formatNumber`, distinct language count), a horizontal scroll row of up to 20 `TrendingCard`s with `rank={index + 1}`, a loading state (spinner, matching `HomePage`'s `loading-container` styling), an empty state (shown if `loadLatestCSV` finds nothing within `maxDaysBack` — message explaining no snapshot has been generated yet for this period), and `Footer`.
- Data loading: on mount, calls `loadLatestCSV(csvSubdir, maxDaysBack)` then `transformCSVData`, mirroring `HomePage.jsx`'s existing `loadTrendingRepos` pattern (same try/catch/finally shape, same `setLoading`/`setRepos` state pattern) — no new data-fetching approach introduced.

**`src/pages/WeeklyPage.jsx` (new)**
```jsx
<TrendingPeriodPage
  period="weekly"
  title="Weekly Trending Repositories"
  badgeLabel="Weekly"
  windowDescription="Top 20 repos created in the last 30 days, ranked by stars — refreshed every Monday."
  csvSubdir="weekly"
  maxDaysBack={60}
/>
```

**`src/pages/MonthlyPage.jsx` (new)**
```jsx
<TrendingPeriodPage
  period="monthly"
  title="Monthly Trending Repositories"
  badgeLabel="Monthly"
  windowDescription="Top 20 repos created in the last 90 days, ranked by stars — refreshed on the 1st of each month."
  csvSubdir="monthly"
  maxDaysBack={180}
/>
```

**`src/NewApp.jsx` (modify)**
- Add two routes: `<Route path="/weekly" element={<WeeklyPage />} />` and `<Route path="/monthly" element={<MonthlyPage />} />`.

**`src/components/Header.jsx` (modify)**
- Add two direct nav links between Home and Live Demo: Weekly (`/weekly`) and Monthly (`/monthly`), following the exact existing `nav-link`/`isActive` pattern already used for Home/Live Demo/Subscribe.

## Data flow

1. User navigates to `/weekly` (or `/monthly`).
2. `TrendingPeriodPage` mounts, calls `loadLatestCSV('weekly', 60)` (or `'monthly', 180`).
3. `loadLatestCSV` walks backward day-by-day from today (existing logic, unchanged) fetching `https://raw.githubusercontent.com/encoreshao/github-trending/main/docs/weekly/YYYY/MM/YYYY-MM-DD.csv` until it finds one that parses to non-empty data, or exhausts `maxDaysBack`.
4. `transformCSVData` (unchanged) maps CSV rows to the repo object shape `TrendingCard` expects.
5. `TrendingPeriodPage` renders the hero stats and the scroll row of `TrendingCard`s.

## Error handling

Mirrors `HomePage.jsx`'s existing pattern exactly: `loadLatestCSV` catches its own errors and returns `[]` (already implemented, unchanged); `TrendingPeriodPage` wraps its load call in try/catch/finally, sets `repos` to `[]` on error, and always clears the loading state. No new error-handling machinery.

## Testing

- No test framework exists in this repo (see the backend design spec's equivalent note); verification is manual: visit `/weekly` and `/monthly` in the dev server, confirm the hero, stats, and scroll row render with real data from the already-generated `docs/weekly/` and `docs/monthly/` snapshots, confirm cards are ranked 1-20, confirm the homepage's grid still renders unchanged after `TrendingCard` extraction, confirm nav links highlight correctly on each route.

## Out of scope

- Filtering, sorting, table/card view toggle, or CSV/JSON export on the new pages (the user explicitly chose the lighter "story scroll" experience over the full `/demo` toolset).
- Changing the backend's query windows, output paths, or cron schedule (already implemented and out of scope for this frontend-only spec).
- A shared period switcher/tabs UI — the user chose separate routes over a single tabbed page.
- Any change to `/demo`'s live-token-based fetch flow.
