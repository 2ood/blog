'use client';

import { useState } from 'react';
import PasscodeGate from './PasscodeGate';

export default function PasscodeWrapper({ isConfidential, passcode, children }) {
  const [accessGranted, setAccessGranted] = useState(!isConfidential);

  if (!accessGranted) {
    return (
      <PasscodeGate
        correctCode={passcode}
        onAccessGranted={() => setAccessGranted(true)}
      />
    );
  }

  return children;
}
