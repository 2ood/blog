'use client';

import { useEffect, useState } from 'react';
import styles from './scrollToTop.module.css';

const SHOW_AFTER_PX = 400;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`${styles.button} ${visible ? styles.visible : ''}`}
      aria-label="맨 위로"
      title="맨 위로"
      tabIndex={visible ? 0 : -1}
    >
      {/* Equilateral triangle: side 12, height 12·√3/2 ≈ 10.392 */}
      <svg viewBox="0 0 12 10.392" width="14" height="12.124" aria-hidden>
        <polygon points="6,0 12,10.392 0,10.392" fill="currentColor" />
      </svg>
    </button>
  );
}
