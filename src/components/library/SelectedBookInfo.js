import { getProgressPercent } from '../../utils/bookStatus';

export function SelectedBookInfo({ book, status }) {
  const progressPercent = getProgressPercent(status);

  return (
    <section className="selected-book-info" aria-labelledby="selected-book-title">
      <div className="selected-book-pill">
        <span>{book.label}</span>
        <span>{status.progressLabel}</span>
      </div>
      <h1 id="selected-book-title">{book.title}</h1>
      <p className="selected-book-author">{book.subtitle}</p>
      <div className="selected-progress-row">
        <div className="featured-progress" aria-label={status.statusLabel}>
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <span>{progressPercent ? `${Math.round(progressPercent)}%` : status.statusLabel}</span>
      </div>
    </section>
  );
}
