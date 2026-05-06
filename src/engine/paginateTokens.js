const DEFAULT_LAYOUT = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: '1.42rem',
  lineHeight: 1.34,
  paragraphGap: '0.86em',
  textAlign: 'justify',
  viewHeight: 640,
  viewWidth: 340,
};

export function paginateTokens(tokens, options = {}) {
  const layout = { ...DEFAULT_LAYOUT, ...options };
  const host = createMeasurementHost(layout);
  const pages = [];
  let startIndex = 0;

  try {
    while (startIndex < tokens.length) {
      const endIndex = findPageEndIndex(tokens, startIndex, host, layout);
      const pageTokens = tokens.slice(startIndex, endIndex + 1);

      pages.push(createContentPage(pageTokens, pages.length));
      startIndex = endIndex + 1;
    }
  } finally {
    host.remove();
  }

  return pages;
}

export function buildReaderPages(chapters, bookModel, options = {}) {
  const pages = [
    {
      id: 'cover',
      type: 'cover',
      pageIndex: 0,
    },
    {
      id: 'title',
      type: 'title',
      pageIndex: 1,
    },
  ];

  chapters.forEach((chapter) => {
    pages.push({
      id: `chapter-${chapter.chapter}-title`,
      type: 'chapter-title',
      chapter: chapter.chapter,
      chapterTitle: chapter.title,
      pageIndex: pages.length,
    });

    const chapterTokens = bookModel.getTokensForChapter(chapter.chapter);
    const contentPages = paginateTokens(chapterTokens, options).map((page) => ({
      ...page,
      id: `chapter-${chapter.chapter}-page-${page.localPageIndex + 1}`,
      pageIndex: pages.length + page.localPageIndex,
    }));

    pages.push(...contentPages);
  });

  return pages.map((page, pageIndex) => ({ ...page, pageIndex }));
}

export function getPageLedgerEntryIds(page) {
  if (!page.tokens) {
    return [];
  }

  const seen = new Set();
  const entryIds = [];

  page.tokens.forEach((token) => {
    (token.ledgerRefs || []).forEach((ref) => {
      if (!seen.has(ref.entryId)) {
        seen.add(ref.entryId);
        entryIds.push(ref.entryId);
      }
    });
  });

  return entryIds;
}

export function getPageLedgerEntries(page, ledgerEntries) {
  const entryIds = new Set(getPageLedgerEntryIds(page));

  return ledgerEntries.filter((entry) => entryIds.has(entry.id));
}

function findPageEndIndex(tokens, startIndex, host, layout) {
  let low = startIndex;
  let high = tokens.length - 1;
  let best = startIndex;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidate = tokens.slice(startIndex, mid + 1);

    renderTokenSlice(host, candidate, layout);

    if (host.scrollHeight <= layout.viewHeight) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best;
}

function createContentPage(tokens, localPageIndex) {
  const firstToken = tokens[0];
  const lastToken = tokens[tokens.length - 1];

  return {
    id: `content-${firstToken.id}-${lastToken.id}`,
    type: 'content',
    chapter: firstToken.chapter,
    chapterTitle: firstToken.chapterTitle,
    localPageIndex,
    startWordId: firstToken.id,
    endWordId: lastToken.id,
    tokens,
  };
}

function createMeasurementHost(layout) {
  const host = document.createElement('div');

  host.style.cssText = `
    position: fixed;
    top: -10000px;
    left: 0;
    box-sizing: border-box;
    width: ${layout.viewWidth}px;
    height: auto;
    min-height: 0;
    overflow: visible;
    visibility: hidden;
    pointer-events: none;
    font-family: ${layout.fontFamily};
    font-size: ${layout.fontSize};
    line-height: ${layout.lineHeight};
    letter-spacing: 0;
    color: transparent;
  `;

  document.body.appendChild(host);
  return host;
}

function renderTokenSlice(host, tokens, layout) {
  host.replaceChildren();

  groupTokensForPage(tokens).forEach((group) => {
    const paragraph = document.createElement('p');
    paragraph.style.cssText = `
      margin: 0 0 ${group.endsParagraph ? layout.paragraphGap : '0'};
      padding: 0;
      text-align: ${layout.textAlign};
      text-wrap: pretty;
    `;

    group.tokens.forEach((token, index) => {
      const span = document.createElement('span');
      span.textContent = `${token.text}${index === group.tokens.length - 1 ? '' : ' '}`;
      paragraph.appendChild(span);
    });

    host.appendChild(paragraph);
  });
}

function groupTokensForPage(tokens) {
  const groups = [];
  let currentGroup = null;

  tokens.forEach((token) => {
    if (!currentGroup || token.isParagraphStart || currentGroup.paragraphIndex !== token.paragraphIndex) {
      currentGroup = {
        paragraphIndex: token.paragraphIndex,
        tokens: [],
        endsParagraph: false,
      };
      groups.push(currentGroup);
    }

    currentGroup.tokens.push(token);
    currentGroup.endsParagraph = token.isParagraphEnd;
  });

  return groups;
}
