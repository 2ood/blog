// components/ThemeToggle.js
'use client';

import { useEffect, useState } from 'react';
import styles from './themetoggle.module.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // The inline script in app/layout.js has already applied the theme class.
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(next);
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  return (
    <button type="button" onClick={toggleTheme} className={styles.toggleTheme}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
