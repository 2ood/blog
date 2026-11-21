/* eslint-disable import/prefer-default-export */
import { Fragment } from 'react';
import Link from 'next/link';

import Text from '../text';
import { plainText } from '../../lib/postMeta';
import styles from '../../styles/post.module.css';

export function renderBlock(block) {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text title={value.rich_text} />
        </p>
      );
    case 'heading_1':
      return (
        <h1>
          <Text title={value.rich_text} />
        </h1>
      );
    case 'heading_2':
      return (
        <h2>
          <Text title={value.rich_text} />
        </h2>
      );
    case 'heading_3':
      return (
        <h3>
          <Text title={value.rich_text} />
        </h3>
      );
    case 'bulleted_list': {
      return <ul>{value.children.map((child) => renderBlock(child))}</ul>;
    }
    case 'numbered_list': {
      return <ol>{value.children.map((child) => renderBlock(child))}</ol>;
    }
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li key={block.id}>
          <Text title={value.rich_text} />
          {block.children?.map((child) => (
            <Fragment key={child.id}>{renderBlock(child)}</Fragment>
          ))}
        </li>
      );
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />
            {' '}
            <Text title={value.rich_text} />
          </label>
        </div>
      );
    case 'toggle':
      return (
        <details>
          <summary>
            <Text title={value.rich_text} />
          </summary>
          {block.children?.map((child) => (
            <Fragment key={child.id}>{renderBlock(child)}</Fragment>
          ))}
        </details>
      );
    case 'child_page':
      return (
        <div className={styles.childPage}>
          <strong>{value?.title}</strong>
          {block.children.map((child) => renderBlock(child))}
        </div>
      );
    case 'image': {
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = plainText(value.caption);
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    case 'divider':
      return <hr key={id} />;
    case 'quote':
      return (
        <blockquote key={id}>
          <Text title={value.rich_text} />
        </blockquote>
      );
    case 'code':
      return (
        <pre className={styles.pre}>
          <code className={styles.code_block} key={id}>
            {plainText(value.rich_text)}
          </code>
        </pre>
      );
    case 'file': {
      const srcFile = value.type === 'external' ? value.external.url : value.file.url;
      const splitSourceArray = srcFile.split('/');
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const captionFile = plainText(value.caption);
      return (
        <figure>
          <div className={styles.file}>
            📎
            {' '}
            <Link href={srcFile} passHref>
              {lastElementInArray.split('?')[0]}
            </Link>
          </div>
          {captionFile && <figcaption>{captionFile}</figcaption>}
        </figure>
      );
    }
    case 'bookmark': {
      const href = value.url;
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" className={styles.bookmark}>
          {href}
        </a>
      );
    }
    case 'table': {
      return (
        <table className={styles.table}>
          <tbody>
            {block.children?.map((child, index) => {
              const RowElement = value.has_column_header && index === 0 ? 'th' : 'td';
              return (
                <tr key={child.id}>
                  {child.table_row?.cells?.map((cell, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <RowElement key={`${cell.plain_text}-${i}`}>
                      <Text title={cell} />
                    </RowElement>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    case 'column_list': {
      return (
        <div className={styles.row}>
          {block.children.map((childBlock) => renderBlock(childBlock))}
        </div>
      );
    }
    case 'column': {
      return <div>{block.children.map((child) => renderBlock(child))}</div>;
    }
    case 'video': {
      let videoSrc =
        value.type === 'external' ? value.external.url : value.file.url;
      const caption = plainText(value.caption);

      const youtubeMatch = videoSrc.match(/^https:\/\/youtu\.be\/([\w-]+)/);
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        videoSrc = `https://www.youtube.com/embed/${videoId}`;
      }
      
      return (
        <figure className={styles.video}>
          <iframe width="560" height="315" src={videoSrc} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    case 'callout': {
      
      const icon = value.icon?.emoji || '💡';
      const colorClass = value.color ? value.color.replace('_background', '') : 'default';
      const isSingleLine =
        value.rich_text.length === 1 &&
        !value.rich_text[0].plain_text.includes('\n');

      const alignmentClass = isSingleLine ? styles.calloutCenter : '';
    
      return (
        <div className={`${styles.callout} ${styles[`callout_${colorClass}`]} ${alignmentClass}`} key={id}>
          <span className={styles.calloutIcon}>{icon}</span>
          <div className={styles.calloutText}>
            <Text title={value.rich_text} />
          </div>
        </div>
      );
    }
    
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
  }
}
