import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import './App.css';
import { days } from './content/days';
import { storyChapters } from './content/story';

const TIME_ZONE = 'America/Chicago';
const todayOverride = new URLSearchParams(window.location.search).get('today');

function chicagoDateKey(date = new Date()) {
  if (todayOverride) {
    return todayOverride;
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function dayStatus(day, todayKey) {
  if (day.date > todayKey) {
    return 'locked';
  }
  if (day.date === todayKey) {
    return 'today';
  }
  return 'open';
}

function getHashRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return hash || '';
}

function subscribeToHashChange(callback) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}

function useHashRoute() {
  return useSyncExternalStore(subscribeToHashChange, getHashRoute, () => '');
}

function App() {
  const route = useHashRoute();
  const todayKey = chicagoDateKey();
  const currentDay =
    days.find((day) => day.date === todayKey) ||
    [...days].reverse().find((day) => day.date < todayKey) ||
    days[0];

  const [section, id] = route.split('/');
  const selectedDay = section === 'day' ? days.find((day) => day.day === Number(id)) : null;
  const selectedChapter =
    section === 'story' && id ? storyChapters.find((chapter) => chapter.chapter === Number(id)) : null;

  if (section === 'reader') {
    return <ReaderView todayKey={todayKey} />;
  }

  return (
    <main className="app-shell">
      <SiteHeader />
      {selectedDay ? (
        <DayView day={selectedDay} todayKey={todayKey} />
      ) : selectedChapter ? (
        <ChapterView chapter={selectedChapter} todayKey={todayKey} />
      ) : section === 'story' ? (
        <StoryIndex todayKey={todayKey} />
      ) : section === 'memories' ? (
        <Memories todayKey={todayKey} />
      ) : (
        <Home todayKey={todayKey} currentDay={currentDay} />
      )}
      <BottomNav />
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#/">
        <img
          className="brand-mark"
          src={`${process.env.PUBLIC_URL}/assets/avy.jpeg`}
          alt="Jessica"
        />
        <span>
          <span className="eyebrow">May 1-17, 2026</span>
          <strong>Celebrating Jessica</strong>
        </span>
      </a>
    </header>
  );
}

function Home({ todayKey, currentDay }) {
  const availableCount = days.filter((day) => day.date <= todayKey).length;
  const todayStatus = dayStatus(currentDay, todayKey);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Birthday month scrapbook</p>
          <h1>17 days made just for you.</h1>
          <p>
            A little path of notes, memories, clues, missions, and chapters from
            <em> Bae&apos;s Anatomy</em> leading to Birthday Queen Day.
          </p>
        </div>
        <div className="today-panel">
          <span className="stamp">Day {currentDay.day} of 17</span>
          <h2>{todayStatus === 'locked' ? 'The scrapbook opens May 1.' : "Today's page is ready."}</h2>
          <a className="primary-action" href={`#/day/${currentDay.day}`}>
            Open Today&apos;s Surprise
          </a>
        </div>
      </section>

      <section className="progress-strip" aria-label="Birthday progress">
        <span>{availableCount} of 17 unlocked</span>
        <div className="progress-track">
          <div style={{ width: `${(availableCount / 17) * 100}%` }} />
        </div>
      </section>

      <section className="path-section">
        <div className="section-heading">
          <p className="kicker">Scrapbook path</p>
          <h2>Open one page each day</h2>
        </div>
        <div className="scrapbook-path">
          {days.map((day) => (
            <DayCard key={day.day} day={day} status={dayStatus(day, todayKey)} />
          ))}
        </div>
      </section>
    </>
  );
}

function DayCard({ day, status }) {
  const locked = status === 'locked';
  return (
    <a
      className={`day-card ${status} ${day.isFinale ? 'finale' : ''} ${day.hasPlan ? 'planned' : ''}`}
      href={locked ? '#/' : `#/day/${day.day}`}
      aria-disabled={locked}
    >
      {day.hasPlan && <span className="plan-indicator" aria-label="Something special is planned" />}
      <span className="day-number">Day {day.day}</span>
      {locked ? (
        <span className="locked-label">{day.hasPlan ? 'Something is waiting' : 'Locked'}</span>
      ) : (
        <>
          {day.hasPlan && <span className="planned-label">Planned surprise</span>}
          <span className="day-type">{day.type}</span>
          <strong>{day.title}</strong>
          <span className="day-date">{formatDate(day.date)}</span>
        </>
      )}
    </a>
  );
}

function DayView({ day, todayKey }) {
  const status = dayStatus(day, todayKey);
  const locked = status === 'locked';
  const chapter = storyChapters.find((story) => story.chapter === day.storyChapter);

  return (
    <section className="detail-page">
      <a className="back-link" href="#/">
        Back to path
      </a>
      {locked ? (
        <LockedPanel label={`Day ${day.day}`} date={day.date} />
      ) : (
        <>
          <article className={`reveal-card reveal-${day.type} ${day.isFinale ? 'finale' : ''}`}>
            <div className="paper-corner" />
            <p className="kicker">{day.isFinale ? 'Birthday Queen Day' : `Day ${day.day}`}</p>
            <h1>{day.title}</h1>
            <p className="date-line">{formatDate(day.date)}</p>
            {day.image && (
              <figure className="photo-frame">
                <img src={day.image} alt={day.imageAlt || ''} />
                {day.imageCaption && <figcaption>{day.imageCaption}</figcaption>}
              </figure>
            )}
            <p className="message">{day.message}</p>
            {day.prompt && <div className="mission-box">{day.prompt}</div>}
            {day.jokes && <JokeCard jokes={day.jokes} />}
            {day.choiceReveal && <ChoiceReveal choiceReveal={day.choiceReveal} />}
            {day.riddle && <RiddleReveal riddle={day.riddle} />}
          </article>

          <article className="story-callout">
            <p className="kicker">Bae&apos;s Anatomy</p>
            <h2>{chapter?.title || `Chapter ${day.storyChapter}`}</h2>
            <p>A new chapter unlocked with today&apos;s page.</p>
            <a className="secondary-action" href={`#/story/${day.storyChapter}`}>
              Read Chapter {day.storyChapter}
            </a>
          </article>
        </>
      )}
    </section>
  );
}

function JokeCard({ jokes }) {
  // how many jokes are visible, and which ones have been revealed
  const [visible, setVisible] = useState(1);
  const [revealed, setRevealed] = useState([]);
  const isRevealed = (i) => revealed.includes(i);
  const isLast = visible >= jokes.length;

  function handleReveal(i) {
    setRevealed((r) => [...r, i]);
  }

  function handleMore() {
    setVisible((v) => v + 1);
  }

  return (
    <div className="joke-card">
      <p className="kicker">Birthday Month Dad Joke</p>
      {jokes.slice(0, visible).map((joke, i) => (
        <div key={i} className={`joke-item${i > 0 ? ' joke-item-stacked' : ''}`}>
          <p className="joke-setup">{joke.setup}</p>
          {isRevealed(i) ? (
            <>
              <p className="joke-punchline">{joke.punchline}</p>
              {i === jokes.length - 1 && joke.footer && (
                <p className="joke-footer">{joke.footer}</p>
              )}
              {i === visible - 1 && !isLast && (
                <button type="button" className="joke-reveal-btn joke-reveal-corny" onClick={handleMore}>
                  Ok I know that was corny... but I got one more
                </button>
              )}
            </>
          ) : (
            i === visible - 1 && (
              <button type="button" className="joke-reveal-btn" onClick={() => handleReveal(i)}>
                Reveal the punchline
              </button>
            )
          )}
        </div>
      ))}
    </div>
  );
}

function ChoiceReveal({ choiceReveal }) {
  const [selected, setSelected] = useState(choiceReveal.options[0]);

  return (
    <div className="choice-card">
      <p className="kicker">Today&apos;s mission</p>
      <h2>{choiceReveal.title}</h2>
      <div className="choice-grid" role="group" aria-label={choiceReveal.title}>
        {choiceReveal.options.map((option) => (
          <button
            className={selected.label === option.label ? 'selected' : ''}
            key={option.label}
            type="button"
            onClick={() => setSelected(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="prescription-slip">
        <span>Doctor&apos;s Orders</span>
        <p>{selected.result}</p>
      </div>
      <p className="choice-footer">{choiceReveal.footer}</p>
    </div>
  );
}

function RiddleReveal({ riddle }) {
  const [guess, setGuess] = useState('');
  const [showClues, setShowClues] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const normalizedGuess = normalizeGuess(guess);
  const acceptedAnswers = riddle.answers.map(normalizeGuess);
  const solved = acceptedAnswers.includes(normalizedGuess);
  const showMiss = attempted && guess.trim() && !solved;

  function checkGuess(event) {
    event.preventDefault();
    setAttempted(true);
  }

  return (
    <div className="riddle-card">
      <p className="kicker">Tonight&apos;s riddle</p>
      <p className="riddle-question">{riddle.question}</p>
      <form className="guess-form" onSubmit={checkGuess}>
        <label htmlFor="day-riddle-guess">Your guess</label>
        <input
          id="day-riddle-guess"
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          placeholder="Type your answer..."
        />
        <button type="submit">Check</button>
      </form>
      {showMiss && <p className="guess-feedback">Not quite. Try again or take a clue.</p>}
      <button className="clue-button" type="button" onClick={() => setShowClues(!showClues)}>
        {showClues ? 'Hide clues' : 'Use a clue'}
      </button>
      {showClues && (
        <div className="clue-list">
          {riddle.clues.map((clue) => (
            <p key={clue}>{clue}</p>
          ))}
        </div>
      )}
      {solved && (
        <div className="answer-reveal">
          {riddle.ticket ? (
            <TicketReveal ticket={riddle.ticket} />
          ) : (
            <>
              <h2>{riddle.successTitle}</h2>
              <p>{riddle.successMessage}</p>
            </>
          )}
          <a className="secondary-action" href={riddle.revealUrl} target="_blank" rel="noreferrer">
            {riddle.revealLabel}
          </a>
        </div>
      )}
    </div>
  );
}

function TicketReveal({ ticket }) {
  return (
    <div className="ticket-reveal">
      <div className="ticket-stub">
        <span>{ticket.eyebrow}</span>
      </div>
      <div className="ticket-main">
        <p className="kicker">{ticket.eyebrow}</p>
        <h2>{ticket.title}</h2>
        {ticket.image && (
          <img className="ticket-photo" src={ticket.image} alt={ticket.imageAlt || ''} />
        )}
        <dl>
          <div>
            <dt>Admit</dt>
            <dd>{ticket.admit}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{ticket.date}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{ticket.time}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{ticket.location}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{ticket.address}</dd>
          </div>
        </dl>
        <p>{ticket.note}</p>
      </div>
    </div>
  );
}

function StoryIndex({ todayKey }) {
  const unlocked = storyChapters.filter((chapter) => chapter.date <= todayKey).length;
  return (
    <section className="detail-page">
      <div className="book-hero">
        <p className="kicker">A short story in 17 parts</p>
        <h1>Bae&apos;s Anatomy</h1>
        <p>{unlocked} of 17 chapters unlocked.</p>
      </div>
      <div className="chapter-list">
        {storyChapters.map((chapter) => {
          const locked = chapter.date > todayKey;
          return (
            <a
              className={`chapter-row ${locked ? 'locked' : ''}`}
              href={locked ? '#/story' : `#/story/${chapter.chapter}`}
              key={chapter.chapter}
            >
              <span>Chapter {chapter.chapter}</span>
              <strong>{locked ? `Chapter ${chapter.chapter}` : chapter.title}</strong>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ChapterView({ chapter, todayKey }) {
  const locked = chapter.date > todayKey;
  return (
    <section className="detail-page">
      <a className="back-link" href="#/story">
        Back to book
      </a>
      {locked ? (
        <LockedPanel label={`Chapter ${chapter.chapter}`} date={chapter.date} />
      ) : (
        <article className="book-page">
          <p className="kicker">Bae&apos;s Anatomy</p>
          <h1>{chapter.title}</h1>
          <p className="date-line">Chapter {chapter.chapter}</p>
          {chapter.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      )}
    </section>
  );
}

function Memories({ todayKey }) {
  const unlockedMemories = days.filter((day) => day.date <= todayKey && day.image);
  return (
    <section className="detail-page">
      <div className="section-heading">
        <p className="kicker">Photo album</p>
        <h1>Unlocked memories</h1>
      </div>
      {unlockedMemories.length ? (
        <div className="memory-grid">
          {unlockedMemories.map((day) => (
            <figure className="memory-card" key={day.day}>
              <img src={day.image} alt={day.imageAlt || ''} />
              <figcaption>
                <span>Day {day.day}</span>
                <strong>{day.title}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="empty-state">Photos will show here after they unlock.</div>
      )}
    </section>
  );
}

function LockedPanel({ label, date }) {
  return (
    <article className="locked-panel">
      <span className="lock-icon" aria-hidden="true">
        LOCK
      </span>
      <h1>{label}</h1>
      <p>This page unlocks on {formatDate(date)}.</p>
    </article>
  );
}

const FONT_SIZES = { sm: '0.88rem', md: '1.05rem', lg: '1.28rem' };

const BOOKMARK_KEY = 'reader-bookmark';
function saveBookmark(chapterNum, fontSize) {
  try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify({ chapterNum, fontSize })); } catch {}
}
function loadBookmark() {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) ?? null; } catch { return null; }
}

const HIGHLIGHTS_KEY = 'reader-highlights';
const NOTES_KEY = 'reader-notes';
const PINS_KEY = 'reader-pins';
function loadHighlights() { try { return new Set(JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY)) ?? []); } catch { return new Set(); } }
function saveHighlights(s) { try { localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify([...s])); } catch {} }
function loadNotes() { try { return JSON.parse(localStorage.getItem(NOTES_KEY)) ?? {}; } catch { return {}; } }
function saveNotes(o) { try { localStorage.setItem(NOTES_KEY, JSON.stringify(o)); } catch {} }
function loadPins() { try { return new Set(JSON.parse(localStorage.getItem(PINS_KEY)) ?? []); } catch { return new Set(); } }
function savePins(s) { try { localStorage.setItem(PINS_KEY, JSON.stringify([...s])); } catch {} }
const V_PAD = 128;

function splitSentences(text) {
  const parts = text.match(/[^.!?]+(?:[.!?]+['")\u2019]?\s*|$)/g);
  if (!parts) return [text];
  const result = parts.map((s) => s.trim()).filter(Boolean);
  return result.length ? result : [text];
}

function unitsToParagraphs(units) {
  const groups = [];
  for (const u of units) {
    const last = groups[groups.length - 1];
    if (last && last.pi === u.pi) {
      last.sentences.push(u.text);
    } else {
      groups.push({ pi: u.pi, sentences: [u.text] });
    }
  }
  return groups.map((g) => g.sentences.join(' '));
}

function buildHTML(units) {
  return unitsToParagraphs(units)
    .map((p) => `<p style="margin:0 0 1.4em">${p}</p>`)
    .join('');
}

// Measure a single chapter's paragraphs into content pages, returns page objects
function measureChapterPages(chapter, fontSize, wrap, availH) {
  const units = [];
  for (let pi = 0; pi < chapter.body.length; pi++) {
    for (const s of splitSentences(chapter.body[pi])) {
      units.push({ text: s, pi });
    }
  }

  const contentPages = [];
  let bucket = [];

  for (const unit of units) {
    const probe = [...bucket, unit];
    wrap.innerHTML = buildHTML(probe);
    if (wrap.scrollHeight > availH && bucket.length > 0) {
      contentPages.push({ type: 'content', chapter: chapter.chapter, chapterTitle: chapter.title, paragraphs: unitsToParagraphs(bucket) });
      bucket = [unit];
    } else {
      bucket = probe;
    }
  }
  if (bucket.length) {
    contentPages.push({ type: 'content', chapter: chapter.chapter, chapterTitle: chapter.title, paragraphs: unitsToParagraphs(bucket) });
  }
  return contentPages;
}

// Build the full book page array across all unlocked chapters
function buildBook(unlockedChapters, allChapters, fontSize) {
  const availH = window.innerHeight - V_PAD;
  const availW = Math.min(window.innerWidth - 56, 680);

  const wrap = document.createElement('div');
  wrap.style.cssText = [
    'position:fixed', 'top:-9999px', 'left:0',
    `width:${availW}px`, `font-size:${FONT_SIZES[fontSize]}`,
    'line-height:1.8', 'visibility:hidden', 'font-family:inherit',
  ].join(';');
  document.body.appendChild(wrap);

  const pages = [];

  // Front matter
  pages.push({ type: 'cover' });
  pages.push({ type: 'book-title' });

  // TOC entry map: chapterNumber → global page index of its title card
  const tocMap = {};

  for (const chapter of unlockedChapters) {
    tocMap[chapter.chapter] = pages.length;
    pages.push({ type: 'chapter-title', chapter: chapter.chapter, chapterTitle: chapter.title });
    const content = measureChapterPages(chapter, fontSize, wrap, availH);
    for (const p of content) pages.push(p);
  }

  document.body.removeChild(wrap);
  return { pages, tocMap };
}

function ReaderView({ todayKey }) {
  const unlockedChapters = storyChapters.filter((c) => c.date <= todayKey);

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

  const shellRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDragging = useRef(false);
  const pageIndexRef = useRef(pageIndex);
  const bookRef = useRef(book);
  const bookmarkApplied = useRef(false);
  const overlayTimerRef = useRef(null);
  const overlayVisibleRef = useRef(false);
  const holdTimerRef = useRef(null);
  useEffect(() => { pageIndexRef.current = pageIndex; }, [pageIndex]);
  useEffect(() => { bookRef.current = book; }, [book]);
  useEffect(() => { overlayVisibleRef.current = overlayVisible; }, [overlayVisible]);
  useEffect(() => () => { clearTimeout(overlayTimerRef.current); clearTimeout(holdTimerRef.current); }, []);

  // Rebuild book whenever font size changes; restore bookmark on first load
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
            ? built.tocMap[bm.chapterNum]
            : 0;
          setPageIndex(target);
        } else {
          // Font size changed — land back on the same chapter
          if (currentChapter && built.tocMap[currentChapter] !== undefined) {
            setPageIndex(built.tocMap[currentChapter]);
          } else {
            setPageIndex(0);
          }
        }
        setBook(built);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize, todayKey]);

  // Persist bookmark on every page turn
  useEffect(() => {
    if (!book) return;
    const pg = book.pages[pageIndex];
    saveBookmark(pg?.chapter ?? null, fontSize);
  }, [pageIndex, book, fontSize]);

  // Touch handlers attached imperatively for passive:false
  useEffect(() => {
    const el = shellRef.current;
    if (!el || !book) return;

    function onTouchStart(e) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = false;
      setSnapping(false);
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = setTimeout(() => {
        if (!isDragging.current && touchStartX.current !== null) {
          const hit = document.elementFromPoint(touchStartX.current, touchStartY.current);
          const para = hit?.closest('[data-para]');
          if (para) {
            setHoldMenu({ x: touchStartX.current, y: touchStartY.current, paraText: para.dataset.para, chapterNum: Number(para.dataset.chapter) });
            touchStartX.current = null; // prevent tap handler
          }
        }
      }, 600);
    }

    function onTouchMove(e) {
      if (touchStartX.current === null) return;
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (!isDragging.current) {
        if (Math.abs(dy) > Math.abs(dx)) { touchStartX.current = null; clearTimeout(holdTimerRef.current); return; }
        if (Math.abs(dx) > 8) { isDragging.current = true; clearTimeout(holdTimerRef.current); }
      }
      if (isDragging.current) { e.preventDefault(); setDragX(dx); }
    }

    function onTouchEnd(e) {
      clearTimeout(holdTimerRef.current);
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;

      if (!isDragging.current) {
        if (!e.target.closest('button, a')) {
          setTocOpen(false);
          if (overlayVisibleRef.current) { hideOverlay(); } else { showOverlay(); }
        }
        return;
      }

      const threshold = window.innerWidth * 0.35;
      const curIndex = pageIndexRef.current;
      const totalPages = bookRef.current.pages.length;
      setSnapping(true);
      setDragX(0);
      hideOverlay();
      setTocOpen(false);

      if (dx < -threshold && curIndex < totalPages - 1) {
        setPageIndex(curIndex + 1);
      } else if (dx > threshold && curIndex > 0) {
        setPageIndex(curIndex - 1);
      }
      setTimeout(() => setSnapping(false), 350);
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      clearTimeout(holdTimerRef.current);
    };
  }, [book]);

  function handleCopy() {
    navigator.clipboard.writeText(holdMenu.paraText).catch(() => {});
    setHoldMenu(null);
  }
  function handleHighlight() {
    setHighlights((prev) => {
      const next = new Set(prev);
      if (next.has(holdMenu.paraText)) { next.delete(holdMenu.paraText); } else { next.add(holdMenu.paraText); }
      saveHighlights(next);
      return next;
    });
    setHoldMenu(null);
  }
  function handlePin() {
    setPins((prev) => {
      const next = new Set(prev);
      if (next.has(holdMenu.paraText)) { next.delete(holdMenu.paraText); } else { next.add(holdMenu.paraText); }
      savePins(next);
      return next;
    });
    setHoldMenu(null);
  }
  function handleNote() {
    setNoteSheet({ paraText: holdMenu.paraText, chapterNum: holdMenu.chapterNum, draft: notes[holdMenu.paraText] ?? '' });
    setHoldMenu(null);
  }
  function handleSaveNote() {
    const { paraText, draft } = noteSheet;
    setNotes((prev) => {
      const next = { ...prev };
      if (draft.trim()) { next[paraText] = draft.trim(); } else { delete next[paraText]; }
      saveNotes(next);
      return next;
    });
    setNoteSheet(null);
  }

  function showOverlay() {
    setOverlayVisible(true);
    clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => setOverlayVisible(false), 4000);
  }

  function hideOverlay() {
    setOverlayVisible(false);
    clearTimeout(overlayTimerRef.current);
  }

  function goToPage(newIdx) {
    setSnapping(true);
    setPageIndex(newIdx);
    setTimeout(() => setSnapping(false), 350);
    if (overlayVisibleRef.current) showOverlay(); // reset auto-hide timer
  }

  if (unlockedChapters.length === 0) {
    return (
      <div className="reader-shell reader-empty">
        <p>No chapters unlocked yet.</p>
        <a href="#/">Back</a>
      </div>
    );
  }

  const pages = book ? book.pages : null;
  const totalPages = pages ? pages.length : 0;
  const W = window.innerWidth;
  const currentPage = pages ? pages[pageIndex] : null;
  const currentChapterTitle = currentPage?.chapterTitle ?? null;
  const currentChapterNum = currentPage?.chapter ?? null;

  let chapterPageNum = null;
  let chapterPageTotal = null;
  if (currentChapterNum && book) {
    const chapterStarts = Object.values(book.tocMap).sort((a, b) => a - b);
    const myStart = book.tocMap[currentChapterNum];
    const nextStart = chapterStarts.find((s) => s > myStart);
    const myEnd = nextStart !== undefined ? nextStart - 1 : totalPages - 1;
    chapterPageNum = pageIndex - myStart + 1;
    chapterPageTotal = myEnd - myStart + 1;
  }

  const progressPct = totalPages > 1 ? (pageIndex / (totalPages - 1)) * 100 : 0;

  const visibleIndices = pages
    ? [pageIndex - 1, pageIndex, pageIndex + 1].filter((i) => i >= 0 && i < totalPages)
    : [];

  return (
    <div className="reader-shell" ref={shellRef}>

      {/* Progress bar */}
      {book && (
        <div className="reader-progress-bar">
          <div className="reader-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      {/* Spinner */}
      {!book && (
        <div className="reader-loading">
          <div className="reader-spinner" />
        </div>
      )}

      {/* Page stage */}
      {book && (
        <div className="reader-stage">
          {visibleIndices.map((idx) => {
            const pg = pages[idx];
            const offset = (idx - pageIndex) * W + dragX;
            const cls = `reader-page${snapping ? ' reader-page-snap' : ''}`;

            if (pg.type === 'cover') {
              return (
                <div key={idx} className={`${cls} reader-page-cover`} style={{ transform: `translateX(${offset}px)` }}>
                  <p className="reader-cover-eyebrow">A story in 17 parts</p>
                  <h1 className="reader-cover-title">Bae's Anatomy</h1>
                  <p className="reader-cover-sub">For Jessica</p>
                </div>
              );
            }

            if (pg.type === 'book-title') {
              return (
                <div key={idx} className={`${cls} reader-page-booktitle`} style={{ transform: `translateX(${offset}px)` }}>
                  <h2 className="reader-booktitle-title">Bae's Anatomy</h2>
                  <p className="reader-booktitle-author">A Birthday Month Story</p>
                  <p className="reader-booktitle-dedication">For the woman who makes everything worth writing down.</p>
                </div>
              );
            }

            if (pg.type === 'chapter-title') {
              return (
                <div key={idx} className={`${cls} reader-page-chaptertitle`} style={{ transform: `translateX(${offset}px)` }}>
                  <p className="reader-chaptertitle-num">Chapter {pg.chapter}</p>
                  <h2 className="reader-chaptertitle-name">{pg.chapterTitle}</h2>
                </div>
              );
            }

            // content page
            return (
              <div key={idx} className={cls} style={{ transform: `translateX(${offset}px)`, fontSize: FONT_SIZES[fontSize] }}>
                <div className="reader-text">
                  {pg.paragraphs.map((para, i) => (
                    <p
                      key={i}
                      data-para={para}
                      data-chapter={pg.chapter}
                      className={[
                        highlights.has(para) ? 'reader-para-hl' : '',
                        notes[para] ? 'reader-para-noted' : '',
                        pins.has(para) ? 'reader-para-pinned' : '',
                      ].filter(Boolean).join(' ') || undefined}
                    >
                      {para}
                      {notes[para] && <span className="reader-note-dot">💬</span>}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hold menu */}
      {holdMenu && (() => {
        const menuW = 200;
        const left = Math.max(12, Math.min(holdMenu.x - menuW / 2, window.innerWidth - menuW - 12));
        const top = Math.max(60, holdMenu.y - 224);
        const isHl = highlights.has(holdMenu.paraText);
        const isPinned = pins.has(holdMenu.paraText);
        const hasNote = !!notes[holdMenu.paraText];
        return (
          <div className="reader-hold-backdrop" onClick={() => setHoldMenu(null)}>
            <div className="reader-hold-menu" style={{ left, top }} onClick={(e) => e.stopPropagation()}>
              <button type="button" className="reader-hold-action" onClick={handleCopy}>
                <span className="reader-hold-icon">⎘</span>Copy
              </button>
              <button type="button" className={`reader-hold-action${isHl ? ' active' : ''}`} onClick={handleHighlight}>
                <span className="reader-hold-icon">◈</span>{isHl ? 'Remove highlight' : 'Highlight'}
              </button>
              <button type="button" className={`reader-hold-action${hasNote ? ' active' : ''}`} onClick={handleNote}>
                <span className="reader-hold-icon">✎</span>{hasNote ? 'Edit note' : 'Add note'}
              </button>
              <button type="button" className={`reader-hold-action${isPinned ? ' active' : ''}`} onClick={handlePin}>
                <span className="reader-hold-icon">⊕</span>{isPinned ? 'Unpin' : 'Pin'}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Note sheet */}
      {noteSheet && (
        <div className="reader-note-sheet" onClick={() => setNoteSheet(null)}>
          <div className="reader-note-panel" onClick={(e) => e.stopPropagation()}>
            <div className="reader-note-header">
              <span>Your note</span>
              <button type="button" className="reader-toc-close" onClick={() => setNoteSheet(null)}>✕</button>
            </div>
            <p className="reader-note-quote">
              {noteSheet.paraText.length > 120 ? noteSheet.paraText.slice(0, 120) + '…' : noteSheet.paraText}
            </p>
            <textarea
              className="reader-note-textarea"
              value={noteSheet.draft}
              onChange={(e) => setNoteSheet((n) => ({ ...n, draft: e.target.value }))}
              placeholder="Write your note here…"
              rows={4}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <div className="reader-note-actions">
              <button type="button" className="reader-note-btn reader-note-cancel" onClick={() => setNoteSheet(null)}>Cancel</button>
              <button type="button" className="reader-note-btn reader-note-save" onClick={handleSaveNote}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* TOC sheet */}
      {tocOpen && book && (
        <div className="reader-toc-sheet" onClick={() => setTocOpen(false)}>
          <div className="reader-toc-panel" onClick={(e) => e.stopPropagation()}>
            <div className="reader-toc-header">
              <span>Table of Contents</span>
              <button type="button" className="reader-toc-close" onClick={() => setTocOpen(false)}>✕</button>
            </div>
            <div className="reader-toc-list">
              <button type="button" className="reader-toc-row" onClick={() => { setPageIndex(0); setTocOpen(false); setOverlayVisible(false); }}>
                <span className="reader-toc-label">Cover</span>
              </button>
              <button type="button" className="reader-toc-row" onClick={() => { setPageIndex(1); setTocOpen(false); setOverlayVisible(false); }}>
                <span className="reader-toc-label">Title Page</span>
              </button>
              {storyChapters.map((c) => {
                const locked = c.date > todayKey;
                const globalIdx = book.tocMap[c.chapter];
                return (
                  <button
                    key={c.chapter}
                    type="button"
                    className={`reader-toc-row${locked ? ' reader-toc-locked' : ''}${currentChapterNum === c.chapter ? ' reader-toc-active' : ''}`}
                    disabled={locked}
                    onClick={() => { if (!locked) { setPageIndex(globalIdx); setTocOpen(false); setOverlayVisible(false); } }}
                  >
                    <span className="reader-toc-num">Chapter {c.chapter}</span>
                    <span className="reader-toc-label">{locked ? '—' : c.title}</span>
                    {locked && <span className="reader-toc-lock">🔒</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {book && (
        <div className={`reader-overlay${overlayVisible ? ' reader-overlay-visible' : ''}`}>
          <div className="reader-top-bar">
            <a className="reader-back-btn" href="#/">← Back</a>
            <span className="reader-chapter-label">
              {currentChapterNum ? `Ch. ${currentChapterNum}` : 'Bae\'s Anatomy'}
            </span>
            <div className="reader-font-btns">
              {['sm', 'md', 'lg'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`reader-font-btn reader-font-${s}${fontSize === s ? ' active' : ''}`}
                  onClick={() => { setFontSize(s); setOverlayVisible(false); }}
                >
                  A
                </button>
              ))}
            </div>
          </div>

          <div className="reader-bottom-bar">
            <div className="reader-page-nav">
              <button
                type="button"
                className="reader-nav-btn"
                disabled={pageIndex === 0}
                onClick={() => goToPage(Math.max(pageIndex - 1, 0))}
              >‹</button>
              <div className="reader-page-count">
                {currentChapterNum
                  ? <span className="reader-count-chapter">Ch. {currentChapterNum} · {chapterPageNum} of {chapterPageTotal}</span>
                  : null}
                <span className="reader-count-global">{pageIndex + 1} / {totalPages}</span>
              </div>
              <button
                type="button"
                className="reader-nav-btn"
                disabled={pageIndex === totalPages - 1}
                onClick={() => goToPage(Math.min(pageIndex + 1, totalPages - 1))}
              >›</button>
            </div>
            <button
              type="button"
              className="reader-toc-btn"
              onClick={() => { setTocOpen(true); setOverlayVisible(false); }}
            >
              <span className="reader-toc-btn-chapter">
                {currentChapterTitle ?? 'Bae\'s Anatomy'}
              </span>
              <span className="reader-toc-btn-label">Table of Contents</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <a href="#/">Path</a>
      <a href="#/story">Book</a>
      <a href="#/memories">Photos</a>
      <a href="#/reader" className="nav-reader-tab">Read ✦</a>
    </nav>
  );
}

function normalizeGuess(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^torchystacos$/, 'torchystacos');
}

function formatDate(dateKey) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateKey}T00:00:00Z`));
}

export default App;
