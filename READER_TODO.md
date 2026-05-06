# Reader Feature Roadmap

---

## Active Queue

- [x] Reading progress bar - current HUD shows global book progress.
- [x] Auto-hide overlay - overlay hides after idle on the main tap layer.
- [x] Tap-off overlay dismissal - tapping outside active menu areas closes the overlay.
- [x] Reader cover page - book opens with a cover/title-style page.
- [x] Chapter title pages - each chapter has its own centered title page.
- [x] Continue Reading - library card restores the saved reading position.
- [x] Adaptive pagination - reader recalculates pages when font/type settings change.
- [x] Search - searches token pages and jumps/highlights matches while typing.
- [x] Table of contents - jumps to cover, title page, Ledger, and chapter title pages.
- [x] Bookmarks sheet - bookmark panel supports bookmarks, highlights, and notes tabs.

---

## The Hillpoint Ledger

A living glossary that expands as the reader progresses - people, places, terms, groups, objects, events, and lore.
If you're on Chapter 1, you only see what Chapter 1 introduced. No spoilers, ever.

- [x] Core Ledger view - tab/sheet accessible from the reader, lists entries the reader has encountered so far.
- [x] Entry types - People, Places, Terms, Groups, Objects, Events are tagged and filterable.
- [x] Progress-gated entries - entries use chapter gating so future information stays hidden.
- [x] Ledger data file - `src/content/ledger.js` holds manually authored entries, aliases, relationships, and timeline beats.
- [x] Context-aware "On This Page" strip - current token page provides exact Ledger chips in the HUD.
- [x] Token tagging engine - Ledger aliases are tagged onto story tokens before rendering.
- [x] Inline word underscores - Ledger-tagged words get subtle visible styling.
- [x] Tap Ledger word for tooltip/detail - tapping a Ledger-tagged word opens a tooltip with a deep-link to the Ledger entry.
- [x] Tooltip design - small popover card with name, type badge, short definition/context, and Open Ledger action.
- [ ] Ledger appearance/deep dive list - future entry detail can show exact appearances by word/page.
- [ ] Author pinning/priority - manually prioritize which Ledger chips appear when a page has too many matches.

---

## Interactable Pages

Hold/select text to trigger a context menu.

- [x] Hold/select text action menu - selected text opens Copy, Highlight, and Note actions.
- [x] Highlight - marks selected word ranges and persists in localStorage.
- [x] Remove highlights - highlights can be removed from the Saved Items sheet.
- [x] Note - selected text opens a note editor and stores typed notes locally.
- [x] Copy - copies selected text to clipboard.
- [x] Saved Items sheet - bookmarks, highlights, and notes share one versatile saved-items system.
- [x] Edit notes - existing notes can be opened, updated, and saved back.
- [x] In-page note indicators - noted word ranges show a dotted underline and end marker.
- [ ] Custom selection handles - current behavior relies on native browser text selection.

---

## Appearance & Reading Settings

- [x] Font size controls - multiple mobile-friendly sizes, including two extra-small options.
- [x] Typeface selector - Serif, Sans, Literary, Modern, and Mono options.
- [x] Typeface previews - typeface names render in their own font.
- [x] Theme selector - Dark Paper, Sepia, Solarized, OLED, Forest, and Custom themes.
- [x] Formatting state - settings changes show a formatting/loading state while pages recalculate.
- [x] More polished theme previews/swatches.
- [x] Custom background and text color controls.
- [x] Line height and paragraph spacing controls.

---

## Reader Architecture

- [x] Token-first page model - pages are built from stable word tokens.
- [x] Token-based page-aware Ledger - "On This Page" uses current page tokens, not DOM scanning.
- [x] Token-based search - search results include page and word id ranges.
- [x] Token-based highlights - highlights attach to word id ranges.
- [x] Progress restore by word id - saved progress survives repagination better than raw page number.
- [x] Modular reader files - panels, icons, token pages, and engine modules are split out of `Reader.js`.
- [x] Obsolete reader files removed - old preview/gesture/book-engine files are gone.
- [ ] Further split `Reader.js` - state hooks for saved items, pagination, and overlay logic can be extracted later.
- [ ] Migrate any older saved paragraph-offset highlights if needed.

---

## Future / Stretch

- [ ] Text-to-speech reader - play chapter audio using Web Speech API, no external files.
- [ ] TTS real-time text highlighting - sentence/word-level highlight tracks spoken text.
- [ ] PWA-ready install experience - home screen icon, manifest polish, offline behavior.
- [ ] Per-book real cover art.
- [ ] Multi-book content pipeline - support additional real stories beyond the current book and coming-soon placeholders.
