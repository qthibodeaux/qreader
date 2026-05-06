import { ledgerEntries } from '../content/ledger';
import { buildReaderPages } from './paginateTokens';
import { tagLedgerTokens } from './tagLedgerTokens';
import { groupTokensByChapter, tokenizeStory } from './tokenizeStory';

export function buildBookModel(chapters, options = {}) {
  const tokens = tagLedgerTokens(
    tokenizeStory(chapters),
    options.ledgerEntries || ledgerEntries,
    options.ledgerOptions
  );
  const chaptersByNumber = groupTokensByChapter(tokens);

  return {
    tokens,
    chaptersByNumber,
    getTokensForChapter(chapterNumber) {
      return chaptersByNumber.get(chapterNumber) || [];
    },
    getTokenById(wordId) {
      return tokens.find((token) => token.id === wordId) || null;
    },
  };
}

export function buildPaginatedBookModel(chapters, options = {}) {
  const model = buildBookModel(chapters, options);
  const pages = buildReaderPages(chapters, model, options.layoutOptions);

  return {
    ...model,
    pages,
    getPage(pageIndex) {
      return pages[pageIndex] || null;
    },
    getPageForWordId(wordId) {
      return pages.find((page) => (
        page.type === 'content' &&
        page.startWordId <= wordId &&
        page.endWordId >= wordId
      )) || null;
    },
  };
}
