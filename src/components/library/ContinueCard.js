import { hasReaderProgress } from '../../utils/readerStorage';

export function ContinueCard({ book, status, onRead }) {
  const disabled = book.availability === 'coming-soon';
  const hasProgress = hasReaderProgress(book.id);

  return (
    <section className="continue-card" aria-labelledby="continue-title">
      <div>
        <p className="section-label">Continue Reading</p>
        <h2 id="continue-title">
          {disabled ? 'Waiting on the next story' : hasProgress ? 'Pick up where you left off' : book.title}
        </h2>
        <p>
          {disabled
            ? 'This book will open when its first chapter is ready.'
            : hasProgress
              ? `${status.statusLabel}. Your reading position and appearance settings are saved.`
              : `${status.statusLabel}. Start from the beginning.`}
        </p>
      </div>
      <button
        className="read-button"
        type="button"
        disabled={disabled}
        onClick={() => onRead(book)}
      >
        {disabled ? 'Coming Soon' : hasProgress ? 'Continue Reading' : 'Start Reading'}
      </button>
    </section>
  );
}
