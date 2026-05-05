export function getLedgerEntriesThroughChapter(entries, chapterNumber) {
  if (!chapterNumber) {
    return [];
  }

  return entries.filter((entry) => entry.firstChapter <= chapterNumber);
}

export function groupLedgerEntriesByType(entries) {
  return entries.reduce((groups, entry) => {
    const type = entry.type || 'term';
    return {
      ...groups,
      [type]: [...(groups[type] || []), entry],
    };
  }, {});
}

export function getLedgerEntryDisplayName(entry, chapterNumber) {
  if (
    entry.revealName &&
    entry.nameRevealedChapter &&
    chapterNumber >= entry.nameRevealedChapter
  ) {
    return entry.revealName;
  }

  return entry.name;
}

export function getTimelineThroughChapter(entry, chapterNumber) {
  return (entry.timeline || []).filter((beat) => beat.chapter <= chapterNumber);
}

export function resolveLedgerRelationships(entry, entries) {
  const byId = new Map(entries.map((ledgerEntry) => [ledgerEntry.id, ledgerEntry]));

  return (entry.relationships || []).map((relationship) => ({
    ...relationship,
    entry: byId.get(relationship.target) || null,
  }));
}

export function findLedgerEntriesInText(text, entries, options = {}) {
  const normalizedText = normalizeForLedgerMatch(text);
  const minAliasLength = options.minAliasLength ?? 3;
  const excludedAliases = new Set(
    (options.excludedAliases || []).map((alias) => normalizeForLedgerMatch(alias))
  );

  return entries
    .map((entry) => {
      const matchedAlias = getLedgerAliases(entry).find((alias) => {
        const normalizedAlias = normalizeForLedgerMatch(alias);

        if (excludedAliases.has(normalizedAlias)) {
          return false;
        }

        if (normalizedAlias.length < minAliasLength) {
          return false;
        }

        return hasWholePhrase(normalizedText, normalizedAlias);
      });

      return matchedAlias ? { entry, matchedAlias } : null;
    })
    .filter(Boolean);
}

export function getLedgerAliases(entry) {
  return [...new Set([entry.name, entry.revealName, ...(entry.aliases || [])].filter(Boolean))];
}

function normalizeForLedgerMatch(value) {
  return String(value)
    .toLowerCase()
    .replace(/[’'"]/g, "'") // Handle straight and curly quotes/apostrophes
    .replace(/[—–-]/g, "-") // Handle different dash types
    .replace(/[^a-z0-9'\s-]/g, ' ') // Replace punctuation with space to prevent word merging
    .replace(/\s+/g, ' ')
    .trim();
}

function hasWholePhrase(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match phrase bound by non-alphanumeric characters or start/end
  const pattern = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  return pattern.test(text);
}
