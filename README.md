# Lantern Reader

Lantern Reader is a mobile-first web reader for private serialized stories. It opens like a small personal library, lets the reader choose a book, and then moves into a full-screen reading experience built for phones.

The app is currently centered around **Bae's Anatomy**, with room for future stories on the shelf.

## What It Does

- Mobile-first library home screen with a book carousel.
- Multi-book content model through `src/content/books.js`.
- Reflowable full-screen reader using token-based pagination.
- Swipe/drag page navigation.
- Adaptive overlay with:
  - Library/back action
  - appearance controls
  - search
  - saved items
  - table of contents
- Appearance controls:
  - Micro through XL text sizes
  - Serif, Sans, Literary, Modern, and Mono typefaces with font previews
  - Tight, Normal, and Relaxed line height and paragraph spacing
  - Dark, Sepia, Solarized, OLED, Forest, and Custom themes
  - Custom background and text colors
- Dynamic re-pagination when text settings change.
- Reader state persistence per book.
- Saved Items system with working bookmarks, highlights, and notes.
- Live token-page search with in-text highlighting and previous/next result navigation.
- Hillpoint Ledger companion layer with spoiler-aware entries and "On This Page" context chips.

## Reader Philosophy

The reader should feel quiet, immersive, and personal. The default state hides controls and lets the text fill the screen. Menus appear only when needed, then get out of the way.

The visual target is closer to an intimate ebook reader than a traditional website:

- black or paper-like reading surfaces
- large, legible type
- minimal chrome
- warm restrained accents
- bottom-sheet controls built for thumbs

## Current Content

Story data lives in:

```text
src/content/story.js
```

Book registry lives in:

```text
src/content/books.js
```

The app currently includes:

- **Bae's Anatomy** - available serialized story
- **After Hillpoint** - coming soon placeholder
- **The Velvet File** - coming soon placeholder

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm start
```

Build when requested or before deployment:

```bash
npm run build
```

Deploy to GitHub Pages when requested:

```bash
npm run deploy
```

## Project Notes

Future sessions should read:

```text
AGENT_DESIGN_BIBLE.md
```

That file tracks the current product direction, reader architecture, design decisions, and session workflow.
