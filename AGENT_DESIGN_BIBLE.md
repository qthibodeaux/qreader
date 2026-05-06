# QReader Agent Design Bible

This document is the source of truth for future agent sessions. Keep it current whenever product direction, workflow, or visual language changes.

## Project Purpose

Lantern Reader is a standalone React reading app for serialized private stories. It should support more than one book over time, so the first screen is a mobile-first library where the reader chooses which book to open.

The app is personal, not a business product. Build for one owner and a small intended audience. Prefer clear, sturdy implementation over enterprise patterns.

## Current Product Direction

- Opening screen: library/book selection.
- After choosing a book: full-screen reader experience.
- No marketing landing page.
- No React Router required right now. Use local app state for library vs reader.
- The app must be reusable for future stories, not hardcoded only around Bae's Anatomy.
- Story/book metadata should live in a registry such as `src/content/books.js`.
- Individual story chapter data can live in separate content files as the library grows.

## Primary Audience and Device

Design for mobile first. Desktop does not need a separate optimized experience.

Mobile priorities:

- One primary column.
- Large tap targets.
- Swipe and tap gestures should feel natural.
- Bottom-sheet patterns are preferred for menus, table of contents, settings, and future panels.
- Text must be readable on phone screens before anything else.
- Desktop can simply center or lightly stretch the mobile experience.

## Visual Direction

The old site used black and gold, but QReader is standalone and not tied to that identity.

Chosen library palette: **Ink + Parchment**

- Deep ink navy: `#111827`
- Warm paper: `#F4EBDD`
- Bone text: `#F8F1E7`
- Muted brass: `#B98B4B`
- Dusty blue: `#6F8FA3`

Desired feel:

- Calm, editorial, private reading room.
- Premium through spacing, typography, and restraint.
- Modern ebook shelf, not a marketing page.
- Avoid loud decoration, generic cards, and busy backgrounds.
- Book covers/cards may have their own accent colors later.

## Reader Direction

The reader should feel like a polished mobile ebook reader:

- Full viewport reading surface.
- Thin progress line at the top.
- Minimal overlay chrome that appears on tap and fades away.
- Previous/next navigation and swipe gestures.
- Reader swipe must keep the legacy three-page feel: render previous/current/next token pages side-by-side with a small visual gap and translate each by its page offset plus `dragX`, so the incoming page is visible during the gesture.
- Neighbor swipe pages must be inert/non-selectable. Ledger, selection, highlights, notes, and saved-item anchoring should read only from the current token page.
- Table of contents as a bottom sheet.
- Bookmark/font-size persistence in localStorage.

Current reader direction supersedes the old sentence-measured pagination in `READER_HANDOFF.md`.

- The default reading mode is immersive: black background, large gray serif text, no visible overlay.
- Text should fill nearly the full app height with small top/bottom/side padding.
- Paragraphs and sentences may split naturally across pages.
- Pagination uses a token/page model measured before rendering the visible page.
- Reader flow includes a placeholder cover page, a second title/dedication page, then one full-page chapter divider before each chapter body.
- Chapter divider format is `Chapter X` plus the chapter title.
- Font-size changes trigger reflow and page-count recalculation.
- Preserve reading position across reflow by carrying a token `startWordId` into the next layout, with progress ratio as a fallback.
- Reader implementation lives in `src/components/reader/Reader.js` and `src/components/reader/Reader.css`.

### Reader Engine Direction

The current reader architecture is token/page based.

- Engine modules live in `src/engine/`.
- `tokenizeStory(chapters)` converts paragraph text into stable word tokens with `id`, `text`, `normalized`, chapter metadata, paragraph metadata, and paragraph boundary flags.
- `tagLedgerTokens(tokens, ledgerEntries)` applies Ledger aliases to token sequences and stores matches in `token.ledgerRefs`.
- `buildBookModel(chapters)` creates a reusable token model for future pagination and exact page-aware Ledger features.
- `paginateTokens(tokens, layoutOptions)` measures token slices in a hidden browser sandbox and returns exact content pages with `startWordId`, `endWordId`, and `tokens`.
- `buildPaginatedBookModel(chapters, options)` combines tokenization, Ledger tagging, and measured page creation.
- `TokenReaderPage` in `src/components/reader/TokenReaderPage.js` renders the new page objects: cover, title, chapter-title, and content pages.
- Content token spans include `data-word-id`, paragraph/chapter metadata, and `data-ledger-refs` for exact future Ledger, highlight, and note behavior.
- Reader rendering now displays known page slices through `TokenReaderPage` instead of rendering the entire book in CSS columns.
- "On This Page" reads exact Ledger entries from `currentPage.tokens` via `getPageLedgerEntries`; do not return to DOM viewport scanning for this feature.
- Reader search uses `searchTokenPages(readerPages, query)` from `src/engine/searchTokenPages.js`, returning exact `pageIndex`, `startWordId`, and `endWordId` matches.
- New highlights attach to word id ranges. Older paragraph/character-offset highlights may not render until migrated.
- Future notes should also attach to word id ranges, not DOM geometry or character offsets.

### Reader Phase 1 Menu

Current reader menu behavior:

- Center/page tap toggles the adaptive overlay.
- When overlay is visible, tapping outside the top rail or bottom dock hides it.
- Overlay has two timing layers: the default HUD auto-hides after about 7 seconds, while panel/detail layers do not auto-hide.
- Expanded sheets, Ledger details, search, saved items, and future review/note layers stay open until dismissed.
- Overlay top rail has Library, Aa, Search, Ledger, and Saved Items icons.
- Saved Items icon opens the Saved Items sheet. Bookmarking is controlled inside that sheet so one tap does not both bookmark and open the menu.
- Overlay bottom dock shows page count, book progress, previous/next buttons, current chapter title, and Table of Contents entry.
- HUD shows one primary book-relative page count. Avoid showing book and chapter page counts at the same time unless the user asks for it.
- Appearance opens as a bottom sheet and supports Micro/Tiny/XS/SM/MD/LG/XL text size, Serif/Sans/Literary/Modern/Mono typefaces, Dark/Sepia/Solarized/OLED/Forest themes, and custom background/text color.
- Appearance also supports Tight/Normal/Relaxed line height and paragraph spacing; both settings trigger repagination.
- Typeface option labels render in their own font stack as previews.
- Theme options use swatches; custom colors switch the reader to the custom theme.
- Font size, typeface, line height, and paragraph spacing changes trigger a `Formatting Page...` loading state and rebuild token-page pagination.
- Contents opens as a bottom sheet with sections for Front Matter and Chapters.
- Contents includes jump rows for Cover, Title Page, Hillpoint Ledger, and each measured chapter title page.
- Chapter rows show measured chapter start page and measured chapter page span.
- Saved Items opens as a bottom sheet with All, Bookmarks, Notes, and Highlights tabs. Bookmarks, highlights, and typed note creation are functional.

Upcoming reader work:

- Edit existing notes after saving.
- Inline Ledger word styling/tooltips.
- More robust range anchoring for complex multi-page/mutated text selections.

### Reader Persistence

- Reader progress/settings are saved per book in localStorage keys shaped like `qreader-reader-state:{bookId}`.
- Saved state includes page index, progress ratio, token `startWordId`, total pages, settings, and update timestamp.
- On reopen, the reader restores appearance settings immediately and restores reading position by token `startWordId` after pagination is measured.
- `progressRatio` remains a fallback for older saved states and non-content pages.
- Library Continue card changes language when saved progress exists.

### Saved Items

- Saved items are stored per book in localStorage keys shaped like `qreader-saved-items:{bookId}`.
- Current functional item types: `bookmark` and `highlight`.
- Notes reuse the same saved-items collection and now open a typed note editor from selected text.
- Saved item records include type, book id, page index, progress ratio, chapter metadata, label, optional excerpt/note/color, and creation timestamp.
- Saved item jumps prefer token `startWordId` or `anchor.startWordId`, falling back to stored `pageIndex` only for older saved items.
- Native text selection is enabled inside the reader flow only.
- Selection action menu supports Copy, Highlight, and Note.
- Highlight saves selected text with token word ranges and redraws a visible persistent highlight in the reader flow.
- Saved highlights can be removed from the Saved Items sheet, which removes the visible highlight from the reader flow.
- Note opens a bottom-sheet editor, stores the selected excerpt, typed note body, and token word range, then appears in the Saved Items Notes tab.
- Existing notes can be edited from Saved Items; updates preserve the original anchor and saved item id.
- Noted word ranges render in-page with a dotted underline and a small end marker.

### Reader Search

- Search lives in the top-rail search icon and opens a bottom sheet.
- Current search scans token pages.
- Results show chapter, chapter title, and a short token excerpt around the matched phrase.
- The active match is highlighted by word id range on the current token page.
- As the query changes, the first result becomes active; next/previous and result taps jump to the matched token page.
- Search panel includes previous/next result controls.
- Result taps select that match and jump to it. Future work can improve exact vertical positioning within a page if needed.

## Features Not First Priority

The old `READER_TODO.md` is not the current priority list. Ledger is now active work; notes, pins, TTS, and advanced themes remain later priorities.

Current build priority:

1. Mobile-first library screen.
2. Book registry and reusable book metadata.
3. Reader shell for selected book.
4. Core pagination and navigation.
5. Table of contents and progress.
6. Bookmark persistence.
7. Deployment polish.

## Engineering Constraints

- React app created with Create React App.
- Keep dependencies minimal. The handoff preferred no external dependencies beyond React.
- Current deploy target: GitHub Pages at `https://qthibodeaux.github.io/qreader`.
- `package.json` already has `homepage`, `predeploy`, and `deploy` scripts.
- GitHub remote should be `https://github.com/qthibodeaux/qreader.git`.
- Prefer straightforward React state and components.
- Avoid premature abstractions. Add structure when a second book/story or real reuse makes it useful.

## Session Workflow

This is a one-person project with an agent collaborator.

During a session:

- Keep changes local while iterating.
- Do not run `npm run build`, `npm run deploy`, or git commit after every small modification.
- Use `npm start` only when live preview is needed.
- Do not run or report `npm run build` after every update. Build only when the user asks, before deploy, or when explicitly approved for a risky verification.

At the end of a session/checkpoint:

- Run `npm run build` only when the user asks for a checkpoint build.
- Commit only when the user explicitly asks for a commit.
- Run `npm run deploy` only when the user explicitly wants the current checkpoint live on GitHub Pages.

## Current Files of Interest

- `src/App.js` - current app entry UI, library state, temporary reader preview.
- `src/App.css` - current library and preview styling.
- `src/index.css` - global base styles.
- `src/content/story.js` - current Bae's Anatomy chapter data.
- `src/content/books.js` - reusable book registry.
- `src/content/ledger.js` - author-controlled glossary/story bible entries.
- `READER_HANDOFF.md` - full reader implementation spec from the original extraction.
- `READER_TODO.md` - older roadmap, not currently the active priority list.

## Hillpoint Ledger

The Ledger is an author-controlled companion layer, not an inferred wiki.

- Ledger source data lives in `src/content/ledger.js`.
- The first reader UI is a bottom-sheet Ledger panel opened from the top rail.
- The Ledger panel is spoiler-aware by current chapter: entries appear only when `firstChapter` is less than or equal to the chapter currently reached.
- The panel supports category filters for All, People, Places, Terms, Groups, Objects, and Events.
- Entry detail views show overview text, authored relationships, and timeline beats available through the current chapter.
- The default HUD includes an "On This Page" strip based on the exact token page currently rendered. Tapping a chip opens that entry's Ledger detail.
- "On This Page" must use `currentPage.tokens` and `getPageLedgerEntries`; do not use DOM geometry, hidden visible-text nodes, or viewport scanning for this feature.
- Ledger-tagged words render with a subtle underline only when their entry is available through the current chapter. Tapping one opens a compact tooltip with type, name, short definition, and an Open Ledger action for the full entry.
- Entries can later power a full Ledger view and an “On This Page” context strip in the reader overlay.
- Include only entries the author wants to chronicle.
- Avoid ordinary objects unless they matter to the world, plot, tone, or reader memory.
- `forceps` was intentionally excluded from the initial Chapter 1 batch.

Entry fields:

- `id`
- `name`
- `type`: `person`, `place`, `term`, `group`, `object`, `event`
- `shortDefinition`
- `fullDescription`
- `firstChapter`
- `aliases`
- `tags`
- `timeline`: curated authored beats, not every raw mention

Future Ledger ideas:

- Progress-aware descriptions by chapter.
- Deep Dive tabs: Overview, Timeline, Appearances, Related.
- Deeper "On This Page" controls such as grouping, priority, and manual author pinning.
- Authored timeline beats stay the source of truth; automatic appearances are supplemental.

Ledger helper utilities live in `src/utils/ledgerUtils.js`.

- `getLedgerEntriesThroughChapter`
- `groupLedgerEntriesByType`
- `getLedgerEntryDisplayName`
- `getTimelineThroughChapter`
- `resolveLedgerRelationships`
- `findLedgerEntriesInText` for non-page free-text matching
- `getPageLedgerEntries` for exact token-page Ledger matching

## Current Library Shape

The main page should look like a mobile reading app shelf with a carousel-inspired book selector.

- Top bar: `Lantern Reader` and `Library`.
- Three-book carousel stage near the top.
- Selected center book is larger; side books are partially visible and tappable.
- Carousel must support mobile-style horizontal dragging, ignore vertical scroll intent, and snap to the next/previous book after release if the drag passes threshold or has enough velocity.
- Reusable swipe/snap logic lives in `src/hooks/useSnapCarousel.js`.
- Dots below the carousel show selection.
- Info block below the carousel shows selected book metadata, unlock progress, and percent/status.
- Continue Reading panel sits below the info block.
- Shelf below uses simple selectable text tiles for all books. Keep it basic until the reader is stable.
- Include coming-soon books so the app reads as a multi-book platform, even before more real stories exist.
- Current placeholder coming-soon book: `After Hillpoint`.

## Component Structure

Keep `App.js` small. It should only choose between the library and reader states.

- `src/components/library/LibraryView.js` owns library state and composition.
- `src/components/library/BookCarousel.js` owns the carousel UI.
- `src/components/library/BookCover.js` owns reusable cover rendering.
- `src/components/library/SelectedBookInfo.js` owns selected-book metadata.
- `src/components/library/ContinueCard.js` owns the continue/read action.
- `src/components/library/ShelfTiles.js` owns the basic shelf tile list.
- `src/components/reader/Reader.js` owns reader state, pagination orchestration, persistence, and overlay routing.
- `src/components/reader/TokenReaderPage.js` renders cover, title, chapter-title, and token content pages.
- `src/components/reader/ReaderPanels.js` owns reader overlay panels, HUD, saved items, search, TOC, appearance, notes, and Ledger views.
- `src/components/reader/ReaderIcons.js` owns the reader SVG icon components.
- `src/utils/bookStatus.js` owns book unlock/progress helpers.
- Removed obsolete pre-token reader files: `src/utils/BookEngine.js`, `src/hooks/useReaderGestures.js`, and `src/components/reader/ReaderPreview.js`.

## Keep This Updated

Update this file when:

- The visual palette changes.
- The app workflow changes.
- A feature becomes active priority.
- A new content/data convention is introduced.
- Deploy, git, or session workflow changes.
