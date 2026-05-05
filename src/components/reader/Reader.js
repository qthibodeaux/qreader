import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ledgerEntries, ledgerTypes } from '../../content/ledger';
import { useSnapCarousel } from '../../hooks/useSnapCarousel';
import {
  getLedgerEntriesThroughChapter,
  getLedgerEntryDisplayName,
  getTimelineThroughChapter,
  findLedgerEntriesInText,
  resolveLedgerRelationships,
} from '../../utils/ledgerUtils';
import {
  getInitialReaderSettings,
  loadReaderState,
  loadSavedItems,
  saveReaderState,
  saveSavedItems,
} from '../../utils/readerStorage';
import './Reader.css';

const FONT_SIZES = {
  xs: '1.18rem',
  sm: '1.42rem',
  md: '1.72rem',
  lg: '2.05rem',
  xl: '2.45rem',
};

const TYPEFACES = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  literary: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
  modern: "'Trebuchet MS', 'Segoe UI', sans-serif",
  mono: "'Courier New', Courier, monospace",
};

const COLUMN_GAP = 36;
const SEARCH_EXCERPT_RADIUS = 72;
const HIGHLIGHT_CLASS = 'reader-persistent-highlight';

function getUnlockedChapters(bookData) {
  const todayKey = new Date().toISOString().slice(0, 10);
  return bookData.chapters.filter((chapter) => !chapter.date || chapter.date <= todayKey);
}

function Reader({ bookData, onExit }) {
  const savedReaderState = useMemo(() => loadReaderState(bookData.id), [bookData.id]);
  const flowWrapRef = useRef(null);
  const flowRef = useRef(null);
  const visiblePageTextRef = useRef(null);
  const toolRailRef = useRef(null);
  const dockRef = useRef(null);
  const chapterRefs = useRef(new Map());
  const selectionMenuRef = useRef(null);
  const pendingRatioRef = useRef(savedReaderState?.progressRatio ?? null);
  const pageIndexRef = useRef(0);
  const totalPagesRef = useRef(1);
  const overlayTimerRef = useRef(null);
  const hasMeasuredInitialPageRef = useRef(false);
  const canPersistReaderStateRef = useRef(false);

  const [settings, setSettings] = useState(() => getInitialReaderSettings(bookData.id));
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageStride, setPageStride] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [activeSavedTab, setActiveSavedTab] = useState('all');
  const [chapterStarts, setChapterStarts] = useState([]);
  const [isFormatting, setIsFormatting] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const [activeLedgerType, setActiveLedgerType] = useState('all');
  const [activeLedgerEntryId, setActiveLedgerEntryId] = useState(null);
  const [onThisPageEntries, setOnThisPageEntries] = useState([]);
  const [selectionMenu, setSelectionMenu] = useState(null);
  const [savedItems, setSavedItems] = useState(() => loadSavedItems(bookData.id));

  const chapters = useMemo(() => getUnlockedChapters(bookData), [bookData]);

  const searchResults = useMemo(
    () => buildSearchResults(chapters, chapterStarts, searchQuery),
    [chapters, chapterStarts, searchQuery]
  );
  const activeSearchResult = searchResults[activeSearchIndex] ?? null;
  const highlightsByParagraph = useMemo(
    () => groupHighlightRanges(savedItems),
    [savedItems]
  );

  useEffect(() => {
    setActiveSearchIndex(0);
  }, [searchQuery]);

  useLayoutEffect(() => {
    pageIndexRef.current = pageIndex;
  }, [pageIndex]);

  useLayoutEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  useEffect(() => {
    return () => {
      window.clearTimeout(overlayTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (activePanel) {
      window.clearTimeout(overlayTimerRef.current);
    }
  }, [activePanel]);

  const scheduleOverlayHide = useCallback((layer = activePanel ? 'panel' : 'hud') => {
    window.clearTimeout(overlayTimerRef.current);
    if (layer !== 'hud') {
      return;
    }

    overlayTimerRef.current = window.setTimeout(() => {
      setOverlayVisible(false);
    }, 7000);
  }, [activePanel]);

  const showOverlay = useCallback((panel = null) => {
    setActivePanel(panel);
    setOverlayVisible(true);
    scheduleOverlayHide(panel ? 'panel' : 'hud');
  }, [scheduleOverlayHide]);

  const hideOverlay = useCallback(() => {
    window.clearTimeout(overlayTimerRef.current);
    setActivePanel(null);
    setOverlayVisible(false);
  }, []);

  const clearReaderSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    setSelectionMenu(null);
  }, []);

  const handleReaderTap = () => {
    if (selectionMenu) {
      clearReaderSelection();
      return;
    }

    if (overlayVisible) {
      hideOverlay();
    } else {
      showOverlay();
    }
  };

  const handleMenuInteraction = () => {
    if (overlayVisible) {
      scheduleOverlayHide(activePanel ? 'panel' : 'hud');
    }
  };

  const measurePages = useCallback(() => {
    const wrap = flowWrapRef.current;
    const flow = flowRef.current;
    if (!wrap || !flow) {
      return;
    }

    const columnWidth = wrap.clientWidth;
    const nextStride = columnWidth + COLUMN_GAP;
    const measuredPages = Math.max(
      1,
      Math.ceil((flow.scrollWidth + COLUMN_GAP) / nextStride)
    );
    const flowLeft = flow.getBoundingClientRect().left;
    const measuredChapterStarts = chapters.map((chapter) => {
      const node = chapterRefs.current.get(chapter.chapter);
      const chapterLeft = node ? node.getBoundingClientRect().left - flowLeft : 0;
      return {
        chapter: chapter.chapter,
        title: chapter.title,
        pageIndex: Math.min(
          measuredPages - 1,
          Math.max(0, Math.round(chapterLeft / nextStride))
        ),
      };
    });
    const ratio =
      pendingRatioRef.current ??
      (!canPersistReaderStateRef.current && savedReaderState?.progressRatio !== undefined
        ? savedReaderState.progressRatio
        : pageIndexRef.current / Math.max(totalPagesRef.current - 1, 1));
    const nextIndex = Math.min(
      measuredPages - 1,
      Math.max(0, Math.round(ratio * Math.max(measuredPages - 1, 0)))
    );

    pendingRatioRef.current = null;
    setPageStride(nextStride);
    setTotalPages(measuredPages);
    setPageIndex(nextIndex);
    setChapterStarts(measuredChapterStarts);
    setIsFormatting(false);
    hasMeasuredInitialPageRef.current = true;
  }, [bookData.id, chapters, savedReaderState]);

  useLayoutEffect(() => {
    setIsFormatting(true);
    const frame = requestAnimationFrame(measurePages);
    return () => cancelAnimationFrame(frame);
  }, [settings.fontSize, settings.typeface, chapters, measurePages]);

  useLayoutEffect(() => {
    const wrap = flowWrapRef.current;
    if (!wrap) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      if (canPersistReaderStateRef.current) {
        pendingRatioRef.current =
          pageIndexRef.current / Math.max(totalPagesRef.current - 1, 1);
      }
      measurePages();
    });

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [measurePages]);

  useLayoutEffect(() => {
    if (!activeSearchResult || !pageStride) {
      return;
    }

    const flow = flowRef.current;
    const matchNode = flow?.querySelector(
      `[data-search-match-id="${activeSearchResult.id}"]`
    );
    if (!flow || !matchNode) {
      return;
    }

    const flowLeft = flow.getBoundingClientRect().left;
    const matchLeft = matchNode.getBoundingClientRect().left - flowLeft;
    const matchPage = Math.min(
      totalPages - 1,
      Math.max(0, Math.round(matchLeft / pageStride))
    );
    setPageIndex(matchPage);
  }, [activeSearchResult, pageStride, totalPages]);

  useEffect(() => {
    function handleSelectionChange() {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim() || '';
      const flow = flowRef.current;

      if (!selection || !selectedText || !flow || selection.rangeCount === 0) {
        setSelectionMenu(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const ancestor = range.commonAncestorContainer;
      const ancestorElement =
        ancestor.nodeType === Node.ELEMENT_NODE ? ancestor : ancestor.parentElement;

      if (!ancestorElement || !flow.contains(ancestorElement)) {
        setSelectionMenu(null);
        return;
      }

      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        return;
      }

      setSelectionMenu({
        text: selectedText,
        ranges: getSelectedParagraphRanges(range, flow),
        x: Math.min(window.innerWidth - 128, Math.max(12, rect.left + rect.width / 2 - 94)),
        y: Math.min(window.innerHeight - 72, Math.max(72, rect.top - 52)),
      });
    }

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const updateReflowSetting = (key, value) => {
    pendingRatioRef.current = pageIndex / Math.max(totalPages - 1, 1);
    setIsFormatting(true);
    setSettings((current) => ({ ...current, [key]: value }));
    scheduleOverlayHide(activePanel ? 'panel' : 'hud');
  };

  const updateDisplaySetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    scheduleOverlayHide(activePanel ? 'panel' : 'hud');
  };

  const currentBookmark = savedItems.find(
    (item) => item.type === 'bookmark' && item.pageIndex === pageIndex
  );

  const toggleCurrentBookmark = () => {
    const existingBookmark = savedItems.find(
      (item) => item.type === 'bookmark' && item.pageIndex === pageIndex
    );
    let nextItems;

    if (existingBookmark) {
      nextItems = savedItems.filter((item) => item.id !== existingBookmark.id);
    } else {
      nextItems = [
        {
          id: `bookmark-${pageIndex}-${Date.now()}`,
          type: 'bookmark',
          bookId: bookData.id,
          pageIndex,
          progressRatio: pageIndex / Math.max(totalPages - 1, 1),
          chapter: currentChapter?.chapter ?? null,
          chapterTitle: currentChapter?.title ?? bookData.title,
          label: `Page ${pageIndex + 1}`,
          excerpt: null,
          note: null,
          color: null,
          createdAt: new Date().toISOString(),
        },
        ...savedItems,
      ];
    }

    setSavedItems(nextItems);
    saveSavedItems(bookData.id, nextItems);
    setActiveSavedTab('bookmarks');
    showOverlay('saved');
  };

  const removeSavedItem = (itemId) => {
    const nextItems = savedItems.filter((item) => item.id !== itemId);

    setSavedItems(nextItems);
    saveSavedItems(bookData.id, nextItems);
  };

  const addSavedSelection = (type) => {
    if (!selectionMenu?.text) {
      return;
    }

    const createdAt = new Date().toISOString();
    const rangeItems = selectionMenu.ranges?.length
      ? selectionMenu.ranges.map((range, index) => ({
          id: `${type}-${pageIndex}-${Date.now()}-${index}`,
          type,
          bookId: bookData.id,
          pageIndex,
          progressRatio: pageIndex / Math.max(totalPages - 1, 1),
          chapter: range.chapter,
          chapterTitle: currentChapter?.title ?? bookData.title,
          label: type === 'note' ? 'Note' : 'Highlight',
          excerpt: range.text,
          note: type === 'note' ? '' : null,
          color: type === 'highlight' ? 'accent' : null,
          anchor: {
            chapter: range.chapter,
            paragraphIndex: range.paragraphIndex,
            startOffset: range.startOffset,
            endOffset: range.endOffset,
          },
          createdAt,
        }))
      : [{
          id: `${type}-${pageIndex}-${Date.now()}`,
          type,
          bookId: bookData.id,
          pageIndex,
          progressRatio: pageIndex / Math.max(totalPages - 1, 1),
          chapter: currentChapter?.chapter ?? null,
          chapterTitle: currentChapter?.title ?? bookData.title,
          label: type === 'note' ? 'Note' : 'Highlight',
          excerpt: selectionMenu.text,
          note: type === 'note' ? '' : null,
          color: type === 'highlight' ? 'accent' : null,
          createdAt,
        }];
    const nextItems = [...rangeItems, ...savedItems];

    setSavedItems(nextItems);
    saveSavedItems(bookData.id, nextItems);
    setActiveSavedTab(type === 'note' ? 'notes' : 'highlights');
    clearReaderSelection();
    showOverlay('saved');
  };

  const copySelection = () => {
    if (!selectionMenu?.text) {
      return;
    }

    navigator.clipboard?.writeText(selectionMenu.text).catch(() => {});
    clearReaderSelection();
  };

  useEffect(() => {
    if (!hasMeasuredInitialPageRef.current) {
      return;
    }

    if (!canPersistReaderStateRef.current) {
      canPersistReaderStateRef.current = true;
      return;
    }

    saveReaderState(bookData.id, {
      bookId: bookData.id,
      pageIndex,
      progressRatio: pageIndex / Math.max(totalPages - 1, 1),
      settings,
      totalPages,
      updatedAt: new Date().toISOString(),
    });
  }, [bookData.id, pageIndex, settings, totalPages]);

  const { dragX, isDragging, carouselHandlers } = useSnapCarousel({
    count: totalPages,
    index: pageIndex,
    onIndexChange: setPageIndex,
    threshold: 58,
    velocityThreshold: 0.35,
  });

  const progressPercent =
    totalPages > 1 ? Math.round((pageIndex / (totalPages - 1)) * 100) : 0;
  const translateX = -(pageIndex * pageStride) + dragX;
  const currentChapter = [...chapterStarts]
    .reverse()
    .find((chapter) => chapter.pageIndex <= pageIndex);
  const ledgerChapterNumber = currentChapter?.chapter ?? 1;
  const readerThemeClass = `reader-theme-${settings.theme}`;

  useLayoutEffect(() => {
    const wrap = flowWrapRef.current;
    const flow = flowRef.current;

    if (!wrap || !flow || !pageStride || isFormatting || activePanel) {
      setOnThisPageEntries([]);
      return;
    }

    const pageText = getVisiblePageText(wrap, flow, {
      bottomBoundary: dockRef.current?.getBoundingClientRect().top,
      topBoundary: toolRailRef.current?.getBoundingClientRect().bottom,
    });
    if (visiblePageTextRef.current) {
      visiblePageTextRef.current.textContent = pageText;
    }

    const availableEntries = getLedgerEntriesThroughChapter(ledgerEntries, ledgerChapterNumber);
    const scannerText = visiblePageTextRef.current?.textContent || pageText;

    const matches = findLedgerEntriesInText(
      scannerText,
      availableEntries,
      {
        excludedAliases: ['His', 'The', 'And', 'But', 'Soon', 'Nest', 'Time', 'Practice', 'Say'],
        minAliasLength: 3,
      }
    );

    setOnThisPageEntries(matches.slice(0, 8).map((match) => match.entry));
  }, [
    activePanel,
    isFormatting,
    ledgerChapterNumber,
    overlayVisible,
    pageIndex,
    pageStride,
    settings.fontSize,
    settings.typeface,
  ]);

  return (
    <main className={`reader-shell ${readerThemeClass}`}>
      {isFormatting && (
        <div className="reader-formatting" aria-live="polite">
          <div className="reader-spinner" />
          <p>Formatting Page...</p>
        </div>
      )}

      <section
        className={`reader-page-stage${isDragging ? ' reader-page-stage-dragging' : ''}`}
        onClick={handleReaderTap}
        {...carouselHandlers}
      >
        <div className="reader-page-window">
          <div className="reader-flow-wrap" ref={flowWrapRef}>
            <article
              className="reader-flow"
              ref={flowRef}
              style={{
                '--reader-font-size': FONT_SIZES[settings.fontSize],
                '--reader-font-family': TYPEFACES[settings.typeface],
                '--reader-column-gap': `${COLUMN_GAP}px`,
                '--reader-column-width': pageStride
                  ? `${Math.max(pageStride - COLUMN_GAP, 0)}px`
                  : 'calc(100vw - 44px)',
                transform: `translateX(${translateX}px)`,
              }}
            >
              <header className="reader-cover-page">
                <div>
                  <p>{bookData.author || 'Lantern Reader'}</p>
                  <h1>{bookData.title}</h1>
                  <span>{bookData.subtitle}</span>
                </div>
              </header>

              <section className="reader-title-page">
                <p>{bookData.subtitle}</p>
                <h1>{bookData.title}</h1>
                <span>For Jessica</span>
              </section>

              {chapters.map((chapter) => (
                <section
                  className="reader-chapter-flow"
                  key={chapter.chapter}
                >
                  <header
                    className="reader-chapter-title-page"
                    ref={(node) => {
                      if (node) {
                        chapterRefs.current.set(chapter.chapter, node);
                      } else {
                        chapterRefs.current.delete(chapter.chapter);
                      }
                    }}
                  >
                    <p>Chapter {chapter.chapter}</p>
                    <h2>{chapter.title.replace(/^Chapter \d+:\s*/, '')}</h2>
                  </header>
                  {chapter.body.map((paragraph, index) => (
                    <p
                      data-chapter={chapter.chapter}
                      data-paragraph-index={index}
                      data-reader-paragraph="true"
                      key={`${chapter.chapter}-${index}`}
                    >
                      <RenderedParagraphText
                        activeMatchId={activeSearchResult?.id}
                        chapterNumber={chapter.chapter}
                        highlights={highlightsByParagraph.get(getParagraphKey(chapter.chapter, index)) ?? []}
                        paragraph={paragraph}
                        paragraphIndex={index}
                        query={searchQuery}
                      />
                    </p>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </div>
      </section>

      <output
        aria-hidden="true"
        className="reader-visible-text-source"
        ref={visiblePageTextRef}
      />

      <div className="reader-page-number" aria-hidden="true">
        {pageIndex + 1}
      </div>

      {selectionMenu && (
        <div
          className="reader-selection-menu"
          ref={selectionMenuRef}
          style={{ left: `${selectionMenu.x}px`, top: `${selectionMenu.y}px` }}
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" onClick={() => addSavedSelection('highlight')}>
            Highlight
          </button>
          <button type="button" onClick={() => addSavedSelection('note')}>
            Note
          </button>
          <button type="button" onClick={copySelection}>
            Copy
          </button>
        </div>
      )}

      <div
        className={`reader-controls${overlayVisible ? ' reader-controls-visible' : ''}`}
        onClick={hideOverlay}
      >
        <div className="reader-scrim" aria-hidden="true" />
        <div
          className="reader-tool-rail"
          ref={toolRailRef}
          onClick={(event) => event.stopPropagation()}
        >
          <button className="reader-back-action" type="button" onClick={onExit}>
            <IconChevronLeft />
            Library
          </button>
          <div className="reader-tool-actions">
            <button
              className={activePanel === 'appearance' ? 'active' : ''}
              type="button"
              aria-label="Appearance"
              onClick={() => showOverlay(activePanel === 'appearance' ? null : 'appearance')}
            >
              <IconType />
            </button>
            <button
              type="button"
              aria-label="Search"
              onClick={() => showOverlay('search')}
            >
              <IconSearch />
            </button>
            <button
              className={activePanel === 'ledger' ? 'active' : ''}
              type="button"
              aria-label="Hillpoint Ledger"
              onClick={() => {
                setActiveLedgerEntryId(null);
                showOverlay('ledger');
              }}
            >
              <IconLedger />
            </button>
            <button
              className={currentBookmark ? 'active' : ''}
              type="button"
              aria-label="Saved items"
              onClick={() => {
                setActiveSavedTab('bookmarks');
                showOverlay('saved');
              }}
            >
              <IconBookmark />
            </button>
          </div>
        </div>

        <div
          className={`reader-dock${activePanel ? ' reader-dock-expanded' : ''}`}
          ref={dockRef}
          onClick={(event) => {
            event.stopPropagation();
            handleMenuInteraction();
          }}
        >
          {!activePanel && (
            <>
              <OnThisPageStrip
                chapterNumber={ledgerChapterNumber}
                entries={onThisPageEntries}
                onOpenEntry={(entryId) => {
                  setActiveLedgerEntryId(entryId);
                  showOverlay('ledger');
                }}
              />
              <ReaderHud
                chapter={currentChapter}
                onNext={() => {
                  setPageIndex((current) => Math.min(totalPages - 1, current + 1));
                  scheduleOverlayHide('hud');
                }}
                onPrevious={() => {
                  setPageIndex((current) => Math.max(0, current - 1));
                  scheduleOverlayHide('hud');
                }}
                onToc={() => showOverlay('toc')}
                pageIndex={pageIndex}
                progressPercent={progressPercent}
                totalPages={totalPages}
              />
            </>
          )}

          {activePanel === 'appearance' && (
            <AppearancePanel
              settings={settings}
              onDisplayChange={updateDisplaySetting}
              onReflowChange={updateReflowSetting}
            />
          )}

          {activePanel === 'toc' && (
            <TocPanel
              chapterStarts={chapterStarts}
              currentChapter={currentChapter}
              totalPages={totalPages}
              onJump={(nextPageIndex) => {
                setPageIndex(nextPageIndex);
                hideOverlay();
              }}
            />
          )}

          {activePanel === 'search' && (
            <SearchPanel
              activeIndex={activeSearchIndex}
              query={searchQuery}
              results={searchResults}
              onJump={(nextPageIndex) => {
                setPageIndex(nextPageIndex);
              }}
              onNext={() => setActiveSearchIndex((current) => (
                searchResults.length ? (current + 1) % searchResults.length : 0
              ))}
              onPrevious={() => setActiveSearchIndex((current) => (
                searchResults.length
                  ? (current - 1 + searchResults.length) % searchResults.length
                  : 0
              ))}
              onQueryChange={setSearchQuery}
              onSelectResult={setActiveSearchIndex}
            />
          )}

          {activePanel === 'saved' && (
            <SavedItemsPanel
              activeTab={activeSavedTab}
              currentBookmark={currentBookmark}
              items={savedItems}
              onJump={(nextPageIndex) => {
                setPageIndex(nextPageIndex);
                hideOverlay();
              }}
              onRemoveItem={removeSavedItem}
              onTabChange={setActiveSavedTab}
              onToggleBookmark={toggleCurrentBookmark}
            />
          )}

          {activePanel === 'ledger' && (
            <LedgerPanel
              activeEntryId={activeLedgerEntryId}
              activeType={activeLedgerType}
              chapterNumber={currentChapter?.chapter ?? 1}
              onEntrySelect={setActiveLedgerEntryId}
              onTypeChange={(nextType) => {
                setActiveLedgerType(nextType);
                setActiveLedgerEntryId(null);
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function RenderedParagraphText({
  activeMatchId,
  chapterNumber,
  highlights,
  paragraph,
  paragraphIndex,
  query,
}) {
  const trimmedQuery = query.trim();
  const events = [];

  highlights.forEach((highlight, index) => {
    events.push({
      end: highlight.endOffset,
      id: highlight.id,
      kind: 'highlight',
      start: highlight.startOffset,
      priority: 1,
      index,
    });
  });

  if (trimmedQuery.length >= 2) {
    const lowerParagraph = paragraph.toLowerCase();
    const lowerQuery = trimmedQuery.toLowerCase();
    let matchIndex = lowerParagraph.indexOf(lowerQuery);

    while (matchIndex !== -1) {
      events.push({
        end: matchIndex + trimmedQuery.length,
        id: getSearchMatchId(chapterNumber, paragraphIndex, matchIndex),
        kind: 'search',
        start: matchIndex,
        priority: 2,
      });

      matchIndex = lowerParagraph.indexOf(lowerQuery, matchIndex + trimmedQuery.length);
    }
  }

  if (!events.length) {
    return paragraph;
  }

  const boundaries = new Set([0, paragraph.length]);
  events.forEach((event) => {
    boundaries.add(Math.max(0, Math.min(paragraph.length, event.start)));
    boundaries.add(Math.max(0, Math.min(paragraph.length, event.end)));
  });

  const points = [...boundaries].sort((a, b) => a - b);
  const pieces = [];

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const text = paragraph.slice(start, end);
    if (!text) {
      continue;
    }

    const activeEvents = events
      .filter((event) => event.start <= start && event.end >= end)
      .sort((a, b) => b.priority - a.priority);
    const topEvent = activeEvents[0];

    if (!topEvent) {
      pieces.push(text);
      continue;
    }

    const isSearch = topEvent.kind === 'search';
    const isActiveSearch = isSearch && topEvent.id === activeMatchId;
    const className = isSearch
      ? `reader-search-mark${isActiveSearch ? ' active' : ''}`
      : HIGHLIGHT_CLASS;

    pieces.push(
      <mark
        className={className}
        data-search-match-id={isSearch ? topEvent.id : undefined}
        key={`${topEvent.kind}-${topEvent.id}-${start}-${end}`}
      >
        {text}
      </mark>
    );
  }

  return pieces;
}

function groupHighlightRanges(items) {
  const grouped = new Map();

  items
    .filter((item) => item.type === 'highlight' && item.anchor)
    .forEach((item) => {
      const key = getParagraphKey(item.anchor.chapter, item.anchor.paragraphIndex);
      const list = grouped.get(key) ?? [];
      list.push({
        id: item.id,
        startOffset: item.anchor.startOffset,
        endOffset: item.anchor.endOffset,
      });
      grouped.set(key, list);
    });

  return grouped;
}

function getParagraphKey(chapter, paragraphIndex) {
  return `${chapter}:${paragraphIndex}`;
}

function getSelectedParagraphRanges(range, flow) {
  return [...flow.querySelectorAll('[data-reader-paragraph="true"]')]
    .filter((paragraphNode) => range.intersectsNode(paragraphNode))
    .map((paragraphNode) => {
      const textLength = paragraphNode.textContent.length;
      const containsStart = paragraphNode.contains(range.startContainer);
      const containsEnd = paragraphNode.contains(range.endContainer);
      const startOffset = containsStart
        ? getTextOffset(paragraphNode, range.startContainer, range.startOffset)
        : 0;
      const endOffset = containsEnd
        ? getTextOffset(paragraphNode, range.endContainer, range.endOffset)
        : textLength;
      const normalizedStart = Math.max(0, Math.min(textLength, startOffset));
      const normalizedEnd = Math.max(normalizedStart, Math.min(textLength, endOffset));

      return {
        chapter: Number(paragraphNode.dataset.chapter),
        paragraphIndex: Number(paragraphNode.dataset.paragraphIndex),
        startOffset: normalizedStart,
        endOffset: normalizedEnd,
        text: paragraphNode.textContent.slice(normalizedStart, normalizedEnd).trim(),
      };
    })
    .filter((selectionRange) => selectionRange.text);
}

function getTextOffset(root, targetNode, targetOffset) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let node = walker.nextNode();

  while (node) {
    if (node === targetNode) {
      return offset + targetOffset;
    }

    offset += node.textContent.length;
    node = walker.nextNode();
  }

  return offset;
}

function buildSearchResults(chapters, chapterStarts, query) {
  const trimmedQuery = query.trim().toLowerCase();
  if (trimmedQuery.length < 2) {
    return [];
  }

  const results = [];

  chapters.forEach((chapter) => {
    const chapterStart = chapterStarts.find((start) => start.chapter === chapter.chapter);
    chapter.body.forEach((paragraph, paragraphIndex) => {
      const haystack = paragraph.toLowerCase();
      let matchIndex = haystack.indexOf(trimmedQuery);

      while (matchIndex !== -1) {
        const excerptStart = Math.max(0, matchIndex - SEARCH_EXCERPT_RADIUS);
        const excerptEnd = Math.min(
          paragraph.length,
          matchIndex + trimmedQuery.length + SEARCH_EXCERPT_RADIUS
        );
        const prefix = excerptStart > 0 ? '...' : '';
        const suffix = excerptEnd < paragraph.length ? '...' : '';

        results.push({
          id: getSearchMatchId(chapter.chapter, paragraphIndex, matchIndex),
          resultIndex: results.length,
          chapter: chapter.chapter,
          chapterTitle: chapter.title,
          pageIndex: chapterStart?.pageIndex ?? 0,
          excerpt: `${prefix}${paragraph.slice(excerptStart, excerptEnd)}${suffix}`,
        });

        matchIndex = haystack.indexOf(trimmedQuery, matchIndex + trimmedQuery.length);
      }
    });
  });

  return results;
}

function getSearchMatchId(chapterNumber, paragraphIndex, matchIndex) {
  return `search-${chapterNumber}-${paragraphIndex}-${matchIndex}`;
}

function getChapterPageSpan(chapterStarts, index, totalPages) {
  const chapter = chapterStarts[index];
  const nextChapter = chapterStarts[index + 1];
  const endPage = nextChapter ? nextChapter.pageIndex - 1 : totalPages - 1;
  return Math.max(1, endPage - chapter.pageIndex + 1);
}

function getVisiblePageText(wrap, flow, boundaries = {}) {
  const wrapRect = wrap.getBoundingClientRect();
  
  // Use a slightly smaller vertical window than the actual UI boundaries
  // This ensures we only catch text that is comfortably visible
  const visibleRect = {
    left: wrapRect.left,
    right: wrapRect.right,
    top: (boundaries.topBoundary ?? wrapRect.top) + 5,
    bottom: (boundaries.bottomBoundary ?? wrapRect.bottom) - 10,
  };
  
  // Create an intersection observer-like walker that filters out UI elements
  const walker = document.createTreeWalker(flow, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      // Exclude text that is part of the "source" display or other UI
      if (node.parentElement?.closest('.reader-visible-text-source, .reader-controls, .reader-selection-menu')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const visibleText = [];
  let node = walker.nextNode();

  while (node) {
    const text = node.textContent;

    if (text.trim()) {
      const range = document.createRange();
      range.selectNodeContents(node);

      // Fast check: is any part of this text node in the viewport?
      const rects = range.getClientRects();
      const isNodeNearVisibleArea = Array.from(rects).some((rect) => (
        rectIntersects(rect, visibleRect)
      ));
      range.detach();

      if (isNodeNearVisibleArea) {
        visibleText.push(getVisibleWordsFromTextNode(node, visibleRect));
      }
    }

    node = walker.nextNode();
  }

  return visibleText.join(' ');
}

function getVisibleWordsFromTextNode(node, visibleRect) {
  const words = [];
  const matcher = /\S+/g;
  let match = matcher.exec(node.textContent);

  while (match) {
    const range = document.createRange();
    range.setStart(node, match.index);
    range.setEnd(node, match.index + match[0].length);

    const isVisible = [...range.getClientRects()].some((rect) => (
      rectCenterIsInside(rect, visibleRect)
    ));
    range.detach();

    if (isVisible) {
      words.push(match[0]);
    }

    match = matcher.exec(node.textContent);
  }

  return words.join(' ');
}

function rectIntersects(rect, bounds) {
  return (
    rect.right > bounds.left &&
    rect.left < bounds.right &&
    rect.bottom > bounds.top &&
    rect.top < bounds.bottom
  );
}

function rectCenterIsInside(rect, bounds) {
  // If the word has no size, it's not visible
  if (rect.width === 0 || rect.height === 0) return false;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Horizontal: Generous 40px buffer for column transitions
  // Vertical: Very slight 2px buffer to avoid mathematical edge-cases
  const vBuffer = 2;
  return (
    centerX >= (bounds.left - 40) &&
    centerX <= (bounds.right + 40) &&
    centerY >= (bounds.top - vBuffer) &&
    centerY <= (bounds.bottom + vBuffer)
  );
}

function OnThisPageStrip({ chapterNumber, entries, onOpenEntry }) {
  if (!entries.length) {
    return null;
  }

  return (
    <section className="reader-on-page-strip" aria-label="Ledger entries on this page">
      <div>
        <span>On This Page</span>
        <small>Ch. {chapterNumber}</small>
      </div>
      <div className="reader-on-page-chips">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onOpenEntry(entry.id)}
          >
            {getLedgerEntryDisplayName(entry, chapterNumber)}
          </button>
        ))}
      </div>
    </section>
  );
}

function ReaderHud({
  chapter,
  onNext,
  onPrevious,
  onToc,
  pageIndex,
  progressPercent,
  totalPages,
}) {
  return (
    <section className="reader-hud">
      <div className="reader-page-count">
        <span>Page {pageIndex + 1} of {totalPages}</span>
      </div>
      <div className="reader-progress-track" aria-label={`${progressPercent}% complete`}>
        <span style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="reader-nav-row">
        <button type="button" onClick={onPrevious} disabled={pageIndex === 0}>
          <IconChevronLeft />
          Prev
        </button>
        <button className="reader-chapter-button" type="button" onClick={onToc}>
          <strong>{chapter ? chapter.title.replace(/^Chapter \d+:\s*/, '') : 'Contents'}</strong>
          <span>Table of Contents</span>
        </button>
        <button type="button" onClick={onNext} disabled={pageIndex >= totalPages - 1}>
          Next
          <IconChevronRight />
        </button>
      </div>
      <p className="reader-percent-label">{progressPercent}% complete</p>
    </section>
  );
}

function AppearancePanel({ settings, onDisplayChange, onReflowChange }) {
  return (
    <section className="reader-appearance-panel">
      <SheetHeader eyebrow="Settings" title="Appearance" />
      <div>
        <h3>Text Size</h3>
        <div className="reader-segmented-control" aria-label="Font size">
          {Object.keys(FONT_SIZES).map((size) => (
            <button
              className={settings.fontSize === size ? 'active' : ''}
              key={size}
              type="button"
              onClick={() => onReflowChange('fontSize', size)}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Typeface</h3>
        <div className="reader-segmented-control" aria-label="Typeface">
          {[
            ['serif', 'Serif'],
            ['sans', 'Sans'],
            ['literary', 'Literary'],
            ['modern', 'Modern'],
            ['mono', 'Mono'],
          ].map(([typeface, label]) => (
            <button
              className={settings.typeface === typeface ? 'active' : ''}
              key={typeface}
              type="button"
              onClick={() => onReflowChange('typeface', typeface)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Theme</h3>
        <div className="reader-segmented-control" aria-label="Theme">
          {[
            ['dark-paper', 'Dark'],
            ['sepia', 'Sepia'],
            ['solarized', 'Solar'],
          ].map(([theme, label]) => (
            <button
              className={settings.theme === theme ? 'active' : ''}
              key={theme}
              type="button"
              onClick={() => onDisplayChange('theme', theme)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TocPanel({ chapterStarts, currentChapter, onJump, totalPages }) {
  return (
    <section className="reader-toc-panel">
      <SheetHeader eyebrow="Navigation" title="Contents" />
      {chapterStarts.map((chapter, index) => (
        <button
          className={currentChapter?.chapter === chapter.chapter ? 'active' : ''}
          key={chapter.chapter}
          type="button"
          onClick={() => onJump(chapter.pageIndex)}
        >
          <span>Chapter {chapter.chapter}</span>
          <strong>{chapter.title.replace(/^Chapter \d+:\s*/, '')}</strong>
          <em>
            Page {chapter.pageIndex + 1} · {getChapterPageSpan(chapterStarts, index, totalPages)} pages
          </em>
        </button>
      ))}
    </section>
  );
}

function SearchPanel({
  activeIndex,
  onJump,
  onNext,
  onPrevious,
  onQueryChange,
  onSelectResult,
  query,
  results,
}) {
  return (
    <section className="reader-search-panel">
      <SheetHeader eyebrow="Find" title="Search" />
      <label className="reader-search-field">
        <span>Search this book</span>
        <input
          autoFocus
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Type a phrase..."
          type="search"
          value={query}
        />
      </label>

      <div className="reader-search-meta">
        {query.trim().length < 2
          ? 'Enter at least 2 characters.'
          : `${results.length} result${results.length === 1 ? '' : 's'}`}
      </div>

      {results.length > 0 && (
        <div className="reader-search-nav">
          <button type="button" onClick={onPrevious}>Previous</button>
          <span>{activeIndex + 1} of {results.length}</span>
          <button type="button" onClick={onNext}>Next</button>
        </div>
      )}

      {results.length > 0 ? (
        <div className="reader-search-results">
          {results.map((result, index) => (
            <button
              className={index === activeIndex ? 'active' : ''}
              key={result.id}
              type="button"
              onClick={() => {
                onSelectResult(index);
                onJump(result.pageIndex);
              }}
            >
              <span>Chapter {result.chapter}</span>
              <strong>{result.chapterTitle.replace(/^Chapter \d+:\s*/, '')}</strong>
              <p>{result.excerpt}</p>
            </button>
          ))}
        </div>
      ) : (
        query.trim().length >= 2 && (
          <div className="reader-empty-state">No matches found.</div>
        )
      )}
    </section>
  );
}

function SavedItemsPanel({
  activeTab,
  currentBookmark,
  items,
  onJump,
  onRemoveItem,
  onTabChange,
  onToggleBookmark,
}) {
  const tabs = [
    ['all', 'All'],
    ['bookmarks', 'Bookmarks'],
    ['notes', 'Notes'],
    ['highlights', 'Highlights'],
  ];
  const filteredItems =
    activeTab === 'all'
      ? items
      : items.filter((item) => item.type === activeTab.replace(/s$/, ''));

  return (
    <section className="reader-saved-panel">
      <SheetHeader eyebrow="Saved" title="Saved Items" />
      <div className="reader-saved-action-row">
        <button type="button" onClick={onToggleBookmark}>
          {currentBookmark ? 'Remove Page Bookmark' : 'Bookmark This Page'}
        </button>
      </div>
      <div className="reader-saved-tabs" role="tablist" aria-label="Saved items">
        {tabs.map(([tab, label]) => (
          <button
            className={activeTab === tab ? 'active' : ''}
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="reader-saved-list">
          {filteredItems.map((item) => (
            <article key={item.id}>
              <button type="button" onClick={() => onJump(item.pageIndex)}>
                <span>{item.type}</span>
                <strong>{item.label}</strong>
                <em>{item.chapterTitle || 'Current book'}</em>
                {item.excerpt && <p>{item.excerpt}</p>}
                <small>{Math.round((item.progressRatio || 0) * 100)}% complete</small>
              </button>
              <button
                className="reader-saved-remove"
                type="button"
                aria-label={`Remove ${item.type}`}
                onClick={() => onRemoveItem(item.id)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="reader-empty-state">
          {activeTab === 'notes'
            ? 'Notes will appear here after long-press annotations are added.'
            : activeTab === 'highlights'
              ? 'Highlights will appear here after text selection is added.'
              : 'No saved items yet.'}
        </div>
      )}
    </section>
  );
}

function LedgerPanel({
  activeEntryId,
  activeType,
  chapterNumber,
  onEntrySelect,
  onTypeChange,
}) {
  const entries = useMemo(() => (
    getLedgerEntriesThroughChapter(ledgerEntries, chapterNumber)
      .sort((a, b) => (
        getLedgerEntryDisplayName(a, chapterNumber)
          .localeCompare(getLedgerEntryDisplayName(b, chapterNumber))
      ))
  ), [chapterNumber]);
  const filteredEntries = activeType === 'all'
    ? entries
    : entries.filter((entry) => entry.type === activeType);
  const activeEntry = entries.find((entry) => entry.id === activeEntryId) || null;

  if (activeEntry) {
    return (
      <LedgerDetail
        chapterNumber={chapterNumber}
        entry={activeEntry}
        entries={entries}
        onBack={() => onEntrySelect(null)}
      />
    );
  }

  return (
    <section className="reader-ledger-panel">
      <SheetHeader eyebrow={`Through Chapter ${chapterNumber}`} title="Hillpoint Ledger" />
      <div className="reader-ledger-tabs" role="tablist" aria-label="Ledger categories">
        {['all', ...ledgerTypes].map((type) => (
          <button
            className={activeType === type ? 'active' : ''}
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
          >
            {getLedgerTypeLabel(type)}
          </button>
        ))}
      </div>

      {filteredEntries.length > 0 ? (
        <div className="reader-ledger-list">
          {filteredEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onEntrySelect(entry.id)}
            >
              <span>{getLedgerTypeLabel(entry.type)}</span>
              <strong>{getLedgerEntryDisplayName(entry, chapterNumber)}</strong>
              <p>{entry.shortDefinition}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="reader-empty-state">No Ledger entries in this category yet.</div>
      )}
    </section>
  );
}

function LedgerDetail({ chapterNumber, entry, entries, onBack }) {
  const relationships = resolveLedgerRelationships(entry, entries);
  const timeline = getTimelineThroughChapter(entry, chapterNumber);

  return (
    <section className="reader-ledger-detail">
      <button className="reader-ledger-back" type="button" onClick={onBack}>
        <IconChevronLeft />
        Ledger
      </button>
      <header className="reader-ledger-detail-header">
        <span>{getLedgerTypeLabel(entry.type)}</span>
        <h2>{getLedgerEntryDisplayName(entry, chapterNumber)}</h2>
        <p>{entry.shortDefinition}</p>
      </header>

      <div className="reader-ledger-section">
        <h3>Overview</h3>
        <p>{entry.fullDescription}</p>
      </div>

      {relationships.length > 0 && (
        <div className="reader-ledger-section">
          <h3>Connections</h3>
          <div className="reader-ledger-relationships">
            {relationships.map((relationship) => (
              <div key={`${relationship.type}-${relationship.target}`}>
                <span>{relationship.label}</span>
                {relationship.entry && (
                  <strong>
                    {getLedgerEntryDisplayName(relationship.entry, chapterNumber)}
                  </strong>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {timeline.length > 0 && (
        <div className="reader-ledger-section">
          <h3>Timeline</h3>
          <div className="reader-ledger-timeline">
            {timeline.map((beat) => (
              <article key={`${beat.chapter}-${beat.title}`}>
                <span>Chapter {beat.chapter}</span>
                <strong>{beat.title}</strong>
                <p>{beat.summary}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function getLedgerTypeLabel(type) {
  const labels = {
    all: 'All',
    person: 'People',
    place: 'Places',
    term: 'Terms',
    group: 'Groups',
    object: 'Objects',
    event: 'Events',
  };

  return labels[type] || type;
}

function SheetHeader({ eyebrow, title }) {
  return (
    <header className="reader-sheet-header">
      <span />
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </header>
  );
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconType() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19 10.5 5h3L20 19" />
      <path d="M7 14h10" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  );
}

function IconLedger() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4-4z" />
      <path d="M5 4v16" />
      <path d="M9 8h6" />
      <path d="M9 12h5" />
    </svg>
  );
}

export default Reader;
