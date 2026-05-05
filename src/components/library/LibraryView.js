import { useState } from 'react';
import { books } from '../../content/books';
import { getBookStatus } from '../../utils/bookStatus';
import { BookCarousel } from './BookCarousel';
import { ContinueCard } from './ContinueCard';
import { SelectedBookInfo } from './SelectedBookInfo';
import { ShelfTiles } from './ShelfTiles';

export function LibraryView({ todayKey, onRead }) {
  const firstAvailableIndex = Math.max(
    0,
    books.findIndex((book) => book.availability === 'available')
  );
  const [selectedIndex, setSelectedIndex] = useState(firstAvailableIndex);
  const selectedBook = books[selectedIndex];
  const selectedStatus = getBookStatus(selectedBook, todayKey);

  return (
    <main className="library-shell">
      <header className="library-topbar">
        <span>Lantern Reader</span>
        <span>Library</span>
      </header>

      <BookCarousel books={books} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
      <SelectedBookInfo book={selectedBook} status={selectedStatus} />
      <ContinueCard book={selectedBook} status={selectedStatus} onRead={onRead} />
      <ShelfTiles
        books={books}
        selectedIndex={selectedIndex}
        todayKey={todayKey}
        onSelect={setSelectedIndex}
      />
    </main>
  );
}
