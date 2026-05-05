export function BookCover({ book, compact = false, carousel = false }) {
  return (
    <div
      className={[
        'book-cover',
        compact ? 'book-cover-compact' : '',
        carousel ? 'book-cover-carousel' : '',
      ].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        '--book-accent': book.coverAccent,
        '--book-secondary': book.coverSecondary,
      }}
    >
      <div className="book-cover-band" />
      <div className="book-cover-content">
        <p>{book.label}</p>
        <h2>{book.title}</h2>
        <span>{book.subtitle}</span>
      </div>
    </div>
  );
}
