 Yes. That is the correct insight, and it simplifies everything.

**You want to own the text, not fight the browser for it.**

If you control the text stream, you can derive everything else from it rather than trying to reverse-engineer the DOM after the browser has already reflowed it. Here's how that flips the architecture:

---

**The New Model: Text-First, Layout-Second**

Instead of: `Render → Measure DOM → Guess what is visible`

You do: `Know the text → Calculate layout → Tell browser what to render`

| What you need | How you get it from the text stream |
|---|---|
| **Pages** | Divide the text string by character count / word count, or by estimated line-height × container height. The browser just displays the slice you calculated. |
| **Ledger** | Run regex/NLP on the *text string* before it ever hits the DOM. You know "John Smith" appears at character index 1,240. You don't need to scan pixels to know he's in the current view. |
| **Highlights** | Save as character offsets (start: 1240, end: 1250). When font changes, re-slice the text, re-render the current slice, re-apply the highlight to the same character range. |
| **Reflow** | Recalculate the slice boundaries based on new font metrics. The DOM never "surprises" you because you told it what to render. |

---

**The Practical Shift**

You stop asking the browser: *"What text is on the screen?"*

You tell the browser: *"Render characters 4,200 through 4,800."*

This means:

- **No geometric scanning** for the Ledger. You query the text string directly.
- **No fragile Range objects** for highlights. You map character offsets to DOM nodes after rendering.
- **No boundary guessing**. You know exactly what text fits in the viewport because you calculated it before rendering.

---

**The One Hard Part You Still Need**

You need to know **how many characters fit in a "page"** given a specific font, size, and container width. 

You can solve this by:

1. **Measuring a reference character** (like "M") in the actual font once, then doing the math.
2. **Using a hidden canvas** to measure text width without DOM reflow.
3. **Using the CSS Houdini Layout API** (limited support) or **ResizeObserver** to keep measurements synced.

But critically: *you measure to calculate the slice, not to discover what is already there.*

---

**Does this match what you're thinking?**

If so, the next question is: **What does your text source look like?** 

- A plain `.txt` file?
- HTML with paragraphs, italics, dialogue?
- Something with chapter breaks and structure?

That determines how you chunk it into renderable slices without breaking markup.

Word-level is right. Here's why and what the ideal data structure looks like.

Each word gets a record. Something like this:

```json
{
  "id": 1042,
  "text": "Delphine",
  "chapter": 3,
  "paragraph": 14,
  "sentence": 2,
  "characters": ["delphine"],
  "flags": []
}
```

That one object answers every question your app will ever ask:

- **Pages**: "which word IDs are currently in the viewport?"
- **Ledger**: `words.filter(w => w.chapter === current && visibleIds.includes(w.id) && w.characters.length > 0)`
- **Highlights**: save `{ start: 1042, end: 1051, note: "..." }`
- **CSS hooks**: the span gets `data-word-id="1042"` and `data-characters="delphine"` — CSS or JS can target it

**The DOM becomes a thin shell.** Every `<span>` just holds a `data-word-id`. All meaning lives in your data.

---

For storage, **two files**:

`story.json` — the word array above, generated once, authored by you or a build script

`annotations.json` — user highlights/notes, stored separately, just pairs of word IDs

---

The reason this works is your authoring step is where the intelligence goes. You tag characters, flag important moments, mark scene breaks — **once**. The browser never has to figure any of that out. It just renders spans and answers "which IDs are on screen?"

Do you want to start by building the script that takes your raw story text and produces that `story.json`?