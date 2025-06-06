import styles from '../../../styles/index.module.css';

export default function Loading() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner} />
      <p className={styles.loadingText}>Loading article...</p>
    </div>
  );
}
