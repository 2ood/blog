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

function isWithinTwoWeeks(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();

  // Normalize time to avoid issues with hours/min/sec
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
  const timeDifference = today - inputDate;

  // Check if the date is between today and 14 days from now (inclusive)
  return timeDifference >= 0 && timeDifference <= twoWeeksInMs;
}

export default async function Page({ params }) {
  const currentPage = parseInt(params.page, 10) || 1;

  const { posts, totalPages } = await getPaginatedPosts(currentPage, POSTS_PER_PAGE);
  const range = getPaginationRange(currentPage, totalPages);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h2>이우드의 블로그</h2>
        <p>이우드의 글들을 모아둡니다.</p>
      </header>
      <h2 className={styles.heading}>
        All Posts (Page
        {currentPage}
        )
      </h2>
      <ol className={styles.posts}>
        {posts.map((post, index) => {      
          const date = new Date(post.properties?.Written.date.start).toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          });
          const slug = post.properties?.Slug?.rich_text?.[0]?.text?.content;
          const writtenDate = post.properties?.Written.date.start;
          const isConfidential = post.properties?.Status.status.name === 'Confidential';
          const isInProgress = post.properties?.Status.status.name === 'In progress';
          const isRecent = (!isInProgress) && isWithinTwoWeeks(writtenDate);

          const blogChip = (
          <li key={post.id} className={styles.post}>
            <h3 className={styles.postTitle}>
                <Text title={post.properties?.Title?.title} />
                {isInProgress ? <p className={styles.upcoming}>Upcoming</p> : 
                <p className={styles.recent}>{isRecent && 'RECENT RELEASE'}</p>}
                {isConfidential && <FaLock className={styles.lockIcon} />}
            </h3>
            <p className={styles.summary}>{post.properties.Summary?.rich_text[0]?.plain_text}</p>
            <div className={styles.cardInfoGroup}>
              <p className={styles.postDescription}>{date}</p>
            </div>
          </li>
          );

          return (isInProgress ? blogChip : <Link href={`/article/${slug}`} key={index}>{blogChip}</Link>);
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
