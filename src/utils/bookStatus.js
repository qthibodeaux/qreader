export function getBookStatus(book, todayKey) {
  if (book.availability === 'coming-soon') {
    return {
      unlockedCount: 0,
      totalChapters: 0,
      nextChapter: null,
      statusLabel: 'Coming soon',
      progressLabel: 'Not available yet',
    };
  }

  const unlockedChapters = book.chapters.filter((chapter) => chapter.date <= todayKey);
  const totalChapters = book.chapters.length;
  const unlockedCount = unlockedChapters.length;
  const nextChapter = book.chapters.find((chapter) => chapter.date > todayKey);

  return {
    unlockedCount,
    totalChapters,
    nextChapter,
    statusLabel:
      unlockedCount === totalChapters
        ? 'Complete'
        : `${unlockedCount} of ${totalChapters} chapters unlocked`,
    progressLabel: unlockedCount > 0 ? `${unlockedCount} available` : 'Unlocking soon',
  };
}

export function getProgressPercent(status) {
  if (!status.totalChapters) {
    return 0;
  }

  return Math.min(100, Math.max(0, (status.unlockedCount / status.totalChapters) * 100));
}
