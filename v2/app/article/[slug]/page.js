import { Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  getDatabase, getBlocks, getPageFromSlug, getAdjacentArticles 
} from '../../../lib/notion';
import Text from '../../../components/text';
import { renderBlock } from '../../../components/notion/renderer';
import styles from '../../../styles/post.module.css';

import ArticleNav from '../../../components/ArticleNav/ArticleNav';
import CommentSection from '../../../components/CommentSection/commentSection';

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const database = await getDatabase();
  return database?.map((page) => {
    const slug = page.properties.Slug?.formula?.string;
    return { params: { slug } };
  });
}

export default async function Page({ params }) {

  if (!params || typeof params.slug !== 'string') {
    return <div>Invalid route parameter</div>;
  }

  const page = await getPageFromSlug(params?.slug);
  
  if (!page) {notFound();}

  const blocks = await getBlocks(page?.id);
  if (!blocks || !blocks.length) {notFound(); }
  
  const { prev, next } = await getAdjacentArticles(params?.slug);

  const date = new Date(page.properties?.Written.date.start).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  return (
    <div>
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
    </div>
  );
}


// export const getStaticPaths = async () => {
//   const database = await getDatabase(databaseId);
//   return {
//     paths: database.map((page) => {
//       const slug = page.properties.Slug?.formula?.string;
//       return ({ params: { id: page.id, slug } });
//     }),
//     fallback: true,
//   };
// };

// export const getStaticProps = async (context) => {
//   const { slug } = context.params;
//   const page = await getPage(id);
//   const blocks = await getBlocks(id);

//   return {
//     props: {
//       page,
//       blocks,
//     },
//     revalidate: 1,
//   };
// };
