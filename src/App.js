import './App.css';
import { useState } from 'react';
import { LibraryView } from './components/library/LibraryView';
import Reader from './components/reader/Reader';
import { storyChapters } from './content/story';

const todayKey = new Date().toISOString().slice(0, 10);

function App() {
  const [selectedBook, setSelectedBook] = useState(null);

  if (selectedBook) {
    return (
      <Reader
        bookData={{
          ...selectedBook,
          chapters: storyChapters
        }}
        onExit={() => setSelectedBook(null)}
      />
    );
  }

  return <LibraryView todayKey={todayKey} onRead={setSelectedBook} />;
}

export default App;
