import { useMemo } from 'react';
import { ledgerEntries, ledgerTypes } from '../../content/ledger';
import {
  getLedgerEntriesThroughChapter,
  getLedgerEntryDisplayName,
  getTimelineThroughChapter,
  resolveLedgerRelationships,
} from '../../utils/ledgerUtils';
import { IconChevronLeft, IconChevronRight } from './ReaderIcons';

export function OnThisPageStrip({ chapterNumber, entries, onOpenEntry }) {
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

export function ReaderHud({
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

export function AppearancePanel({
  fontSizes,
  typefaces,
  settings,
  onDisplayChange,
  onReflowChange,
}) {
  const themes = [
    ['dark-paper', 'Dark', '#000000', '#aaa39b'],
    ['sepia', 'Sepia', '#efe3cf', '#5b402b'],
    ['solarized', 'Solar', '#002b36', '#eee8d5'],
    ['oled', 'OLED', '#000000', '#f2f2f2'],
    ['forest', 'Forest', '#071d17', '#d8e2d4'],
    ['custom', 'Custom', settings.customBackground, settings.customText],
  ];

  return (
    <section className="reader-appearance-panel">
      <SheetHeader eyebrow="Settings" title="Appearance" />
      <div>
        <h3>Text Size</h3>
        <div className="reader-segmented-control" aria-label="Font size">
          {Object.keys(fontSizes).map((size, index) => (
            <button
              className={settings.fontSize === size ? 'active' : ''}
              key={size}
              type="button"
              onClick={() => onReflowChange('fontSize', size)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Typeface</h3>
        <div className="reader-typeface-control" aria-label="Typeface">
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
              style={{ fontFamily: typefaces[typeface] }}
              type="button"
              onClick={() => onReflowChange('typeface', typeface)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Line Height</h3>
        <div className="reader-spacing-control" aria-label="Line height">
          {[
            ['tight', 'Tight'],
            ['normal', 'Normal'],
            ['relaxed', 'Relaxed'],
          ].map(([lineHeight, label]) => (
            <button
              className={settings.lineHeight === lineHeight ? 'active' : ''}
              key={lineHeight}
              type="button"
              onClick={() => onReflowChange('lineHeight', lineHeight)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Paragraph Spacing</h3>
        <div className="reader-spacing-control" aria-label="Paragraph spacing">
          {[
            ['tight', 'Tight'],
            ['normal', 'Normal'],
            ['relaxed', 'Relaxed'],
          ].map(([paragraphSpacing, label]) => (
            <button
              className={settings.paragraphSpacing === paragraphSpacing ? 'active' : ''}
              key={paragraphSpacing}
              type="button"
              onClick={() => onReflowChange('paragraphSpacing', paragraphSpacing)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Theme</h3>
        <div className="reader-theme-control" aria-label="Theme">
          {themes.map(([theme, label, background, text]) => (
            <button
              className={settings.theme === theme ? 'active' : ''}
              key={theme}
              type="button"
              onClick={() => onDisplayChange('theme', theme)}
            >
              <span
                className="reader-theme-preview"
                style={{
                  '--theme-preview-bg': background,
                  '--theme-preview-text': text,
                }}
              />
              <strong>{label}</strong>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Custom Colors</h3>
        <div className="reader-custom-color-grid">
          <label>
            <span>Background</span>
            <input
              type="color"
              value={settings.customBackground}
              onChange={(event) => {
                onDisplayChange('customBackground', event.target.value);
                onDisplayChange('theme', 'custom');
              }}
            />
          </label>
          <label>
            <span>Text</span>
            <input
              type="color"
              value={settings.customText}
              onChange={(event) => {
                onDisplayChange('customText', event.target.value);
                onDisplayChange('theme', 'custom');
              }}
            />
          </label>
        </div>
      </div>
    </section>
  );
}

export function TocPanel({
  chapterStarts,
  currentChapter,
  currentPageIndex,
  onJump,
  onOpenLedger,
  totalPages,
}) {
  return (
    <section className="reader-toc-panel">
      <SheetHeader eyebrow="Navigation" title="Contents" />
      <div className="reader-toc-section">
        <p>Front Matter</p>
        <button
          className={currentPageIndex === 0 ? 'active' : ''}
          type="button"
          onClick={() => onJump(0)}
        >
          <span>Start</span>
          <strong>Cover</strong>
          <em>Page 1</em>
        </button>
        <button
          className={currentPageIndex === 1 ? 'active' : ''}
          type="button"
          onClick={() => onJump(1)}
        >
          <span>Front Matter</span>
          <strong>Title Page</strong>
          <em>Page 2</em>
        </button>
        <button type="button" onClick={onOpenLedger}>
          <span>Companion</span>
          <strong>Hillpoint Ledger</strong>
          <em>Through Chapter {currentChapter?.chapter ?? 1}</em>
        </button>
      </div>

      <div className="reader-toc-section">
        <p>Chapters</p>
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
              Page {chapter.pageIndex + 1} - {getChapterPageSpan(chapterStarts, index, totalPages)} pages
            </em>
          </button>
        ))}
      </div>
    </section>
  );
}

export function SearchPanel({
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

export function NoteEditorPanel({
  draft,
  isEditing = false,
  onCancel,
  onChange,
  onSave,
  selection,
}) {
  const canSave = Boolean(draft.trim() && selection?.text);

  return (
    <section className="reader-note-panel">
      <SheetHeader eyebrow="Annotation" title={isEditing ? 'Edit Note' : 'New Note'} />
      <div className="reader-note-excerpt">
        <span>Selected Text</span>
        <p>{selection?.text || 'No text selected.'}</p>
      </div>
      <label className="reader-note-field">
        <span>Your note</span>
        <textarea
          autoFocus
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write your thought..."
          rows={5}
          value={draft}
        />
      </label>
      <div className="reader-note-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" onClick={onSave} disabled={!canSave}>
          {isEditing ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </section>
  );
}

export function SavedItemsPanel({
  activeTab,
  currentBookmark,
  items,
  onEditNote,
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
              <button type="button" onClick={() => onJump(item)}>
                <span>{item.type}</span>
                <strong>{item.label}</strong>
                <em>{item.chapterTitle || 'Current book'}</em>
                {item.note && <p>{item.note}</p>}
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
              {item.type === 'note' && (
                <button
                  className="reader-saved-edit"
                  type="button"
                  aria-label="Edit note"
                  onClick={() => onEditNote(item)}
                >
                  Edit
                </button>
              )}
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

export function LedgerPanel({
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

function SheetHeader({ eyebrow, title }) {
  return (
    <header className="reader-sheet-header">
      <span />
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </header>
  );
}

function getChapterPageSpan(chapterStarts, index, totalPages) {
  const chapter = chapterStarts[index];
  const nextChapter = chapterStarts[index + 1];
  const endPage = nextChapter ? nextChapter.pageIndex - 1 : totalPages - 1;
  return Math.max(1, endPage - chapter.pageIndex + 1);
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
