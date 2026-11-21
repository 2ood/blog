// ✅ app/article/[slug]/page.js
import { notFound } from 'next/navigation';

import { getBlocks, getReadablePost, getAdjacentArticles, } from '../../../lib/notion';
import Text from '../../../components/text';
import ArticleView from '../../../components/ArticleView';
import ArticleNav from '../../../components/ArticleNav/ArticleNav';
import CommentSection from '../../../components/CommentSection/commentSection';
import PasscodeWrapper from '../../../components/PasscodeGate/PasscodeWrapper';
import styles from '../../../styles/post.module.css';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getReadablePost(slug);
  if (!post) return {};
  return {
    title: post.meta.titleText,
    description: post.meta.summary || undefined,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  const post = await getReadablePost(slug);
  if (!post) return notFound();
  const { page, meta } = post;

  const { prev, next } = await getAdjacentArticles(slug);

  const date = new Date(meta.written).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const header = (
    <>
      <h1 className={styles.title}>
        <Text title={meta.title} />
      </h1>
      <div className={styles.postInfoGroup}>
        <p>{date}</p>
        <p className={styles.summary}>{meta.summary}</p>
      </div>
    </>
  );
  const nav = <ArticleNav prev={prev} next={next} />;

  if (meta.isConfidential) {
    return <PasscodeWrapper slug={slug} header={header} nav={nav} />;
  }

  const footer = (
    <>
      {nav}
      <CommentSection slug={slug} />
    </>
  );

  const blocks = await getBlocks(page.id);
  if (!blocks || !blocks.length) return notFound();

  return <ArticleView header={header} footer={footer} blocks={blocks} />;
}
