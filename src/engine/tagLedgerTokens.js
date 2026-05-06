import { getLedgerAliases } from '../utils/ledgerUtils';
import { normalizeForMatching, normalizeTokenText, tokenizeRawText } from './textNormalize';

const DEFAULT_EXCLUDED_ALIASES = ['his'];

export function tagLedgerTokens(tokens, ledgerEntries, options = {}) {
  const minAliasLength = options.minAliasLength ?? 3;
  const excludedAliases = new Set([
    ...DEFAULT_EXCLUDED_ALIASES,
    ...(options.excludedAliases || []),
  ].map((alias) => normalizeForMatching(alias)));
  const aliasPatterns = buildLedgerAliasPatterns(ledgerEntries, {
    excludedAliases,
    minAliasLength,
  });
  const taggedTokens = tokens.map((token) => ({ ...token, ledgerRefs: [] }));

  for (let index = 0; index < taggedTokens.length; index++) {
    for (const pattern of aliasPatterns) {
      if (!tokenSequenceMatches(taggedTokens, index, pattern.normalizedWords)) {
        continue;
      }

      const endIndex = index + pattern.normalizedWords.length - 1;

      for (let tokenIndex = index; tokenIndex <= endIndex; tokenIndex++) {
        taggedTokens[tokenIndex].ledgerRefs = mergeLedgerRef(
          taggedTokens[tokenIndex].ledgerRefs,
          {
            entryId: pattern.entry.id,
            alias: pattern.alias,
            startWordId: taggedTokens[index].id,
            endWordId: taggedTokens[endIndex].id,
          }
        );
      }
    }
  }

  return taggedTokens;
}

export function getLedgerEntriesForTokens(tokens) {
  const seen = new Set();
  const entryIds = [];

  tokens.forEach((token) => {
    (token.ledgerRefs || []).forEach((ref) => {
      if (!seen.has(ref.entryId)) {
        seen.add(ref.entryId);
        entryIds.push(ref.entryId);
      }
    });
  });

  return entryIds;
}

function buildLedgerAliasPatterns(ledgerEntries, { excludedAliases, minAliasLength }) {
  return ledgerEntries
    .flatMap((entry) => (
      getLedgerAliases(entry).map((alias) => {
        const normalizedAlias = normalizeForMatching(alias);
        const normalizedWords = tokenizeRawText(normalizedAlias)
          .map(normalizeTokenText)
          .filter(Boolean);

        return {
          alias,
          entry,
          normalizedAlias,
          normalizedWords,
        };
      })
    ))
    .filter((pattern) => (
      pattern.normalizedAlias.length >= minAliasLength &&
      !excludedAliases.has(pattern.normalizedAlias) &&
      pattern.normalizedWords.length > 0
    ))
    .sort((a, b) => b.normalizedWords.length - a.normalizedWords.length);
}

function tokenSequenceMatches(tokens, startIndex, normalizedWords) {
  if (startIndex + normalizedWords.length > tokens.length) {
    return false;
  }

  return normalizedWords.every((word, offset) => (
    tokens[startIndex + offset].normalized === word
  ));
}

function mergeLedgerRef(refs, nextRef) {
  const exists = refs.some((ref) => (
    ref.entryId === nextRef.entryId &&
    ref.startWordId === nextRef.startWordId &&
    ref.endWordId === nextRef.endWordId
  ));

  return exists ? refs : [...refs, nextRef];
}
