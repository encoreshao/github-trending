// Utility to load CSV data from GitHub repository
const GITHUB_REPO = 'encoreshao/github-trending';
const GITHUB_DOCS_PATH = 'docs';
const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${GITHUB_DOCS_PATH}`;

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

// Parse CSV text to JSON
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Get headers
  const headers = parseCSVLine(lines[0]);

  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }

  return data;
};

// Parse a single CSV line handling quoted values
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};

// Transform CSV data to match the API response format
export const transformCSVData = (csvData) => {
  return csvData.map(row => ({
    id: row.full_name?.replace('/', '-') || Math.random().toString(),
    full_name: row.full_name || '',
    name: row.full_name?.split('/')[1] || '',
    owner: {
      login: row['owner.login'] || row.full_name?.split('/')[0] || '',
      avatar_url: row['owner.avatar_url'] || `https://github.com/${row.full_name?.split('/')[0]}.png`
    },
    html_url: row.html_url || '',
    description: row.description || '',
    stargazers_count: parseInt(row.stargazers_count) || 0,
    forks_count: parseInt(row.forks_count) || 0,
    watchers_count: parseInt(row.forks_count) || 0,
    language: row.language || '',
    created_at: row.created_at || '',
    updated_at: row.updated_at || '',
    topics: parseTopics(row.topics),
    homepage: row.homepage || ''
  }));
};

// Parse topics from CSV format
const parseTopics = (topicsStr) => {
  if (!topicsStr) return [];
  try {
    return JSON.parse(topicsStr);
  } catch {
    return [];
  }
};
