import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import NewApp from './NewApp';
import { ThemeProvider } from './theme/ThemeContext';
import 'antd/dist/reset.css';
import './styles/theme.css';
import './NewApp.css';

const SITE_FONT_FAMILY = "'Space Grotesk', sans-serif";

const savedTheme = localStorage.getItem('github-trending-theme');
const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
  ? savedTheme
  : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
document.documentElement.setAttribute('data-theme', initialTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { fontFamily: SITE_FONT_FAMILY } }}>
      <ThemeProvider>
        <NewApp />
      </ThemeProvider>
    </ConfigProvider>
  </React.StrictMode>
);