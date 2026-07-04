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
