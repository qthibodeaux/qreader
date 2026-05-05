const READER_STATE_PREFIX = 'qreader-reader-state';
const SAVED_ITEMS_PREFIX = 'qreader-saved-items';

const DEFAULT_READER_SETTINGS = {
  fontSize: 'sm',
  theme: 'dark-paper',
  typeface: 'serif',
};

function getReaderStateKey(bookId) {
  return `${READER_STATE_PREFIX}:${bookId || 'default'}`;
}

function getSavedItemsKey(bookId) {
  return `${SAVED_ITEMS_PREFIX}:${bookId || 'default'}`;
}

export function loadReaderState(bookId) {
  try {
    const raw = localStorage.getItem(getReaderStateKey(bookId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveReaderState(bookId, state) {
  try {
    localStorage.setItem(getReaderStateKey(bookId), JSON.stringify(state));
  } catch {
    // localStorage may be unavailable in private contexts.
  }
}

export function getInitialReaderSettings(bookId) {
  const saved = loadReaderState(bookId);
  return {
    ...DEFAULT_READER_SETTINGS,
    ...(saved?.settings || {}),
  };
}

export function hasReaderProgress(bookId) {
  const saved = loadReaderState(bookId);
  return Boolean(saved && saved.progressRatio > 0);
}

export function loadSavedItems(bookId) {
  try {
    const raw = localStorage.getItem(getSavedItemsKey(bookId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSavedItems(bookId, items) {
  try {
    localStorage.setItem(getSavedItemsKey(bookId), JSON.stringify(items));
  } catch {
    // localStorage may be unavailable in private contexts.
  }
}

export { DEFAULT_READER_SETTINGS };
