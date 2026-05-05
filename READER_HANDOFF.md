# Bae's Anatomy Reader — Standalone App Handoff

You are building a standalone React app called **Bae's Anatomy Reader** — a Libby-quality full-screen book reader for a serialized story. This is being extracted from an existing larger React app. Below is a complete specification of everything already built, the exact data shapes, the pagination architecture, all features, and what still needs to be done.

---

## Tech Stack

- React 18+ 
- No external dependencies beyond React itself
- CSS custom properties for theming
- localStorage for persistence
- No React Router — single view app

---

## Color System (CSS custom properties on `:root`)


---

## Story Data Shape

Story lives in `src\content\story.js`. Each chapter:

```js
{
  chapter: 1,               // integer
  date: '2026-05-01',       // ISO date string — unlock gate
  title: 'Chapter 1: ...',  // full title string
  body: [ ...strings ],     // array of paragraph strings
}
```

There are 17 chapters total. Chapters unlock when `chapter.date <= todayKey` where `todayKey` is today's date as `'YYYY-MM-DD'`. Locked chapters exist in the array but are not paginated — they appear in the TOC greyed out with a 🔒.

For the standalone app, hardcode `todayKey` as today's real date or accept it as a prop/env variable.

---

## Pagination Architecture

This is the core engine. **Do not change this approach — it is battle-tested.**

**Constants:**
```js
const FONT_SIZES = { sm: '0.88rem', md: '1.05rem', lg: '1.28rem' };
const V_PAD = 128; // vertical space consumed by chrome (top bar + bottom bar)
```

**Pipeline:**

1. **`splitSentences(text)`** — splits a paragraph string into an array of sentence strings using regex: `/[^.!?]+(?:[.!?]+['")\u2019]?\s*|$)/g`

2. **`unitsToParagraphs(units)`** — takes an array of `{ text, pi }` objects (sentence units tagged with paragraph index `pi`) and recombines them back into paragraph strings grouped by `pi`.

3. **`buildHTML(units)`** — renders units as measurement HTML: `<p style="margin:0 0 1.4em">paragraph</p>` joined together.

4. **`measureChapterPages(chapter, fontSize, wrap, availH)`** — takes one chapter and an off-screen DOM `div` (`wrap`). Iterates through all sentences of all paragraphs, adding one sentence at a time. When `wrap.scrollHeight > availH` and the bucket isn't empty, commits the current bucket as a content page and starts a new one. Returns an array of content page objects.

5. **`buildBook(unlockedChapters, allChapters, fontSize)`** — creates one shared off-screen `wrap` div, appends it to `document.body`, measures all chapters, removes `wrap`. Returns `{ pages, tocMap }`.

**`wrap` setup:**
```js
const availH = window.innerHeight - V_PAD;
const availW = Math.min(window.innerWidth - 56, 680);
const wrap = document.createElement('div');
wrap.style.cssText = [
  'position:fixed', 'top:-9999px', 'left:0',
  `width:${availW}px`, `font-size:${FONT_SIZES[fontSize]}`,
  'line-height:1.8', 'visibility:hidden', 'font-family:inherit',
].join(';');
document.body.appendChild(wrap);
```

**Global `pages` array structure** — flat array with these page object types:
```js
{ type: 'cover' }
{ type: 'book-title' }
{ type: 'chapter-title', chapter: Number, chapterTitle: String }
{ type: 'content', chapter: Number, chapterTitle: String, paragraphs: String[] }
```

Order: `cover → book-title → [chapter-title → ...content pages] × each unlocked chapter`

**`tocMap`**: `{ chapterNumber (int) → globalPageIndex (int of its chapter-title page) }`

---

## `ReaderView` Component — Full Feature List & State

```js
function ReaderView({ todayKey }) {
  // fontSize initializes from bookmark
  const [fontSize, setFontSize] = useState(() => loadBookmark()?.fontSize ?? 'md');
  const [book, setBook] = useState(null); // { pages, tocMap }
  const [pageIndex, setPageIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const [holdMenu, setHoldMenu] = useState(null); // { x, y, paraText, chapterNum }
  const [highlights, setHighlights] = useState(() => loadHighlights());
  const [notes, setNotes] = useState(() => loadNotes());
  const [pins, setPins] = useState(() => loadPins());
  const [noteSheet, setNoteSheet] = useState(null); // { paraText, chapterNum, draft }
```

Refs needed:
```js
const shellRef = useRef(null);        // the root div
const touchStartX = useRef(null);
const touchStartY = useRef(null);
const isDragging = useRef(false);
const pageIndexRef = useRef(pageIndex);  // mirror for use inside touch handlers
const bookRef = useRef(book);            // mirror for use inside touch handlers
const bookmarkApplied = useRef(false);   // first-load bookmark guard
const overlayTimerRef = useRef(null);    // auto-hide timer
const overlayVisibleRef = useRef(false); // mirror for use inside touch handlers
const holdTimerRef = useRef(null);       // long-press timer
```

---

## Book Build Effect

Runs on `[fontSize, todayKey]`. On first run uses bookmark to restore position. On subsequent runs (font change), lands on `tocMap[currentChapter]`.

```js
useEffect(() => {
  const currentChapter = book ? (book.pages[pageIndex]?.chapter ?? null) : null;
  setBook(null);
  setDragX(0);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const built = buildBook(unlockedChapters, storyChapters, fontSize);
      if (!bookmarkApplied.current) {
        bookmarkApplied.current = true;
        const bm = loadBookmark();
        const target = (bm?.chapterNum && built.tocMap[bm.chapterNum] !== undefined)
          ? built.tocMap[bm.chapterNum] : 0;
        setPageIndex(target);
      } else {
        if (currentChapter && built.tocMap[currentChapter] !== undefined) {
          setPageIndex(built.tocMap[currentChapter]);
        } else { setPageIndex(0); }
      }
      setBook(built);
    });
  });
}, [fontSize, todayKey]);
```

Bookmark save effect: runs on `[pageIndex, book, fontSize]` → `saveBookmark(pg?.chapter ?? null, fontSize)`.

---

## Touch Handler System

Attached imperatively with `addEventListener` so `touchmove` can use `{ passive: false }` and call `e.preventDefault()` to kill vertical scroll during horizontal swipe.

**Behavior:**
- **touchstart**: Record `clientX/Y`. Start 600ms long-press timer — if fires and finger hasn't moved, call `elementFromPoint` to find nearest `[data-para]` element and open hold menu.
- **touchmove**: Compare dx vs dy. If first significant movement is more vertical → abandon (null out startX, cancel hold timer). If horizontal > 8px → enter drag mode, cancel hold timer, call `e.preventDefault()`, update `dragX`.
- **touchend**: Cancel hold timer. If `startX` is null (abandoned or hold triggered) → return. If not dragging → tap logic (toggle overlay or dismiss). If dragging → swipe snap: if dx < -threshold and not last page → next; if dx > threshold and not first → prev. Threshold = `window.innerWidth * 0.35`.

**Tap logic:** If target is not a button or anchor → toggle overlay (show with 4s auto-hide timer if hidden, hide if visible). TOC and hold menus are dismissed on swipe.

---

## Overlay System

- Always rendered in DOM (not conditional) so opacity transition works
- `.reader-overlay` is `opacity:0; pointer-events:none; transition: opacity 0.25s`
- `.reader-overlay.reader-overlay-visible` is `opacity:1`
- When invisible, top/bottom bars also get `pointer-events:none`

`showOverlay()` → `setOverlayVisible(true)` + start 4s timeout → `setOverlayVisible(false)`  
`hideOverlay()` → `setOverlayVisible(false)` + clear timeout  
`goToPage(idx)` → sets snapping, calls setPageIndex, resets auto-hide timer if overlay visible

---

## Three-Page Render with Drag

Rendered indices: `[pageIndex-1, pageIndex, pageIndex+1]` filtered to valid range.

Each page: `transform: translateX((idx - pageIndex) * W + dragX)`

`snapping` class adds CSS transition: `transition: transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

Pages are `position:absolute; top:0; left:0; width:100%; height:100%`.

---

## Page Type Rendering

**Cover page** (`.reader-page-cover`):
- Dark radial gradient background
- Eyebrow: "A story in 17 parts"
- Title: "Bae's Anatomy" — large gold
- Sub: "For Jessica" — italic muted

**Book title page** (`.reader-page-booktitle`):
- Title: "Bae's Anatomy"
- Subtitle: "A Birthday Month Story"
- Dedication: "For the woman who makes everything worth writing down."

**Chapter title card** (`.reader-page-chaptertitle`):
- Small label: "Chapter N" — gold, uppercase
- Large title: `chapter.title`

**Content page**:
- `<div className="reader-text">` containing `<p>` tags with `data-para={para}` and `data-chapter={pg.chapter}`
- Paragraphs get conditional classes: `reader-para-hl` (highlight), `reader-para-pinned` (pin), `reader-para-noted` (has note)
- Noted paragraphs show `<span className="reader-note-dot">💬</span>` at end

---

## Overlay UI

**Top bar:**
- ← Back button (links back to parent app or home)
- Chapter label: `Ch. N` or `Bae's Anatomy`
- Font size buttons: sm / md / lg (A, A, A — different sizes)

**Bottom bar:**
- Page nav: `‹` button · stacked page count · `›` button
- Stacked count: `Ch. N · X of Y` (chapter-relative) above `X / Y` (global)
- TOC button: two-line — current chapter title above "TABLE OF CONTENTS" label

---

## Progress Bar

Always visible (not tied to overlay). 3px gold line at very top of reader shell. Width = `(pageIndex / (totalPages - 1)) * 100`%. CSS transition `width 0.35s ease`.

---

## TOC Sheet

Slides up from bottom over a backdrop. Lists:
- Cover
- Title Page
- All 17 chapters (locked ones disabled + 🔒, dimmed opacity)
- Current chapter highlighted in gold
- Tap any row → jump to that global page index

---

## Hold Menu (Long-press 600ms)

Position: floats near the held point (clamped to viewport edges). 200px wide.

Four actions:
1. **Copy** — `navigator.clipboard.writeText(paraText)`
2. **Highlight** — toggles gold background on paragraph, persists to localStorage Set
3. **Add/Edit note** — opens note sheet with textarea
4. **Pin** — toggles gold left border on paragraph, persists to localStorage Set

Active state (already highlighted/pinned/noted) shows different label.

---

## Note Sheet

Slides up from bottom. Shows:
- Truncated paragraph quote (120 chars max)
- Textarea for note text
- Cancel / Save buttons

Save → writes to localStorage notes object `{ paraText → noteText }`. If draft is empty, deletes the entry.

---

## localStorage Schema

```js
'reader-bookmark'   → { chapterNum: Number|null, fontSize: 'sm'|'md'|'lg' }
'reader-highlights' → JSON array of paragraph text strings (loaded as Set)
'reader-notes'      → JSON object { paragraphText: noteString }
'reader-pins'       → JSON array of paragraph text strings (loaded as Set)
```

All writes wrapped in try/catch.

---

## Chapter-Relative Page Count Calculation

```js
const chapterStarts = Object.values(book.tocMap).sort((a, b) => a - b);
const myStart = book.tocMap[currentChapterNum];
const nextStart = chapterStarts.find((s) => s > myStart);
const myEnd = nextStart !== undefined ? nextStart - 1 : totalPages - 1;
const chapterPageNum = pageIndex - myStart + 1;
const chapterPageTotal = myEnd - myStart + 1;
```

---

## What Still Needs To Be Built

These are planned but not yet implemented:

1. **Annotations Panel** — button in overlay top bar (icon next to font buttons) opens a sheet with three tabs: Highlights · Notes · Pins. Each entry shows the paragraph snippet + chapter label. Tap to jump to `tocMap[chapterNum]`.

2. **The Hillpoint Ledger** — living glossary. Data lives in `src/content/ledger.js`:
```js
export const ledgerEntries = [
  {
    name: 'Chioma',
    type: 'term',             // 'person' | 'place' | 'term'
    blurb: 'The formal title for those blessed with healing grace.',
    firstChapter: 1,          // gates visibility
  },
  // ...
];
```
Only entries where `entry.firstChapter <= currentChapterNum` are shown. Accessible via a "Ledger" button in the overlay. Select words in paragraphs that match a ledger entry name get a subtle colored underline and are tappable for a tooltip card.

3. **Font family + color theme options** — serif/sans/mono toggle; background themes: default dark, sepia (cream bg), OLED black.

4. **Text-to-speech** — Web Speech API, `SpeechSynthesisUtterance`, sentence-level `boundary` events for real-time highlighting.

5. **PWA manifest** — `manifest.json` with custom icon, `"display": "standalone"`, `"name": "Bae's Anatomy"` for Add to Home Screen.

---

## Starting Point

Create a fresh CRA or Vite React app. The entry point renders `<App />` which renders `<ReaderView todayKey="2026-05-04" />` directly — no routing needed for the standalone. Copy `story.js` from the existing content folder. Build everything above from scratch using this spec as the source of truth.

The visual feel is: dark, warm, intimate — like a Kindle in night mode but with gold instead of white. Every element should feel deliberate and premium.
