# Reader Feature Roadmap

---

## Active Queue

- [x] Reading progress bar — thin gold line at top showing % through whole book
- [x] Chapter progress in page count — "Ch. 3 · 2 of 8" alongside global count
- [x] Auto-hide overlay — fades out after ~4s of inactivity

---

## The Hillpoint Ledger ⭐ (Big One)

A living glossary that expands as the reader progresses — people, places, terms, and lore. 
If you're on Chapter 1, you only see what Chapter 1 introduced. No spoilers, ever.

- [ ] **Core Ledger view** — tab/sheet accessible from the reader, lists entries the reader has encountered so far
- [ ] **Entry types** — People, Places, Terms (tagged + filterable)
- [ ] **Progress-gated entries** — each entry has a `firstAppearance` page/chapter; only shows if reader has passed it
- [ ] **Inline word underscores** — select words in the text get a subtle colored underline; tap for a tooltip with their Ledger entry
- [ ] **Tooltip design** — small popover card: name, type badge, short definition/context
- [ ] **Ledger data file** — `ledger.js` with all entries authored manually (name, type, blurb, firstAppearance)

---

## Interactable Pages

Hold on any word or phrase to trigger a context menu (Kindle-style):

- [ ] **Hold to select** — long-press opens action menu
- [ ] **Highlight** — mark a passage in gold/amber; persists in localStorage
- [ ] **Note** — attach a personal note to a selection; stored locally, viewable in a Notes sheet
- [ ] **Copy** — copies selected text to clipboard
- [ ] **Pin** — pin a passage; pinned items surface in a dedicated Pins view

---

## Future / Stretch

- [ ] **Font family toggle** — serif, sans-serif, mono options
- [ ] **Background + font color themes** — full color customization (cream, sepia, night/dark, OLED black)
- [ ] **Text-to-speech reader** — play chapter audio using Web Speech API, no external files
- [ ] **TTS real-time text highlighting** — sentence-level highlight tracks the spoken word as TTS plays
- [ ] **Break reader into standalone app** — separate repo/deploy as `baes-anatomy`, PWA-ready with home screen icon
