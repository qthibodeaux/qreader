import { normalizeTokenText, tokenizeRawText } from './textNormalize';

export function tokenizeStory(chapters) {
  let nextWordId = 1;

  return chapters.flatMap((chapter) => {
    const body = chapter.body || chapter.content || [];

    return body.flatMap((paragraph, paragraphIndex) => {
      const rawWords = tokenizeRawText(paragraph);

      return rawWords.map((rawText, wordIndex) => ({
        id: nextWordId++,
        text: rawText,
        normalized: normalizeTokenText(rawText),
        chapter: chapter.chapter,
        chapterTitle: chapter.title,
        paragraphIndex,
        wordIndex,
        isParagraphStart: wordIndex === 0,
        isParagraphEnd: wordIndex === rawWords.length - 1,
        ledgerRefs: [],
      }));
    });
  });
}

export function groupTokensByChapter(tokens) {
  return tokens.reduce((chapters, token) => {
    const existing = chapters.get(token.chapter) || [];
    existing.push(token);
    chapters.set(token.chapter, existing);
    return chapters;
  }, new Map());
}
