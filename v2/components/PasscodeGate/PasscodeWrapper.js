'use client';

import { useState } from 'react';
import PasscodeGate from './PasscodeGate';

export default function PasscodeWrapper({ isConfidential, slug, children }) {
  const [accessGranted, setAccessGranted] = useState(!isConfidential);

  if (!accessGranted) {
    return <PasscodeGate onAccessGranted={() => setAccessGranted(true)} slug={slug} />;
    }

  return children;
}
