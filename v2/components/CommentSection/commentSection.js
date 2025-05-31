'use client';

import { useState, useEffect } from 'react';
import styles from './commentSection.module.css';

export default function CommentSection({ slug }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(`/api/comments?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [slug]);

  const submitComment = async () => {
    if (!content.trim()) return;
    await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ slug, name, content }),
    });
    setContent('');
    const updated = await fetch(`/api/comments?slug=${slug}`).then((r) => r.json());
    setComments(updated);
  };

  return (
    <section className={styles.commentSection}>
      <h3>Comments</h3>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div className={styles.commentCard} key={comment.id}>
            <div className={styles.commentAuthor}>{comment.name}</div>
            <div className={styles.commentContent}>{comment.content}</div>
          </div>
        ))}
        {comments.length === 0 && <p>첫 댓글을 남겨보세요!</p>}
      </div>

      <form
        className={styles.commentForm}
        onSubmit={(e) => {
          e.preventDefault();
          submitComment();
        }}
      >
        <input
          className={styles.commentInput}
          placeholder="이름 (선택)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className={styles.commentTextarea}
          placeholder="댓글을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className={styles.commentButton}>
          댓글 작성
        </button>
      </form>
    </section>
  );
}
