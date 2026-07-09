# GitHub Trending

> Discover and analyze trending GitHub repositories with a beautiful, modern interface.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)

**[Live Demo](https://github.ranbot.online)** · **[Report Bug](https://github.com/encoreshao/github-trending/issues)** · **[Request Feature](https://github.com/encoreshao/github-trending/issues)**

[English](README.md) | [中文](README-zh.md)

---

## Overview

A modern web application for discovering trending GitHub repositories. Features real-time data fetching, multiple view modes, export capabilities, and a sleek dark theme interface.

### Key Features

| Feature | Description |
|---------|-------------|
| **Real-time Data** | Live GitHub API integration for trending repositories |
| **Dual View Modes** | Table view for data analysis, Card view for visual browsing |
| **Smart Filtering** | Filter by categories, keywords, and 20+ attributes |
| **Weekly & Monthly Snapshots** | Curated top-20 pages refreshed on a rolling schedule, with week-over-week/month-over-month comparisons |
| **Personalized Subscriptions** | Pick topics of interest and submit them straight to a Google Sheet |
| **Export Options** | Download as CSV, JSON, or copy to clipboard |
| **Dark Theme** | Modern glassmorphism design with smooth animations |
| **Bilingual** | Full English and Chinese language support |

---

## Quick Start

### Prerequisites

- Node.js 16+
- GitHub Personal Access Token ([Get one here](https://github.com/settings/tokens))

### Installation

```bash
# Clone the repository
git clone https://github.com/encoreshao/github-trending.git
cd github-trending

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Using the App

1. Navigate to **Live Demo** (`/demo`)
2. Enter your GitHub token in the Settings panel
3. Select the fields you want to display
4. Click **Fetch Data** to load trending repositories
5. Switch between Table and Card views
6. Export your data as needed

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with feature highlights |
| `/demo` | Interactive repository analysis tool |
| `/weekly` | Top 20 repos created in the last 30 days, refreshed every Monday |
| `/monthly` | Top 20 repos created in the last 90 days, refreshed on the 1st of each month |
| `/subscribe` | Category-based subscription setup, submits to Google Sheets |
| `*` | Custom 404 page for unmatched or explicitly blocked routes (see `src/blockedRoutes.js`) |

---

## Tech Stack

- **Frontend:** React 18, Vite, Ant Design 5
- **Styling:** CSS3 with glassmorphism effects
- **API:** GitHub REST API
- **Data:** axios, papaparse, file-saver

---

## Project Structure

```
src/
├── api/                 # GitHub API + Google Sheets integration
├── components/          # Reusable UI components
│   ├── Header           # Navigation bar
│   ├── Footer           # Site footer
│   ├── RepoTable        # Table view component
│   ├── RepoCard         # Card view component
│   ├── TrendingPeriodPage # Shared shell for Weekly/Monthly pages
│   └── Settings         # Configuration panel
├── pages/               # Route pages
│   ├── HomePage
│   ├── DemoPage
│   ├── WeeklyPage
│   ├── MonthlyPage
│   ├── SubscriptionPage
│   └── NotFoundPage
├── blockedRoutes.js     # Paths to force through the 404 page
├── locales/             # i18n translations
└── utils/               # Helper functions
```

---

## CLI Script (Optional)

For automated data collection:

```bash
# Set up environment
echo "GITHUB_TOKEN=your_token" > .env

# Run the script for a given period (defaults to daily)
node index.js --period=daily
node index.js --period=weekly
node index.js --period=monthly

# or via npm
npm run trending:daily
npm run trending:weekly
npm run trending:monthly
```

Each period saves a JSON + CSV snapshot named by the period's start date:

| Period | Output path | Filename |
|--------|-------------|----------|
| `daily` | `docs/YYYY/MM/` | `YYYY-MM-DD` (today) |
| `weekly` | `docs/weekly/YYYY/MM/` | `YYYY-MM-DD` (Monday of the current ISO week) |
| `monthly` | `docs/monthly/YYYY/` | `YYYY-MM` (current month) |

### Automate with Cron

```bash
# Daily at 9 AM
0 9 * * * cd /path/to/github-trending && npm run trending:daily

# Weekly, Monday at 9 AM
0 9 * * 1 cd /path/to/github-trending && npm run trending:weekly

# Monthly, 1st of the month at 9 AM
0 9 1 * * cd /path/to/github-trending && npm run trending:monthly
```

Ready-made wrappers for each cadence also live in `scripts/` (`run.sh`, `run-weekly.sh`, `run-monthly.sh`).

---

## Configuration

### Web App Settings

Settings are automatically saved in localStorage:

- **GitHub Token** - Your personal access token (stored locally)
- **Display Fields** - Choose from 20+ repository attributes
- **Page Size** - Number of repos per page (1-100)
- **Language** - English or Chinese

### Subscribe → Google Sheets

The `/subscribe` form posts submissions to a Google Apps Script Web App, which appends them to a Google Sheet. Set the webhook URL in `.env`:

```bash
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
```

See `docs/subscribe-google-sheets-setup.md` (local-only, not tracked in git) for the Apps Script deployment steps. Without this variable set, submissions fail with a clear error instead of silently doing nothing.

### Available Fields

| Basic | URLs | Dates | Stats |
|-------|------|-------|-------|
| Name | HTML URL | Created | Stars |
| Owner | Git URL | Updated | Forks |
| Avatar | SSH URL | Pushed | Issues |
| Description | Clone URL | | Size |
| Topics | SVN URL | | Language |
| License | Homepage | | |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Rate limit exceeded** | Ensure valid GitHub token with `public_repo` scope |
| **No data returned** | Verify token and network connectivity |
| **Build errors** | Run `rm -rf node_modules && npm install` |

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/encoreshao">RanBOT Labs</a>
</p>
