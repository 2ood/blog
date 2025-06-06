import styles from '../../../styles/index.module.css';

export default function Loading() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h2>이우드의 블로그</h2>
        <p>이우드의 글들을 모아둡니다.</p>
      </header>

      <h2 className={styles.heading}>All Posts</h2>

      <div className={styles.loaderWrapper}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading posts...</p>
      </div>
    </main>
  );
}
