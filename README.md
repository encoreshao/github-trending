# GitHub Trending Toolkit - Weekly Trending Repositories (2025 Active)

A toolkit for fetching and displaying GitHub Trending Weekly repositories, featuring both a Node.js CLI script and a modern React web tool.

---

## Features
- **Node.js Script**: Fetches top 20 trending GitHub repositories created in the last week, saves data as Markdown, JSON, and CSV. Can be automated via cron.
- **Web Tool (React + Ant Design)**: Interactive web UI for fetching, viewing, selecting, exporting, and copying trending repositories. Customizable fields and export formats.

---

## Quick Start: Web Tool

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
3. **Open your browser**
   Visit [http://localhost:5173](http://localhost:5173)

### Build for Production (Web Tool)
```bash
npm run build
```

---

## Quick Start: Node.js Script

1. **Set up your environment**
   - Create a `.env` file in the project root:
     ```env
     GITHUB_TOKEN=your_github_token
     ```
2. **Run the script manually**
   ```bash
   node index.js
   ```
   - Trending data will be saved in the `docs/` directory as Markdown, JSON, and CSV files.
3. **(Optional) Automate with cron**
   - Set up a cron job to run the script daily for automated trending data collection.

---

## Tech Stack
- Node.js (CLI script)
- React 18, Ant Design 5, Vite (Web Tool)
- axios, file-saver, papaparse, react-copy-to-clipboard

---

## Project Structure
- `index.js` — Node.js trending fetcher script
- `src/components` — Web tool UI components
- `src/api` — Web tool API logic
- `src/utils` — Utility functions (if needed)
- `src/App.jsx` — Web tool main layout
- `docs/` — Output directory for trending data (Node.js script)

---

## Usage Notes
- **GitHub Token**: Both the script and web tool require a GitHub Personal Access Token to avoid rate limits.
- **Web Tool**: Use the left panel to input your token and select fields. The right panel displays and exports data.
- **Node.js Script**: Outputs Markdown, JSON, and CSV files for archival or further processing.

---

## Customization
- **Web Tool**: Edit `src/components/AttributeSelector.jsx` to change selectable fields. Extend `src/api/github.js` for more API logic.
- **Node.js Script**: Edit `index.js` to change output formats or fields.

---

## License
Github-Trending is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
