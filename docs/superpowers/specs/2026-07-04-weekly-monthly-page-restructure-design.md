# Weekly & Monthly Page Restructure — Design

Date: 2026-07-04

## Problem

The `/weekly` and `/monthly` pages (built per `docs/superpowers/specs/2026-07-04-weekly-monthly-pages-design.md`) ship a hero (title, "Last updated" badge, 3 stat boxes) followed by a single horizontal scroll row of 20 ranked cards. After seeing it live, the user found the page feels "empty/thin" — too little content and visual interest given the available screen space. This spec adds substance without abandoning the approved scroll-row browsing pattern.

## Approach

Add two new sections, both computed from data already being loaded (no new API calls beyond one additional CSV fetch for the comparison feature):

1. **Insights row** between the hero title and the ranked list: a language-distribution breakdown and a "new since last snapshot" comparison badge, alongside the existing 3 stat boxes.
2. **Spotlight banner** above the ranked scroll row: a large featured card for the #1 repo, reusing the "full-bleed image spotlight" visual treatment already explored (and approved in concept) during the original page's mockup round.

The ranked scroll row itself is unchanged — still all 20 cards, #1 through #20 — so #1 appears both in the spotlight banner and in the row. This is a deliberate "featured + full list" pattern, not a bug: the banner sets the tone, the row remains the complete, consistently-ranked browsing surface.

## Components

**`src/utils/csvLoader.js` (modify)**
- Extract the day-walking search loop currently inside `loadLatestCSV` into an internal (not exported) helper, `tryLoadCSVFrom(subdir, startDate, maxDaysBack)`, which walks backward from `startDate` for `maxDaysBack` days looking for a non-empty CSV, returning `{ data, date }` or `{ data: [], date: null }`. This is a pure refactor — `loadLatestCSV`'s existing public signature and return shape (`{ data, date }`) don't change, and its behavior is identical (it calls the helper starting from today).
- Add `loadPreviousCSV(subdir = '', beforeDateStr, maxDaysBack = 30)`: if `beforeDateStr` is falsy, returns `{ data: [], date: null }` immediately (no previous snapshot to compare against). Otherwise calls `tryLoadCSVFrom` starting from the day *before* `beforeDateStr`, searching up to `maxDaysBack` further days back. Used to find the snapshot immediately preceding the one `TrendingPeriodPage` already loaded.

**`src/components/TrendingPeriodPage.jsx` (modify)**
- After loading the latest snapshot (`{ data, date }`), if `date` is non-null, also calls `loadPreviousCSV(csvSubdir, date, maxDaysBack)` to fetch the prior snapshot for comparison. This is a second, independent CSV fetch — not blocking the primary render; the comparison badge simply doesn't render until it resolves (or renders nothing if no prior snapshot exists, e.g. right after the very first run of a new period job).
- Computes language distribution from the current 20 repos: group by `language` (skipping repos with no language), count, sort descending by count, take the top 4 plus an "Other" bucket for the rest, express each as a percentage of 20.
- Computes the comparison count: the number of `full_name`s present in the current top 20 but absent from the previous top 20 (a `Set` difference) — rendered as "N new entries since the last snapshot." If there's no previous snapshot, this section doesn't render (not "0 new entries," which would misleadingly imply a comparison happened).
- Renders the new insights row and spotlight banner in the sections described below, using the existing `formatNumber` and the same `TrendingCard`-adjacent visual language (dark glass, blue accent) already established.

**`src/components/SpotlightBanner.jsx` (new)**
- A focused component taking a single `repo` prop (the #1 repo) and rendering the full-bleed image treatment: the repo's OG banner image as a background (`https://opengraph.githubassets.com/${id}/${full_name}`, same URL pattern `TrendingCard` already uses, with the same `.png` owner-avatar fallback on error), a dark gradient veil, a "🥇 #1" badge, title, description, and a stats row (stars/forks/watchers, reusing `formatNumber`). Clicking anywhere on the banner opens the repo (same `target="_blank"` pattern as everywhere else on the site).
- Kept as its own component (rather than inlined in `TrendingPeriodPage.jsx`) because it's a visually distinct, self-contained unit with its own image-loading/fallback logic — consistent with the existing `TrendingCard` extraction precedent.

**`src/components/TrendingPeriodPage.css` (modify)**
- New styles for `.period-insights` (the row containing the language breakdown, comparison badge, and existing stat boxes), `.language-breakdown` (chip row), and the banner's styles live in a new `SpotlightBanner.css` instead.
- Responsive: the insights row wraps to stacked sections on narrower viewports (matching the existing 968px/640px breakpoints), and the spotlight banner's height/font sizes scale down at the same breakpoints, consistent with how the rest of the page already handles responsiveness.

**`src/components/SpotlightBanner.css` (new)**
- Full-bleed background image, gradient veil, medal badge, title/description/stats overlay — following the same visual spec as the "A — Full-bleed image spotlight" mockup from the original page design (real OG image background, `linear-gradient` dark veil bottom-to-top, medal emoji, white text).

## Data flow

1. `TrendingPeriodPage` loads the latest snapshot via `loadLatestCSV(csvSubdir, maxDaysBack)` (unchanged from before).
2. If a snapshot was found, it also calls `loadPreviousCSV(csvSubdir, date, maxDaysBack)` to fetch the one before it.
3. Once both resolve (or the previous-snapshot call resolves to nothing), the page computes: language distribution (from current repos only), and the new-entries comparison (current vs. previous `full_name` sets).
4. Renders: hero → insights row (language breakdown + comparison badge + stat boxes) → spotlight banner (repo #1) → ranked scroll row (all 20, unchanged) → footer.

## Error handling

`loadPreviousCSV` follows the exact same try/catch/return-empty-on-failure pattern as `loadLatestCSV` — a failed or missing previous snapshot never blocks or errors the page, it just means the comparison badge doesn't render. No new error-handling machinery beyond what's already established.

## Testing

Still no test framework in this repo; verification is manual: `npm run build` after each change, then visiting `/weekly` and `/monthly` in the dev server to confirm the insights row, spotlight banner, and unchanged scroll row all render correctly with real data, and that the comparison badge gracefully doesn't appear if no previous snapshot exists yet for a period.

## Out of scope

- Historical trend charts beyond a single previous-vs-current comparison.
- Removing #1 from the scroll row (the featured+full-list duplication is intentional, per the approved design).
- Any change to the daily homepage or `/demo`.
