export default function ArticleLayout({ children }) {
  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#fff',
      fontFamily: 'sans-serif',
    }}
    >
      <header style={{ marginBottom: '1rem' }}>
        <a href="/"><h1 style={{ fontSize: '1.2rem', color: '#333' }}>이우드의 블로그</h1></a>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
