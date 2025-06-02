import styles from '../../../styles/post.module.css';

export default function ArticleLayout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <a href="/"><h2 className={styles.headerTitle}>이우드의 블로그</h2></a>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
