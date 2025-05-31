import { getComments, postComment } from '../../../lib/notion';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const comments = await getComments(slug);
  return Response.json(comments);
}

export async function POST(req) {
  const body = await req.json();
  await postComment(body);
  return new Response('ok');
}
