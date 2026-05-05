import { getBookStatus } from '../../utils/bookStatus';

export function ShelfTiles({ books, selectedIndex, todayKey, onSelect }) {
  return (
    <section className="shelf-section" aria-label="Book shelf">
      <div className="section-heading">
        <h2>On the shelf</h2>
        <p>{books.length} books</p>
      </div>
      <div className="shelf-tile-grid">
        {books.map((book, index) => {
          const status = getBookStatus(book, todayKey);
          const disabled = book.availability === 'coming-soon';

          return (
            <button
              className={[
                'shelf-tile',
                disabled ? 'shelf-tile-disabled' : '',
                index === selectedIndex ? 'shelf-tile-selected' : '',
              ].filter(Boolean).join(' ')}
              key={book.id}
              type="button"
              onClick={() => onSelect(index)}
            >
              <span className="shelf-tile-label">{book.label}</span>
              <strong>{book.title}</strong>
              <span>{status.statusLabel}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
