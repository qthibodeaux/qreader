import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ledgerEntries } from '../../content/ledger';
import { buildPaginatedBookModel } from '../../engine/buildBookModel';
import { getPageLedgerEntries } from '../../engine/paginateTokens';
import { searchTokenPages } from '../../engine/searchTokenPages';
import { useSnapCarousel } from '../../hooks/useSnapCarousel';
import { TokenReaderPage } from './TokenReaderPage';
import {
  AppearancePanel,
  LedgerPanel,
  NoteEditorPanel,
  OnThisPageStrip,
  ReaderHud,
  SavedItemsPanel,
  SearchPanel,
  TocPanel,
} from './ReaderPanels';
import {
  IconBookmark,
  IconChevronLeft,
  IconLedger,
  IconSearch,
  IconType,
} from './ReaderIcons';
import {
  getInitialReaderSettings,
  loadReaderState,
  loadSavedItems,
  saveReaderState,
  saveSavedItems,
} from '../../utils/readerStorage';
import './Reader.css';

const FONT_SIZES = {
  micro: '0.92rem',
  tiny: '1.04rem',
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

const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.34,
  relaxed: 1.5,
};

const PARAGRAPH_SPACING = {
  tight: '0.52em',
  normal: '0.86em',
  relaxed: '1.22em',
};

const PAGE_GAP_PX = 18;

function getUnlockedChapters(bookData) {
  const todayKey = new Date().toISOString().slice(0, 10);
  return bookData.chapters.filter((chapter) => !chapter.date || chapter.date <= todayKey);
}

function Reader({ bookData, onExit }) {
  const savedReaderState = useMemo(() => loadReaderState(bookData.id), [bookData.id]);
  const flowWrapRef = useRef(null);
  const flowRef = useRef(null);
  const selectionMenuRef = useRef(null);
  const pendingRatioRef = useRef(savedReaderState?.progressRatio ?? null);
  const pendingWordIdRef = useRef(savedReaderState?.startWordId ?? null);
  const pageIndexRef = useRef(0);
  const currentPageRef = useRef(null);
  const totalPagesRef = useRef(1);
  const overlayTimerRef = useRef(null);
  const hasMeasuredInitialPageRef = useRef(false);
  const canPersistReaderStateRef = useRef(false);

  const [settings, setSettings] = useState(() => getInitialReaderSettings(bookData.id));
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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
  const [ledgerTooltip, setLedgerTooltip] = useState(null);
  const [selectionMenu, setSelectionMenu] = useState(null);
  const [pendingNoteSelection, setPendingNoteSelection] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savedItems, setSavedItems] = useState(() => loadSavedItems(bookData.id));
  const [readerPages, setReaderPages] = useState([]);

  const chapters = useMemo(() => getUnlockedChapters(bookData), [bookData]);

  const searchResults = useMemo(
    () => searchTokenPages(readerPages, searchQuery),
    [readerPages, searchQuery]
  );
  const activeSearchResult = searchResults[activeSearchIndex] ?? null;
  const currentPage = readerPages[pageIndex] || null;
  const visiblePageIndices = useMemo(
    () => [pageIndex - 1, pageIndex, pageIndex + 1]
      .filter((index) => index >= 0 && index < readerPages.length),
    [pageIndex, readerPages.length]
  );

  useEffect(() => {
    setActiveSearchIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (activeSearchResult) {
      setPageIndex(activeSearchResult.pageIndex);
    }
  }, [activeSearchResult]);

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
      setLedgerTooltip(null);
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
    if (ledgerTooltip) {
      setLedgerTooltip(null);
      return;
    }

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
    if (!wrap || wrap.clientWidth === 0 || wrap.clientHeight === 0) {
      return;
    }

    const model = buildPaginatedBookModel(
      chapters,
      {
        layoutOptions: {
          fontFamily: TYPEFACES[settings.typeface],
          fontSize: FONT_SIZES[settings.fontSize],
          lineHeight: LINE_HEIGHTS[settings.lineHeight],
          paragraphGap: PARAGRAPH_SPACING[settings.paragraphSpacing],
          textAlign: 'justify',
          viewHeight: wrap.clientHeight,
          viewWidth: wrap.clientWidth,
        },
      }
    );
    const measuredPages = model.pages.length || 1;
    const measuredChapterStarts = model.pages
      .filter((page) => page.type === 'chapter-title')
      .map((page) => ({
        chapter: page.chapter,
        title: page.chapterTitle,
        pageIndex: page.pageIndex,
      }));
    const wordAnchor = pendingWordIdRef.current;
    const fallbackRatio = pendingRatioRef.current ??
      (!canPersistReaderStateRef.current && savedReaderState?.progressRatio !== undefined
        ? savedReaderState.progressRatio
        : pageIndexRef.current / Math.max(totalPagesRef.current - 1, 1));
    const anchoredPageIndex = wordAnchor
      ? model.pages.find((page) => (
          page.type === 'content' &&
          page.startWordId <= wordAnchor &&
          page.endWordId >= wordAnchor
        ))?.pageIndex
      : null;
    const nextIndex = anchoredPageIndex ?? Math.min(
      measuredPages - 1,
      Math.max(0, Math.round(fallbackRatio * Math.max(measuredPages - 1, 0)))
    );

    pendingRatioRef.current = null;
    pendingWordIdRef.current = null;
    setReaderPages(model.pages);
    setTotalPages(measuredPages);
    setPageIndex(nextIndex);
    setChapterStarts(measuredChapterStarts);
    setIsFormatting(false);
    hasMeasuredInitialPageRef.current = true;
  }, [
    chapters,
    savedReaderState,
    settings.fontSize,
    settings.lineHeight,
    settings.paragraphSpacing,
    settings.typeface,
  ]);

  useLayoutEffect(() => {
    setIsFormatting(true);
    const frame = requestAnimationFrame(measurePages);
    return () => cancelAnimationFrame(frame);
  }, [
    settings.fontSize,
    settings.lineHeight,
    settings.paragraphSpacing,
    settings.typeface,
    chapters,
    measurePages,
  ]);

  useLayoutEffect(() => {
    const wrap = flowWrapRef.current;
    if (!wrap) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      if (canPersistReaderStateRef.current) {
        pendingWordIdRef.current = currentPageRef.current?.startWordId ?? null;
        pendingRatioRef.current = pendingWordIdRef.current
          ? null
          : pageIndexRef.current / Math.max(totalPagesRef.current - 1, 1);
      }
      measurePages();
    });

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [measurePages]);

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

      if (!ancestorElement.closest('.reader-token-page-current')) {
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
    pendingWordIdRef.current = currentPage?.startWordId ?? null;
    pendingRatioRef.current = pendingWordIdRef.current
      ? null
      : pageIndex / Math.max(totalPages - 1, 1);
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
          startWordId: currentPage?.startWordId ?? null,
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

  const jumpToSavedItem = (item) => {
    const anchorWordId = item.startWordId ?? item.anchor?.startWordId ?? null;
    const anchoredPage = anchorWordId
      ? readerPages.find((page) => (
          page.type === 'content' &&
          page.startWordId <= anchorWordId &&
          page.endWordId >= anchorWordId
        ))
      : null;

    setPageIndex(anchoredPage?.pageIndex ?? item.pageIndex ?? 0);
    hideOverlay();
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
          startWordId: range.startWordId ?? currentPage?.startWordId ?? null,
          chapter: range.chapter,
          chapterTitle: currentChapter?.title ?? bookData.title,
          label: type === 'note' ? 'Note' : 'Highlight',
          excerpt: range.text,
          note: type === 'note' ? '' : null,
          color: type === 'highlight' ? 'accent' : null,
          anchor: {
            chapter: range.chapter,
            paragraphIndex: range.paragraphIndex,
            startWordId: range.startWordId,
            endWordId: range.endWordId,
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
          startWordId: currentPage?.startWordId ?? null,
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

  const openNoteEditor = () => {
    if (!selectionMenu?.text) {
      return;
    }

    setPendingNoteSelection({
      text: selectionMenu.text,
      ranges: selectionMenu.ranges || [],
    });
    setEditingNoteId(null);
    setNoteDraft('');
    clearReaderSelection();
    showOverlay('note');
  };

  const editSavedNote = (item) => {
    if (item.type !== 'note') {
      return;
    }

    setPendingNoteSelection({
      text: item.excerpt || '',
      ranges: item.anchor ? [item.anchor] : [],
      item,
    });
    setEditingNoteId(item.id);
    setNoteDraft(item.note || '');
    showOverlay('note');
  };

  const saveNoteDraft = () => {
    const noteText = noteDraft.trim();
    if (!pendingNoteSelection?.text || !noteText) {
      return;
    }

    if (editingNoteId) {
      const updatedAt = new Date().toISOString();
      const nextItems = savedItems.map((item) => (
        item.id === editingNoteId
          ? {
              ...item,
              note: noteText,
              updatedAt,
            }
          : item
      ));

      setSavedItems(nextItems);
      saveSavedItems(bookData.id, nextItems);
      setPendingNoteSelection(null);
      setEditingNoteId(null);
      setNoteDraft('');
      setActiveSavedTab('notes');
      showOverlay('saved');
      return;
    }

    const createdAt = new Date().toISOString();
    const sourceRange = pendingNoteSelection.ranges?.[0];
    const noteItem = {
      id: `note-${pageIndex}-${Date.now()}`,
      type: 'note',
      bookId: bookData.id,
      pageIndex,
      progressRatio: pageIndex / Math.max(totalPages - 1, 1),
      startWordId: sourceRange?.startWordId ?? currentPage?.startWordId ?? null,
      chapter: sourceRange?.chapter ?? currentChapter?.chapter ?? null,
      chapterTitle: currentChapter?.title ?? bookData.title,
      label: 'Note',
      excerpt: pendingNoteSelection.text,
      note: noteText,
      color: null,
      anchor: sourceRange
        ? {
            chapter: sourceRange.chapter,
            paragraphIndex: sourceRange.paragraphIndex,
            startWordId: sourceRange.startWordId,
            endWordId: sourceRange.endWordId,
            startOffset: sourceRange.startOffset,
            endOffset: sourceRange.endOffset,
          }
        : null,
      createdAt,
    };
    const nextItems = [noteItem, ...savedItems];

    setSavedItems(nextItems);
    saveSavedItems(bookData.id, nextItems);
    setPendingNoteSelection(null);
    setEditingNoteId(null);
    setNoteDraft('');
    setActiveSavedTab('notes');
    showOverlay('saved');
  };

  const cancelNoteDraft = () => {
    setPendingNoteSelection(null);
    setEditingNoteId(null);
    setNoteDraft('');
    showOverlay(editingNoteId ? 'saved' : null);
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
      startWordId: currentPage?.startWordId ?? null,
      totalPages,
      updatedAt: new Date().toISOString(),
    });
  }, [bookData.id, currentPage, pageIndex, settings, totalPages]);

  const { dragX, isDragging, carouselHandlers } = useSnapCarousel({
    count: totalPages,
    index: pageIndex,
    onIndexChange: setPageIndex,
    threshold: 58,
    velocityThreshold: 0.35,
  });

  const progressPercent =
    totalPages > 1 ? Math.round((pageIndex / (totalPages - 1)) * 100) : 0;

  useLayoutEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const currentChapter = currentPage?.chapter
    ? {
        chapter: currentPage.chapter,
        title: currentPage.chapterTitle,
        pageIndex,
      }
    : [...chapterStarts].reverse().find((chapter) => chapter.pageIndex <= pageIndex);
  const ledgerChapterNumber = currentChapter?.chapter ?? 1;
  const readerThemeClass = `reader-theme-${settings.theme}`;
  const ledgerTooltipEntry = ledgerTooltip
    ? ledgerEntries.find((entry) => entry.id === ledgerTooltip.entryId)
    : null;

  useEffect(() => {
    if (!currentPage || activePanel) {
      setOnThisPageEntries([]);
      return;
    }

    setOnThisPageEntries(
      getPageLedgerEntries(currentPage, ledgerEntries)
        .filter((entry) => entry.firstChapter <= ledgerChapterNumber)
        .slice(0, 8)
    );
  }, [activePanel, currentPage, ledgerChapterNumber]);

  useEffect(() => {
    setLedgerTooltip(null);
  }, [pageIndex]);

  const showLedgerTooltip = (entryId, rect) => {
    const entry = ledgerEntries.find((candidate) => candidate.id === entryId);
    if (!entry || entry.firstChapter > ledgerChapterNumber) {
      return;
    }

    const tooltipWidth = 278;
    const tooltipHeight = 154;
    const x = Math.min(
      window.innerWidth - tooltipWidth - 12,
      Math.max(12, rect.left + rect.width / 2 - tooltipWidth / 2)
    );
    const belowY = rect.bottom + 12;
    const aboveY = rect.top - tooltipHeight - 12;
    const y = belowY + tooltipHeight < window.innerHeight - 12
      ? belowY
      : Math.max(12, aboveY);

    setLedgerTooltip({ entryId, x, y });
    setOverlayVisible(false);
    setActivePanel(null);
  };

  const openLedgerTooltipEntry = () => {
    if (!ledgerTooltip?.entryId) {
      return;
    }

    setActiveLedgerEntryId(ledgerTooltip.entryId);
    setLedgerTooltip(null);
    showOverlay('ledger');
  };

  return (
    <main
      className={`reader-shell ${readerThemeClass}`}
      style={{
        '--reader-custom-bg': settings.customBackground,
        '--reader-custom-text': settings.customText,
      }}
    >
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
            {visiblePageIndices.map((visiblePageIndex) => {
              const visiblePage = readerPages[visiblePageIndex];
              const pageOffset = visiblePageIndex - pageIndex;
              const isCurrentVisiblePage = visiblePageIndex === pageIndex;

              return (
                <div
                  aria-hidden={!isCurrentVisiblePage}
                  className={`reader-token-page${isCurrentVisiblePage ? ' reader-token-page-current' : ' reader-token-page-neighbor'}`}
                  key={visiblePageIndex}
                  ref={isCurrentVisiblePage ? flowRef : null}
                  style={{
                    '--reader-font-size': FONT_SIZES[settings.fontSize],
                    '--reader-font-family': TYPEFACES[settings.typeface],
                    '--reader-line-height': LINE_HEIGHTS[settings.lineHeight],
                    '--reader-paragraph-spacing': PARAGRAPH_SPACING[settings.paragraphSpacing],
                    transform: `translateX(calc(${pageOffset * 100}% + ${pageOffset * PAGE_GAP_PX}px + ${dragX}px))`,
                  }}
                >
                  <TokenReaderPage
                    activeSearchResult={
                      activeSearchResult?.pageIndex === visiblePageIndex
                        ? activeSearchResult
                        : null
                    }
                    bookData={bookData}
                    ledgerChapterNumber={ledgerChapterNumber}
                    ledgerEntries={ledgerEntries}
                    onLedgerTokenClick={showLedgerTooltip}
                    page={visiblePage}
                    savedItems={savedItems}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="reader-page-number" aria-hidden="true">
        {pageIndex + 1}
      </div>

      {ledgerTooltipEntry && (
        <section
          className="reader-ledger-tooltip"
          style={{ left: `${ledgerTooltip.x}px`, top: `${ledgerTooltip.y}px` }}
          onClick={(event) => event.stopPropagation()}
        >
          <div>
            <span>{getLedgerTypeLabel(ledgerTooltipEntry.type)}</span>
            <h3>{ledgerTooltipEntry.name}</h3>
            <p>{ledgerTooltipEntry.shortDefinition}</p>
          </div>
          <button type="button" onClick={openLedgerTooltipEntry}>
            Open Ledger
          </button>
        </section>
      )}

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
          <button type="button" onClick={openNoteEditor}>
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
              fontSizes={FONT_SIZES}
              typefaces={TYPEFACES}
              settings={settings}
              onDisplayChange={updateDisplaySetting}
              onReflowChange={updateReflowSetting}
            />
          )}

          {activePanel === 'toc' && (
            <TocPanel
              chapterStarts={chapterStarts}
              currentChapter={currentChapter}
              currentPageIndex={pageIndex}
              totalPages={totalPages}
              onJump={(nextPageIndex) => {
                setPageIndex(nextPageIndex);
                hideOverlay();
              }}
              onOpenLedger={() => {
                setActiveLedgerEntryId(null);
                showOverlay('ledger');
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
              onNext={() => {
                const nextIndex = searchResults.length
                  ? (activeSearchIndex + 1) % searchResults.length
                  : 0;
                setActiveSearchIndex(nextIndex);
                setPageIndex(searchResults[nextIndex]?.pageIndex ?? pageIndex);
              }}
              onPrevious={() => {
                const nextIndex = searchResults.length
                  ? (activeSearchIndex - 1 + searchResults.length) % searchResults.length
                  : 0;
                setActiveSearchIndex(nextIndex);
                setPageIndex(searchResults[nextIndex]?.pageIndex ?? pageIndex);
              }}
              onQueryChange={setSearchQuery}
              onSelectResult={(index) => {
                setActiveSearchIndex(index);
                setPageIndex(searchResults[index]?.pageIndex ?? pageIndex);
              }}
            />
          )}

          {activePanel === 'note' && (
            <NoteEditorPanel
              draft={noteDraft}
              isEditing={Boolean(editingNoteId)}
              selection={pendingNoteSelection}
              onCancel={cancelNoteDraft}
              onChange={setNoteDraft}
              onSave={saveNoteDraft}
            />
          )}

          {activePanel === 'saved' && (
            <SavedItemsPanel
              activeTab={activeSavedTab}
              currentBookmark={currentBookmark}
              items={savedItems}
              onEditNote={editSavedNote}
              onJump={jumpToSavedItem}
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

function getSelectedParagraphRanges(range, flow) {
  const selectedWords = [...flow.querySelectorAll('[data-reader-word="true"]')]
    .filter((wordNode) => range.intersectsNode(wordNode));

  if (!selectedWords.length) {
    return [];
  }

  const firstWord = selectedWords[0];
  const lastWord = selectedWords[selectedWords.length - 1];

  return [{
    chapter: Number(firstWord.dataset.chapter),
    paragraphIndex: Number(firstWord.dataset.paragraphIndex),
    startOffset: 0,
    endOffset: selectedWords.map((wordNode) => wordNode.textContent).join(' ').length,
    startWordId: Number(firstWord.dataset.wordId),
    endWordId: Number(lastWord.dataset.wordId),
    text: selectedWords.map((wordNode) => wordNode.textContent).join(' ').trim(),
  }];
}

function getLedgerTypeLabel(type) {
  const labels = {
    event: 'Event',
    group: 'Group',
    object: 'Object',
    person: 'Person',
    place: 'Place',
    term: 'Term',
  };

  return labels[type] || type;
}

export default Reader;
