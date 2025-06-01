'use client';

import { useState } from 'react';
import styles from './passcodeGate.module.css';

export default function PasscodeGate({ onAccessGranted, slug }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 🟡 loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('checking..');
    setLoading(true); // ▶️ Start loading

    try {
      const res = await fetch('/api/check-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, passcode }),
      });

      const data = await res.json();
      if (data.valid) {
        onAccessGranted();
      } else {
        setError('Incorrect passcode.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false); // ⏹️ Stop loading
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🔐 This article is confidential</h1>
      <p className={styles.message}>Please enter the passcode to continue:</p>

      <form onSubmit={handleSubmit} className={styles.inputGroup}>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter passcode"
          className={styles.input}
          disabled={loading}
        />
        <button type="submit" className={styles.button} disabled={loading}>Submit</button>
      </form>

      {(error || loading) && <p className={loading ? styles.checking : styles.error}>{error}</p>}
    </div>
  );
}
