import { normalizeTokenText, tokenizeRawText } from './textNormalize';

const EXCERPT_RADIUS = 12;

export function searchTokenPages(pages, query) {
  const queryWords = tokenizeRawText(query)
    .map(normalizeTokenText)
    .filter(Boolean);

  if (!queryWords.length || query.trim().length < 2) {
    return [];
  }

  const results = [];

  pages
    .filter((page) => page.type === 'content' && page.tokens?.length)
    .forEach((page) => {
      page.tokens.forEach((token, tokenIndex) => {
        if (!tokenSequenceMatches(page.tokens, tokenIndex, queryWords)) {
          return;
        }

        const endTokenIndex = tokenIndex + queryWords.length - 1;
        const startExcerpt = Math.max(0, tokenIndex - EXCERPT_RADIUS);
        const endExcerpt = Math.min(page.tokens.length, endTokenIndex + EXCERPT_RADIUS + 1);
        const prefix = startExcerpt > 0 ? '...' : '';
        const suffix = endExcerpt < page.tokens.length ? '...' : '';

        results.push({
          id: `search-${page.pageIndex}-${page.tokens[tokenIndex].id}-${page.tokens[endTokenIndex].id}`,
          chapter: page.chapter,
          chapterTitle: page.chapterTitle,
          pageIndex: page.pageIndex,
          startWordId: page.tokens[tokenIndex].id,
          endWordId: page.tokens[endTokenIndex].id,
          excerpt: `${prefix}${page.tokens.slice(startExcerpt, endExcerpt).map((word) => word.text).join(' ')}${suffix}`,
        });
      });
    });

  return results;
}

function tokenSequenceMatches(tokens, startIndex, queryWords) {
  if (startIndex + queryWords.length > tokens.length) {
    return false;
  }

  return queryWords.every((queryWord, offset) => (
    tokens[startIndex + offset].normalized === queryWord
  ));
}
