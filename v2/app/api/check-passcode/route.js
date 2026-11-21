/* eslint-disable import/prefer-default-export */
import { checkPasscodeFromSlug, getBlocks, getReadablePost } from '../../../lib/notion';
import { issueArticleToken } from '../../../lib/articleToken';

// Confidential article content is never rendered into the page HTML;
// it is only returned here, after the passcode is verified server-side.
export async function POST(req) {
  const { slug, passcode } = await req.json();
  if (typeof slug !== 'string' || typeof passcode !== 'string' || !passcode) {
    return Response.json({ valid: false }, { status: 400 });
  }

  const post = await getReadablePost(slug);
  if (!post?.meta.isConfidential) {
    return Response.json({ valid: false }, { status: 404 });
  }

  const isValid = await checkPasscodeFromSlug(slug, passcode);
  if (!isValid) {
    return Response.json({ valid: false }, { status: 401 });
  }

  const blocks = await getBlocks(post.page.id);
  return Response.json({ valid: true, blocks, token: issueArticleToken(slug) });
}
