'use client';

import { useState } from 'react';
import styles from './passcodeGate.module.css';

export default function PasscodeGate({ onAccessGranted, correctCode = 'passcode123' }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // 🔸 form의 기본 제출 막기
    if (passcode === correctCode) {
      onAccessGranted();
    } else {
      setError('Incorrect passcode.');
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
        />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
