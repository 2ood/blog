'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './commentSection.module.css';

const authHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

// `token` is required for confidential articles (issued by /api/check-passcode).
export default function CommentSection({ slug, token }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const loadComments = useCallback(async () => {
    const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`, {
      headers: authHeaders(token),
    });
    setComments(res.ok ? await res.json() : []);
  }, [slug, token]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const submitComment = async () => {
    if (!content.trim()) return;
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify({ slug, name, content }),
    });
    setContent('');
    await loadComments();
  };

  return (
    <section className={styles.commentSection}>
      <h3>Comments</h3>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div className={styles.commentCard} key={comment.id}>
            <div className={styles.commentAuthor}>{comment.name}</div>
            <pre className={styles.commentContent}>{comment.content}</pre>
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
