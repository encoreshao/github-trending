import React from 'react';
import ReactDOM from 'react-dom/client';
import NewApp from './NewApp';
import { ThemeProvider } from './theme/ThemeContext';
import 'antd/dist/reset.css';
import './styles/theme.css';
import './NewApp.css';

const savedTheme = localStorage.getItem('github-trending-theme');
const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
  ? savedTheme
  : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
document.documentElement.setAttribute('data-theme', initialTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <NewApp />
    </ThemeProvider>
  </React.StrictMode>
);