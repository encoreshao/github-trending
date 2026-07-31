import React from 'react';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {isLight ? <BulbFilled /> : <BulbOutlined />}
    </button>
  );
};

export default ThemeToggle;
