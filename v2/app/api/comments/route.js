import { getComments, getReadablePost, postComment } from '../../../lib/notion';
import { verifyArticleToken } from '../../../lib/articleToken';

// Returns an error Response, or null if the caller may access this article's comments.
async function authorize(req, slug) {
  const post = await getReadablePost(slug);
  if (!post) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  if (post.meta.isConfidential) {
    const token = req.headers.get('authorization')?.replace(/^Bearer /, '');
    if (!verifyArticleToken(slug, token)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  return null;
}

export async function GET(req) {
  const slug = new URL(req.url).searchParams.get('slug');
  const denied = await authorize(req, slug);
  if (denied) return denied;

  const comments = await getComments(slug);
  return Response.json(comments);
}

export async function POST(req) {
  const { slug, name = '', content } = await req.json();
  if (typeof name !== 'string' || typeof content !== 'string' || !content.trim()) {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
  const denied = await authorize(req, slug);
  if (denied) return denied;

  await postComment({ slug, name, content });
  return new Response(null, { status: 201 });
}
