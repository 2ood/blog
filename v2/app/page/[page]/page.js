// app/page/[page]/page.js

import Link from 'next/link';
import { getPaginatedPosts } from '../../../lib/notion';
import Text from '../../../components/text';
import styles from '../../../styles/index.module.css';
import { FaLock } from 'react-icons/fa';

const POSTS_PER_PAGE = parseInt(process.env.POSTS_PER_PAGE || '5', 10);

export async function generateStaticParams() {
  const { totalPages } = await getPaginatedPosts(1, POSTS_PER_PAGE);
  return Array.from({ length: totalPages }).map((_, i) => ({
    page: String(i + 1),
  }));
}

function getPaginationRange(current, total, delta = 2) {
  const range = [];
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);

  if (left > 1) {
    range.push(1);
    if (left > 2) range.push('...');
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total) {
    if (right < total - 1) range.push('...');
    range.push(total);
  }

  return range;
}

export default async function Page({ params }) {
  const currentPage = parseInt(params.page, 10) || 1;

  const { posts, totalPages } = await getPaginatedPosts(currentPage, POSTS_PER_PAGE);
  const range = getPaginationRange(currentPage, totalPages);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>이우드의 블로그</h1>
        <p>이우드의 글들을 모아둡니다.</p>
      </header>
      <h2 className={styles.heading}>
        All Posts (Page
        {currentPage}
        )
      </h2>
      <ol className={styles.posts}>
        {posts.map((post) => {      
          const date = new Date(post.properties?.Written.date.start).toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          });
          const slug = post.properties?.Slug?.rich_text?.[0]?.text?.content;
          const isConfidential = post.properties?.Status.status.name === 'Confidential';
          return (
            <li key={post.id} className={styles.post}>
              <h3 className={styles.postTitle}>
                <Link href={`/article/${slug}`}>
                  <Text title={post.properties?.Title?.title} />
                </Link>
                {isConfidential && <FaLock className={styles.lockIcon} />}
              </h3>
              <div className={styles.cardInfoGroup}>
                <p className={styles.postDescription}>{date}</p>
                <Link className={styles.readPostButton} href={`/article/${slug}`}>Read post →</Link>
              </div>
            </li>
          );
        })}
      </ol>

      <div className={styles.pagination}>
        {currentPage > 1 && (
        <Link className={styles.pageButton} href={`/page/${currentPage - 1}`}>
          ←
        </Link>
        )}

        {range.map((item, i) => (item === '...' ? (
          <span key={`ellipsis-${i}`} className={styles.pageButton} style={{ pointerEvents: 'none' }}>
            ...
          </span>
        ) : (
          <Link
            key={item}
            href={`/page/${item}`}
            className={`${styles.pageButton} ${item === currentPage ? styles.currentPage : ''}`}
          >
            {item}
          </Link>
        )))}

        {currentPage < totalPages && (
        <Link className={styles.pageButton} href={`/page/${currentPage + 1}`}>
          →
        </Link>
        )}
      </div>
    </main>
  );
}
