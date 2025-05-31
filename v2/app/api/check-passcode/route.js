/* eslint-disable import/prefer-default-export */
import { checkPasscodeFromSlug } from '../../../lib/notion';

export async function POST(req) {
  const { slug, passcode } = await req.json();

  const isValid = await checkPasscodeFromSlug(slug, passcode);

  return new Response(JSON.stringify({ valid: isValid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
