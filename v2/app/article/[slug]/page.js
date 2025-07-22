// ✅ app/article/[slug]/page.js
import { Fragment } from 'react';
import Head from 'next/head';
import { notFound } from 'next/navigation';

import { getBlocks, getPageFromSlug, getAdjacentArticles, } from '../../../lib/notion';
import Text from '../../../components/text';
import { renderBlock } from '../../../components/notion/renderer';
import ArticleNav from '../../../components/ArticleNav/ArticleNav';
import CommentSection from '../../../components/CommentSection/commentSection';
import PasscodeWrapper from '../../../components/PasscodeGate/PasscodeWrapper';
import styles from '../../../styles/post.module.css';

export const revalidate = 300;


export default async function Page({ params }) {
  if (!params || typeof params?.slug !== 'string') return notFound();

  const page = await getPageFromSlug(params?.slug);
  if (!page) return notFound();

  const blocks = await getBlocks(page.id);
  if (!blocks || !blocks.length) return notFound();

  const { prev, next } = await getAdjacentArticles(params.slug);

  const isConfidential = page.properties?.Status.status.name === 'Confidential';
  const date = new Date(page.properties?.Written.date.start).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  
  return (
    <PasscodeWrapper isConfidential={isConfidential} slug={params?.slug}>
      <Head>
        <title>{page.properties.Title?.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className={styles.container}>
        <h1 className={styles.title}>
          <Text title={page.properties.Title?.title} />
        </h1>
        <div className={styles.postInfoGroup}>
          <p>{date}</p>
          <p className={styles.summary}>{page.properties.Summary?.rich_text[0]?.plain_text}</p>
        </div>
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </section>
      </article>
      <ArticleNav prev={prev} next={next} />
      <CommentSection slug={params?.slug} />
    </PasscodeWrapper>
  );
}
