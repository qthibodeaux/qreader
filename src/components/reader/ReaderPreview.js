export function ReaderPreview({ book, todayKey, onBack }) {
  const firstUnlockedChapter =
    book.chapters.filter((chapter) => chapter.date <= todayKey).at(-1) ?? book.chapters[0];

  return (
    <main className="reader-preview">
      <header className="reader-preview-bar">
        <button type="button" onClick={onBack}>
          Back
        </button>
        <span>{book.title}</span>
      </header>
      <article className="reader-preview-page">
        <p className="reader-preview-label">Chapter {firstUnlockedChapter.chapter}</p>
        <h1>{firstUnlockedChapter.title}</h1>
        {firstUnlockedChapter.body.slice(0, 3).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </main>
  );
}
