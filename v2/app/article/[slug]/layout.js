import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { getReadablePost } from '../../../lib/notion';
import ScrollToTop from '../../../components/ScrollToTop/ScrollToTop';
import styles from '../../../styles/post.module.css';

// The existence check lives here, outside the loading.js Suspense boundary,
// so missing/draft articles get a real 404 status instead of a streamed 200.
export default async function ArticleLayout({ children, params }) {
  const { slug } = await params;
  if (!await getReadablePost(slug)) notFound();

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <a href="/"><h2 className={styles.headerTitle}>이우드의 블로그</h2></a>
      </header>
      <nav>
        <Link href="/page/1" className={styles.back} aria-label="목록으로" title="목록으로">
          <IoArrowBack aria-hidden />
        </Link>
      </nav>
      <main>
        {children}
      </main>
      <ScrollToTop />
    </div>
  );
}
