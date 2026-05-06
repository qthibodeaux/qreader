export function TokenReaderPage({
  activeSearchResult = null,
  bookData,
  ledgerChapterNumber = 1,
  ledgerEntries = [],
  onLedgerTokenClick = null,
  page,
  savedItems = [],
}) {
  if (!page) {
    return null;
  }

  if (page.type === 'cover') {
    return (
      <header className="reader-token-cover-page">
        <div>
          <p>{bookData.author || 'Lantern Reader'}</p>
          <h1>{bookData.title}</h1>
          <span>{bookData.subtitle}</span>
        </div>
      </header>
    );
  }

  if (page.type === 'title') {
    return (
      <section className="reader-token-title-page">
        <p>{bookData.subtitle}</p>
        <h1>{bookData.title}</h1>
        <span>For Jessica</span>
      </section>
    );
  }

  if (page.type === 'chapter-title') {
    return (
      <header className="reader-token-chapter-title-page">
        <p>Chapter {page.chapter}</p>
        <h2>{cleanChapterTitle(page.chapterTitle)}</h2>
      </header>
    );
  }

  if (page.type === 'content') {
    const highlightedWordIds = getHighlightedWordIds(savedItems);
    const notedWordIds = getNotedWordIds(savedItems);
    const noteEndWordIds = getNoteEndWordIds(savedItems);
    const availableLedgerIds = getAvailableLedgerIds(ledgerEntries, ledgerChapterNumber);

    return (
      <article className="reader-token-content-page">
        {groupPageTokens(page.tokens).map((group) => (
          <p key={`${group.chapter}-${group.paragraphIndex}-${group.startWordId}`}>
            {group.tokens.map((token, index) => {
              const ledgerRefs = getAvailableTokenLedgerRefs(token, availableLedgerIds);
              const primaryLedgerRef = ledgerRefs[0] || null;

              return (
                <span
                  className={getTokenClassName(
                    token,
                    highlightedWordIds,
                    notedWordIds,
                    noteEndWordIds,
                    activeSearchResult,
                    ledgerRefs
                  )}
                  data-chapter={token.chapter}
                  data-ledger-refs={ledgerRefs.map((ref) => ref.entryId).join(' ')}
                  data-paragraph-index={token.paragraphIndex}
                  data-reader-word="true"
                  data-word-id={token.id}
                  key={token.id}
                  onClick={primaryLedgerRef && onLedgerTokenClick
                    ? (event) => {
                        event.stopPropagation();
                        onLedgerTokenClick(primaryLedgerRef.entryId, event.currentTarget.getBoundingClientRect());
                      }
                    : undefined}
                  role={primaryLedgerRef ? 'button' : undefined}
                  tabIndex={primaryLedgerRef ? 0 : undefined}
                  onKeyDown={primaryLedgerRef && onLedgerTokenClick
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onLedgerTokenClick(primaryLedgerRef.entryId, event.currentTarget.getBoundingClientRect());
                        }
                      }
                    : undefined}
                >
                  {token.text}
                  {index === group.tokens.length - 1 ? '' : ' '}
                </span>
              );
            })}
          </p>
        ))}
      </article>
    );
  }

  return null;
}

function getTokenClassName(
  token,
  highlightedWordIds,
  notedWordIds,
  noteEndWordIds,
  activeSearchResult,
  ledgerRefs = []
) {
  const classes = [];

  if (ledgerRefs.length > 0) {
    classes.push('reader-ledger-token');
  }

  if (notedWordIds.has(token.id)) {
    classes.push('reader-note-token');
  }

  if (noteEndWordIds.has(token.id)) {
    classes.push('reader-note-token-end');
  }

  if (highlightedWordIds.has(token.id)) {
    classes.push('reader-persistent-highlight');
  }

  if (
    activeSearchResult &&
    token.id >= activeSearchResult.startWordId &&
    token.id <= activeSearchResult.endWordId
  ) {
    classes.push('reader-search-mark active');
  }

  return classes.length ? classes.join(' ') : undefined;
}

function getAvailableLedgerIds(ledgerEntries, chapterNumber) {
  return new Set(
    ledgerEntries
      .filter((entry) => entry.firstChapter <= chapterNumber)
      .map((entry) => entry.id)
  );
}

function getAvailableTokenLedgerRefs(token, availableLedgerIds) {
  return (token.ledgerRefs || [])
    .filter((ref) => availableLedgerIds.has(ref.entryId));
}

function getHighlightedWordIds(savedItems) {
  const highlightedWordIds = new Set();

  savedItems
    .filter((item) => item.type === 'highlight' && item.anchor?.startWordId && item.anchor?.endWordId)
    .forEach((item) => {
      for (let wordId = item.anchor.startWordId; wordId <= item.anchor.endWordId; wordId++) {
        highlightedWordIds.add(wordId);
      }
    });

  return highlightedWordIds;
}

function getNotedWordIds(savedItems) {
  const notedWordIds = new Set();

  savedItems
    .filter((item) => item.type === 'note' && item.anchor?.startWordId && item.anchor?.endWordId)
    .forEach((item) => {
      for (let wordId = item.anchor.startWordId; wordId <= item.anchor.endWordId; wordId++) {
        notedWordIds.add(wordId);
      }
    });

  return notedWordIds;
}

function getNoteEndWordIds(savedItems) {
  return new Set(
    savedItems
      .filter((item) => item.type === 'note' && item.anchor?.endWordId)
      .map((item) => item.anchor.endWordId)
  );
}

export function groupPageTokens(tokens = []) {
  const groups = [];
  let currentGroup = null;

  tokens.forEach((token) => {
    if (!currentGroup || token.isParagraphStart || currentGroup.paragraphIndex !== token.paragraphIndex) {
      currentGroup = {
        chapter: token.chapter,
        paragraphIndex: token.paragraphIndex,
        startWordId: token.id,
        tokens: [],
      };
      groups.push(currentGroup);
    }

    currentGroup.tokens.push(token);
  });

  return groups;
}

function cleanChapterTitle(title = '') {
  return title.replace(/^Chapter \d+:\s*/, '');
}
