export function normalizeForMatching(value) {
  return String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, '-')
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeTokenText(value) {
  return normalizeForMatching(value).replace(/^['-]+|['-]+$/g, '');
}

export function tokenizeRawText(value) {
  return String(value).match(/\S+/g) || [];
}
