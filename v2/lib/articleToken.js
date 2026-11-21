import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Issued after a correct passcode; proves access to one confidential article
// (used by the comments API). Stateless: "<expiry>.<hmac(slug:expiry)>".
// The key is derived from NOTION_TOKEN, so rotating that token revokes every article token.
const TTL_MS = 24 * 60 * 60 * 1000;
const key = createHash('sha256').update(`article-token:${process.env.NOTION_TOKEN}`).digest();

const sign = (slug, exp) => createHmac('sha256', key).update(`${slug}:${exp}`).digest('base64url');

export function issueArticleToken(slug) {
  const exp = Date.now() + TTL_MS;
  return `${exp}.${sign(slug, exp)}`;
}

export function verifyArticleToken(slug, token) {
  if (typeof token !== 'string') return false;
  const [exp, sig] = token.split('.');
  if (!sig || !(Number(exp) > Date.now())) return false;
  const expected = Buffer.from(sign(slug, exp));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
