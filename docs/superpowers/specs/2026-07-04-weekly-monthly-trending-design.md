# Weekly & Monthly Trending Jobs — Design

Date: 2026-07-04

## Problem

The project has a daily cron job (`scripts/run.sh` → `index.js`) that queries the
GitHub Search API for repos created in the last 7 days, sorted by stars, and
saves the top 20 to `docs/YYYY/MM/YYYY-MM-DD.{json,csv}`, then commits and
pushes to git. We need equivalent weekly and monthly jobs without duplicating
the fetch/save logic three times.

## Approach

Generalize `index.js` around a `period` concept instead of writing three
separate scripts. Each period differs only in:
- how far back the `created:>=` query window looks, and
- where output files are written.

Everything else (top-20 limit, JSON/CSV shape, file-per-run naming by run
date) stays identical across periods.

```js
const PERIODS = {
  daily:   { daysBack: 7,  subdir: '' },
  weekly:  { daysBack: 30, subdir: 'weekly' },
  monthly: { daysBack: 90, subdir: 'monthly' },
};
```

`index.js` reads `--period=<daily|weekly|monthly>` from argv, defaulting to
`daily` — so the existing crontab entry (`node index.js`, no args) keeps
working unmodified.

Output paths:
- `daily`   → `docs/YYYY/MM/YYYY-MM-DD.{json,csv}` (unchanged, existing path)
- `weekly`  → `docs/weekly/YYYY/MM/YYYY-MM-DD.{json,csv}`
- `monthly` → `docs/monthly/YYYY/MM/YYYY-MM-DD.{json,csv}`

Files are named by the date the job actually ran (not a week/month label),
keeping naming consistent across all three periods and avoiding ISO-week
edge cases.

The two dead, commented-out markdown-export functions (`saveReposToMarkdown`,
`saveReposToTableInMarkdown`) are removed as part of this refactor since
they're unused and add noise to the file being restructured.

## Components

**`index.js` (tracked in git)**
- Parses `--period` from `process.argv` (default `daily`).
- Looks up `{ daysBack, subdir }` from `PERIODS`; unknown period → error and exit.
- Computes the `created:>=` cutoff as `today - daysBack` days.
- Computes `dateDir` as `./docs/<subdir>/<year>/<month>` (subdir omitted when empty, i.e. daily).
- Calls the existing `saveReposToJson` / `saveReposToCsv`, unchanged.

**`package.json` scripts**
```json
"trending:daily": "node index.js --period=daily",
"trending:weekly": "node index.js --period=weekly",
"trending:monthly": "node index.js --period=monthly"
```
These are the documented, testable entry points (also runnable ad hoc for
backfills or manual checks).

**`scripts/run-weekly.sh`, `scripts/run-monthly.sh`** (local-only, gitignored
like existing `scripts/run.sh` — these contain machine-specific absolute
paths and shouldn't be tracked)
- Same shape as `scripts/run.sh`: cd into project dir, run the npm script,
  `git add docs/weekly/*` or `docs/monthly/*`, commit with a period-specific
  message, push to `main`.
- Weekly commit message: `Auto-generated docs: Weekly Trending GitHub Repositories for <date>`
- Monthly commit message: `Auto-generated docs: Monthly Trending GitHub Repositories for <date>`

**Cron** (user's local crontab, not managed by this repo)
- Weekly: run once a week (Monday), e.g. `05 10 * * 1 .../scripts/run-weekly.sh >> .../tmp/log.txt 2>&1`
- Monthly: run on the 1st of the month, e.g. `10 10 1 * * .../scripts/run-monthly.sh >> .../tmp/log.txt 2>&1`
- These lines will be handed to the user to add via `crontab -e`, or run on
  their behalf if they ask — crontab is system state outside the repo and
  won't be modified without explicit confirmation.

## Data flow

1. Cron fires `run-<period>.sh` on its schedule.
2. Shell script runs `npm run trending:<period>`.
3. `index.js` queries GitHub Search API with the period's date window, top 20 by stars.
4. Results saved as JSON + CSV under the period's output path.
5. Shell script `git add`s only that period's docs subtree, commits, pushes.

## Error handling

Unchanged from current behavior: the GitHub API call is wrapped in
try/catch and errors are logged to console (and thus to `tmp/log.txt` via
cron redirection); no retry logic is introduced, matching the existing
daily job's behavior.

## Testing

- Manual run: `npm run trending:weekly` / `npm run trending:monthly` and
  inspect the generated files under `docs/weekly/` and `docs/monthly/`.
- Confirm `npm run trending:daily` (and plain `node index.js`, matching the
  existing crontab invocation) still writes to the original `docs/YYYY/MM/`
  path with no behavior change.
- No automated test suite exists in this repo today; none is being added,
  consistent with existing scope.

## Out of scope

- Changing the daily job's existing 7-day query window or output location.
- Aggregating/deduplicating across daily snapshots (weekly/monthly use fresh
  API queries, not local aggregation, per user decision).
- Modifying the user's crontab automatically.
- Any frontend/UI changes to surface weekly/monthly data.
