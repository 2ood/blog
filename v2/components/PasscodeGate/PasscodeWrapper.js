'use client';

import { useState } from 'react';
import PasscodeGate from './PasscodeGate';
import ArticleView from '../ArticleView';
import CommentSection from '../CommentSection/commentSection';

// Blocks and the comments token arrive only from /api/check-passcode after a correct passcode.
export default function PasscodeWrapper({ slug, header, nav }) {
  const [access, setAccess] = useState(null);

  if (!access) {
    return <PasscodeGate onAccessGranted={setAccess} slug={slug} />;
  }

  const footer = (
    <>
      {nav}
      <CommentSection slug={slug} token={access.token} />
    </>
  );
  return <ArticleView header={header} footer={footer} blocks={access.blocks} />;
}
