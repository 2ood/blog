import { Fragment } from 'react';
import { renderBlock } from './notion/renderer';
import styles from '../styles/post.module.css';

// Shared by the server-rendered article page and the client-side PasscodeWrapper.
export default function ArticleView({ header, footer, blocks }) {
  return (
    <>
      <article className={styles.container}>
        {header}
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </section>
      </article>
      {footer}
    </>
  );
}
