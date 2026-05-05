import { useSnapCarousel } from '../../hooks/useSnapCarousel';
import { BookCover } from './BookCover';

export function BookCarousel({ books, selectedIndex, onSelect }) {
  const { dragX, isDragging, carouselHandlers } = useSnapCarousel({
    count: books.length,
    index: selectedIndex,
    onIndexChange: onSelect,
  });

  return (
    <section className="book-carousel" aria-label="Choose a book">
      <div
        className={`carousel-stage${isDragging ? ' carousel-stage-dragging' : ''}`}
        style={{ '--carousel-drag': `${dragX}px` }}
        {...carouselHandlers}
      >
        {books.map((book, index) => {
          const offset = index - selectedIndex;

          return (
            <button
              className={[
                'carousel-book',
                offset === 0 ? 'carousel-book-selected' : '',
                Math.abs(offset) > 1 ? 'carousel-book-hidden' : '',
              ].filter(Boolean).join(' ')}
              key={book.id}
              type="button"
              aria-label={`Select ${book.title}`}
              onClick={() => onSelect(index)}
              style={{ '--book-offset': offset }}
            >
              <BookCover book={book} carousel />
            </button>
          );
        })}
      </div>
      <div className="carousel-dots" aria-hidden="true">
        {books.map((book, index) => (
          <span
            className={index === selectedIndex ? 'carousel-dot-active' : ''}
            key={book.id}
          />
        ))}
      </div>
    </section>
  );
}
