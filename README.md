# GitHub Trending - Discover the Most Popular Repositories

A modern, Apple-inspired web application for discovering and analyzing trending GitHub repositories. Features a beautiful homepage, subscription system, and live demo with comprehensive repository analysis tools.

**Languages / 语言**: [English](README.md) | [中文](README-zh.md)

---

## ✨ Features

### 🏠 **Modern Website Experience**
- **Apple-Style Design**: Clean, professional interface with smooth animations
- **Homepage**: Compelling landing page with feature highlights and call-to-actions
- **Subscription System**: Category-based subscription with 18+ technology categories
- **Live Demo**: Interactive demonstration of the trending repository analysis tool
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔍 **Repository Analysis Tool**
- **Real-time Data**: Fetch trending repositories with live GitHub API integration
- **Dual View Modes**: Table view for detailed data and Card view for visual browsing
- **Smart Filtering**: Advanced filtering by categories, keywords, and attributes
- **Export Capabilities**: Export data as CSV, JSON, or copy to clipboard
- **Customizable Fields**: Select from 20+ repository attributes to display
- **Bilingual Support**: Full English and Chinese language support

### 📊 **CLI Script (Legacy)**
- **Automated Fetching**: Fetches top 20 trending GitHub repositories
- **Multiple Output Formats**: Saves data as Markdown, JSON, and CSV files
- **Cron Automation**: Can be automated via cron for daily data collection

---

## 🚀 Quick Start

### Modern Web Application

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Explore the website**
   - **Homepage**: Visit [http://localhost:5173](http://localhost:5173) for the landing page
   - **Subscribe**: Navigate to `/subscribe` to choose your technology categories
   - **Live Demo**: Visit `/demo` to try the repository analysis tool

4. **Get a GitHub Token** (for demo functionality)
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Generate a new token with `public_repo` scope
   - Enter the token in the demo application

---

## 🌐 Website Structure

### 📄 **Pages**
- **`/`** - **Homepage**: Landing page with feature highlights and navigation
- **`/subscribe`** - **Subscription**: Category selection for personalized updates
- **`/demo`** - **Live Demo**: Interactive repository analysis tool

### 🎨 **Design System**
- **Apple-Inspired UI**: Clean typography, subtle animations, and professional color scheme
- **Consistent Button Style**: Transparent backgrounds with blue borders and hover effects
- **Responsive Layout**: Optimized for all screen sizes
- **Modern Icons**: Ant Design icon library with semantic meaning

### 🔧 **Technology Stack**
- **React 18** with Vite for fast development
- **React Router** for client-side navigation
- **Ant Design 5** for UI components
- **CSS Modules** for scoped styling
- **GitHub API** for real-time repository data

### Build for Production
```bash
npm run build
```

### Node.js CLI Script

1. **Set up your environment**
   - Create a `.env` file in the project root:
     ```env
     GITHUB_TOKEN=your_github_token
     ```

2. **Run the script**
   ```bash
   node index.js
   ```
   - Trending data will be saved in the `docs/YYYY/MM/` directory structure (e.g., `docs/2024/01/`) as Markdown, JSON, and CSV files
   - Year and month folders are automatically created if they don't exist

3. **Automate with cron** (Optional)
   ```bash
   # Add to crontab for daily execution at 9 AM
   0 9 * * * cd /path/to/github-trending && node index.js
   ```

---

## 🛠 Tech Stack

### Web Application
- **Frontend**: React 18, Ant Design 5, Vite
- **Styling**: CSS3 with modern grid layouts and responsive design
- **Data Processing**: axios, file-saver, papaparse, react-copy-to-clipboard
- **Build Tool**: Vite for fast development and optimized production builds

### Node.js Script
- **Runtime**: Node.js
- **HTTP Client**: axios
- **File System**: fs-extra
- **Data Processing**: json2csv
- **Environment**: dotenv

---

## 📁 Project Structure

```
github-trending/
├── src/
│   ├── components/
│   │   ├── AttributeSelector.jsx    # Field selection component
│   │   ├── RepoCardView.jsx         # Card view component
│   │   ├── RepoTable.jsx            # Table view component
│   │   ├── SettingsPanel.jsx       # Settings panel
│   │   └── TokenInput.jsx           # Token input component
│   ├── api/
│   │   └── github.js               # GitHub API integration
│   ├── App.jsx                     # Main application component
│   ├── App.css                     # Application styles
│   └── main.jsx                    # Application entry point
├── docs/                           # Output directory for CLI script
├── index.js                        # Node.js CLI script
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

---

## 🎯 Usage Guide

### Web Application Features

1. **Settings Panel** (Left Sidebar)
   - **GitHub Token**: Enter your personal access token
   - **Field Selection**: Choose which repository attributes to display
   - **Page Size**: Set number of repositories per page (1-100)
   - **Category Filter**: Filter by specific keywords or categories
   - **Language**: Switch between English and 中文

2. **Data Display** (Main Area)
   - **View Modes**: Toggle between Table and Card views
   - **Table View**: Detailed tabular data with sortable columns
   - **Card View**: Visual cards with repository information
   - **Export Options**: CSV, JSON, or copy to clipboard

3. **Available Fields**
   - Repository name, stars, owner, avatar
   - Description, topics, URLs (HTML, Git, SSH, Clone, SVN)
   - Creation/update/push dates
   - Size, language, forks, issues, license
   - Default branch and homepage

### Node.js Script Output

The CLI script generates three types of files organized by year and month in the `docs/YYYY/MM/` directory structure:

**File Organization:**
- Files are automatically organized into year/month folders (e.g., `docs/2024/01/`)
- Year and month folders are created automatically if they don't exist
- This keeps your data organized and makes it easier to find files by date

**Output Files:**

1. **Markdown Files** (`docs/YYYY/MM/YYYY-MM-DD.md` and `docs/YYYY/MM/YYYY-MM-DD-table.md`)
   - Detailed repository information
   - Table format for easy reading
   - Includes all metadata

2. **JSON File** (`docs/YYYY/MM/YYYY-MM-DD.json`)
   - Structured data for programmatic use
   - Selected fields only for efficiency

3. **CSV File** (`docs/YYYY/MM/YYYY-MM-DD.csv`)
   - Spreadsheet-compatible format
   - All repository fields included

---

## ⚙️ Configuration

### Web Application
- Settings are automatically saved in browser localStorage
- Token is stored securely (not transmitted to external servers)
- Field selections persist between sessions

### Node.js Script
- Configure via `.env` file
- Modify `index.js` to change output formats or fields
- Adjust date range by modifying `getLastWeekDate()` function

---

## 🔧 Customization

### Adding New Fields
1. **Web Application**: Edit `src/components/AttributeSelector.jsx`
2. **Node.js Script**: Modify the `fields` array in `saveReposToCsv()`

### Styling Changes
- **Web Application**: Modify `src/App.css` for custom styling
- **Card Layout**: Adjust grid settings in `.grid` class
- **Colors**: Update CSS custom properties

### API Modifications
- **Web Application**: Extend `src/api/github.js` for additional GitHub API endpoints
- **Node.js Script**: Modify the search query in `fetchTrendingRepos()`

---

## 📋 Requirements

- **Node.js**: Version 16 or higher
- **GitHub Token**: Personal Access Token with `public_repo` scope
- **Browser**: Modern browser with ES6+ support

---

## 🐛 Troubleshooting

### Common Issues

1. **Rate Limit Exceeded**
   - Ensure you have a valid GitHub token
   - Check token permissions include `public_repo` scope

2. **No Data Returned**
   - Verify your token is correct
   - Check network connectivity
   - Ensure repositories exist for the date range

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

---

## 📄 License

This project is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

---

## 🔗 Links

- **GitHub Repository**: [https://github.com/encoreshao/github-trending](https://github.com/encoreshao/github-trending)
- **Online Demo**: [https://github.ranbot.online](https://github.ranbot.online)
- **Issues**: [Report bugs or request features](https://github.com/encoreshao/github-trending/issues)
