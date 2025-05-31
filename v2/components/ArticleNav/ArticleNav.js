import Link from 'next/link';
import styles from './articleNav.module.css';

export default function ArticleNav({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <div className={styles.navContainer}>
      {prev && (
        <Link href={`/article/${prev.slug}`} className={styles.navCard}>
          <div className={styles.navCardTitle}>← Previous</div>
          <div className={styles.navCardText}>{prev.title}</div>
        </Link>
      )}
      {next && (
        <Link href={`/article/${next.slug}`} className={`${styles.navCard} ${styles.right}`}>
          <div className={styles.navCardTitle}>Next →</div>
          <div className={styles.navCardText}>{next.title}</div>
        </Link>
      )}
    </div>
  );
}