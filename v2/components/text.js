import styles from '../styles/post.module.css';

export default function Text({ title }) {
  if (!title) {
    return null;
  }
  // plain_text/href exist on every rich_text type (text, mention, equation);
  // `text` only exists on type "text".
  return title.map((value, i) => {
    const {
      annotations: {
        bold, italic, strikethrough, underline, code, color,
      },
      plain_text: content,
      href,
    } = value;
    const className = [
      bold && styles.bold,
      italic && styles.italic,
      strikethrough && styles.strikethrough,
      underline && styles.underline,
      code && styles.code,
    ].filter(Boolean).join(' ') || undefined;
    return (
      <span
        className={className}
        style={color && color !== 'default' ? { color } : {}}
        // eslint-disable-next-line react/no-array-index-key
        key={i}
      >
        {href ? <a href={href}>{content}</a> : content}
      </span>
    );
  });
}
