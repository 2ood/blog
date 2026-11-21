import Link from 'next/link';
import styles from '../styles/not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.notFoundHeading}>404 – Page Not Found</h1>
      <p className={styles.notFoundMessage}>
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link href="/" className={styles.notFoundLink}>
        ← Go back to home
      </Link>
    </div>
  );
}
